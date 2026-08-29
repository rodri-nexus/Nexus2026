// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. BYPASS INMEDIATO (0ms): No trabar APIs, scripts públicos ni assets estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname === "/nevux-widget.js" ||
    pathname === "/" ||
    pathname === "/terminos" ||
    pathname === "/privacidad" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Rutas protegidas del panel que requieren sesión obligatoria
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/widgets") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/productos") ||
    pathname.startsWith("/plan") ||
    pathname.startsWith("/mi-cuenta") ||
    pathname.startsWith("/mi-tienda") ||
    pathname.startsWith("/configuracion");

  // 3. Rutas de autenticación
  const isAuthRoute = pathname === "/login" || pathname === "/registro";

  // Si no es ni ruta privada ni de login/registro, dejar pasar de inmediato
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set({ name, value, ...options })
            );
          },
        },
      }
    );

    // Obtener usuario autenticado de forma segura
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Si intenta entrar a ruta protegida sin sesión -> redirigir a /login
    if (isProtectedRoute && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    // Si ya está autenticado e intenta entrar a /login o /registro -> redirigir a /dashboard
    if (isAuthRoute && user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("Error en middleware auth check:", err);
    if (isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
