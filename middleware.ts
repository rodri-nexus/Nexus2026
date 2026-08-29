// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. BYPASS ULTRA RÁPIDO (0ms): No interceptar APIs, scripts, estáticos ni landing
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

  // 2. Definir rutas privadas y de autenticación
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/widgets") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/productos") ||
    pathname.startsWith("/plan") ||
    pathname.startsWith("/mi-cuenta") ||
    pathname.startsWith("/mi-tienda") ||
    pathname.startsWith("/configuracion");

  const isAuthRoute = pathname === "/login" || pathname === "/registro";

  // Si es una ruta pública no listada, dejar pasar de inmediato
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

    // 3. BLINDAJE ANTI-504: Límite estricto de 2.5 segundos para la respuesta de Supabase
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null }, error: new Error("Auth Timeout") }), 2500)
    );

    const { data: { user } } = await Promise.race([authPromise, timeoutPromise]);

    // Si intenta entrar a ruta privada sin sesión -> redirigir a /login
    if (isProtectedRoute && !user) {
      // Verificar si hay cookies de Supabase guardadas para no expulsar al usuario si hubo timeout
      const hasAuthCookie = request.cookies.getAll().some((c) => c.name.includes("auth-token") || c.name.includes("sb-"));
      if (!hasAuthCookie) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Si ya está autenticado e intenta entrar a /login o /registro -> redirigir a /dashboard
    if (isAuthRoute && user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.warn("Middleware auth check omitido por seguridad:", err);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
