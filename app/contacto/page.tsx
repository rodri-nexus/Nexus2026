import { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto · Nevux",
  description: "Transformá tu Tiendanube con el diseño Premium de Nevux. Pedí tu demo personalizada.",
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nevux
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#premium" className="text-slate-600 hover:text-slate-900 transition">
              Plan Premium
            </Link>
            <Link href="/#casos" className="text-slate-600 hover:text-slate-900 transition">
              Casos de éxito
            </Link>
            <Link href="/contacto" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Contactar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-40" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                🚀 Transformá tu tienda
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Diseño Premium para tu{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tiendanube
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Convertí tu tienda en una experiencia de compra profesional. 
                Más conversiones, más ventas, más clientes satisfechos.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Sin código</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Listo en 48 hs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Soporte incluido</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Pedí tu demo personalizada
                </h2>
                <p className="text-slate-600">
                  Te mostramos cómo va a quedar tu tienda con Nevux Premium
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué Nevux Premium?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Diseño profesional que convierte visitas en ventas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="group p-8 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Conversión optimizada
              </h3>
              <p className="text-slate-600">
                Diseño enfocado en guiar al cliente hacia la compra. Más ventas con el mismo tráfico.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="group p-8 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Mobile-first
              </h3>
              <p className="text-slate-600">
                70% de tus clientes compran desde el celular. Diseño perfecto en todos los dispositivos.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="group p-8 rounded-xl border border-slate-200 hover:border-pink-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Instalación en 1 línea
              </h3>
              <p className="text-slate-600">
                Sin tocar código. Pegás una línea en Tiendanube y listo. Soporte incluido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Caso de éxito */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Casos de éxito
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tiendas reales que transformaron su experiencia de compra
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="grid md:grid-cols-2">
              {/* Left: Image */}
              <div className="relative h-64 md:h-auto bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">+47%</div>
                    <div className="text-slate-600 font-medium">Conversión en 30 días</div>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="p-8 md:p-12">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                  Plan Premium
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Hogar Digital
                </h3>
                <p className="text-slate-600 mb-6">
                  Tienda de audio, smartwatches y accesorios. Con Nevux Premium implementaron 
                  una experiencia de compra profesional que aumentó sus ventas un 47% en el primer mes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Home personalizado con videos de productos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Fichas de producto optimizadas para conversión</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Sección "Detrás de escena" con reels de Instagram</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link 
                    href="https://hogardigital.com.ar" 
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    Ver tienda en vivo
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu tienda?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Te mostramos cómo va a quedar con una demo personalizada
          </p>
          <a 
            href="#form" 
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:shadow-lg transition"
          >
            Pedir mi demo ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">Nevux</div>
              <p className="text-sm text-slate-400">
                Diseño Premium para Tiendanube
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#premium" className="hover:text-white transition">Plan Premium</Link></li>
                <li><Link href="/#casos" className="hover:text-white transition">Casos de éxito</Link></li>
                <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:soporte@nevux.ar" className="hover:text-white transition">soporte@nevux.ar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terminos" className="hover:text-white transition">Términos de uso</Link></li>
                <li><Link href="/privacidad" className="hover:text-white transition">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            © 2026 Nevux. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
