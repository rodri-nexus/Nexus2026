// app/privacidad/page.tsx
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export const metadata = {
  title: "Política de Privacidad · Nevux",
  description:
    "Cómo Nevux recolecta, usa y protege los datos personales de sus usuarios.",
};

// Fecha de última actualización (actualizar cuando se modifique la política)
const LAST_UPDATE = "15 de enero de 2025";

export default function PrivacidadPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#000000",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #f3f4f6",
          padding: "1rem 1.25rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "#000000",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
          <NevuxLogo size="small" />
        </div>
      </header>

      {/* Contenido */}
      <main
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 4rem",
          boxSizing: "border-box",
        }}
      >
        {/* Título */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.85rem",
              background: "#fff5f5",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#FF0000",
              fontWeight: 700,
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Shield size={12} />
            Documento legal
          </div>

          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 0.5rem 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Política de Privacidad
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#000000",
              opacity: 0.6,
            }}
          >
            Última actualización: <strong>{LAST_UPDATE}</strong>
          </p>
        </div>

        {/* Intro */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
            borderRadius: "12px",
            marginBottom: "2rem",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "#000000",
          }}
        >
          En Nevux respetamos y protegemos tu privacidad. Esta Política explica
          qué datos recolectamos, cómo los usamos, con quién los compartimos y
          qué derechos tenés sobre ellos. Está en cumplimiento con la Ley
          25.326 de Protección de Datos Personales de la República Argentina.
        </div>

        {/* Secciones */}
        <Section number="1" title="Responsable del tratamiento">
          <P>El responsable del tratamiento de tus datos personales es:</P>
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
              borderRadius: "10px",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              fontSize: "0.92rem",
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Nombre:</strong> Rodrigo Lazaro Spehgt
            </p>
            <p style={{ margin: "0.35rem 0 0 0" }}>
              <strong>Ubicación:</strong> Diamante, Entre Ríos, Argentina
            </p>
            <p style={{ margin: "0.35rem 0 0 0" }}>
              <strong>Contacto:</strong>{" "}
              <a
                href="mailto:soportenevux@gmail.com"
                style={{
                  color: "#FF0000",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                soportenevux@gmail.com
              </a>
            </p>
          </div>
        </Section>

        <Section number="2" title="Datos que recolectamos">
          <P>
            Para brindar el servicio de Nevux, recolectamos los siguientes
            datos:
          </P>

          <h3 style={subheadingStyle}>2.1 Datos de registro</h3>
          <UL>
            <li>Dirección de email.</li>
            <li>Contraseña (almacenada de forma encriptada).</li>
            <li>Fecha y hora de registro.</li>
          </UL>

          <h3 style={subheadingStyle}>
            2.2 Datos de tu tienda de Tiendanube
          </h3>
          <UL>
            <li>ID de la tienda.</li>
            <li>
              Token de acceso (necesario para que Nevux pueda instalar widgets
              en tu tienda).
            </li>
            <li>Nombre de tu tienda.</li>
            <li>Cantidad de productos y categorías (para métricas).</li>
          </UL>
          <P>
            <strong>Importante:</strong> Nevux NO accede a datos personales de
            tus clientes finales (nombres, emails, direcciones ni datos de
            tarjetas). Solo accedemos a información pública de productos y
            configuración de tu tienda.
          </P>

          <h3 style={subheadingStyle}>2.3 Datos de pago</h3>
          <UL>
            <li>
              Comprobante de transferencia bancaria (imagen o PDF, almacenado
              de forma segura y privada).
            </li>
            <li>Referencia de la transferencia (número/código opcional).</li>
            <li>Historial de pagos aprobados y rechazados.</li>
          </UL>
          <P>
            Nevux NO almacena datos de tarjetas de crédito, débito ni
            credenciales bancarias.
          </P>

          <h3 style={subheadingStyle}>2.4 Datos de uso</h3>
          <UL>
            <li>Widgets creados, activados y configurados.</li>
            <li>Estado del plan (trial, activo, expirado).</li>
            <li>Meses de fidelidad acumulados.</li>
            <li>Fechas de acceso a la App.</li>
          </UL>

          <h3 style={subheadingStyle}>2.5 Feedback y opiniones</h3>
          <UL>
            <li>
              Respuestas al formulario &quot;¿Te gustó Nevux?&quot; (si el
              usuario decide responder).
            </li>
            <li>
              Comentarios y sugerencias enviados voluntariamente por el
              usuario.
            </li>
          </UL>
        </Section>

        <Section number="3" title="Cómo usamos tus datos">
          <P>Utilizamos tus datos personales exclusivamente para:</P>
          <UL>
            <li>Brindarte el servicio de Nevux.</li>
            <li>
              Instalar, modificar y desinstalar widgets en tu tienda de
              Tiendanube.
            </li>
            <li>Procesar y verificar tus pagos.</li>
            <li>
              Enviarte notificaciones importantes sobre tu cuenta (vencimiento
              de plan, aprobación de pagos, cambios en el servicio).
            </li>
            <li>Brindarte soporte técnico cuando lo solicites.</li>
            <li>
              Mejorar la App analizando el uso general (de forma agregada y
              anónima).
            </li>
            <li>Cumplir con obligaciones legales y fiscales.</li>
          </UL>
          <P>
            <strong>NO utilizamos tus datos para:</strong>
          </P>
          <UL>
            <li>Enviarte publicidad de terceros.</li>
            <li>Vender o alquilar tus datos a terceros.</li>
            <li>Compartir tu información sin tu consentimiento explícito.</li>
          </UL>
        </Section>

        <Section number="4" title="Almacenamiento y seguridad">
          <P>
            Tus datos se almacenan en servidores seguros de{" "}
            <strong>Supabase</strong> (proveedor de infraestructura con
            certificaciones internacionales de seguridad) y{" "}
            <strong>Vercel</strong> (plataforma de hosting).
          </P>
          <P>Aplicamos las siguientes medidas de seguridad:</P>
          <UL>
            <li>Contraseñas encriptadas con algoritmos estándar.</li>
            <li>Conexión HTTPS en todas las comunicaciones.</li>
            <li>
              Comprobantes de pago almacenados en un bucket privado con acceso
              restringido.
            </li>
            <li>
              Tokens de acceso a Tiendanube protegidos y accesibles únicamente
              por procesos internos autorizados.
            </li>
            <li>Backups periódicos y monitoreo continuo.</li>
          </UL>
          <P>
            Pese a nuestras medidas, ninguna transmisión por Internet es 100%
            segura. Si detectás alguna vulnerabilidad, contactanos
            inmediatamente.
          </P>
        </Section>

        <Section number="5" title="Terceros con los que compartimos datos">
          <P>
            Nevux comparte datos únicamente con los siguientes proveedores, y
            solo lo mínimo necesario para operar:
          </P>
          <UL>
            <li>
              <strong>Tiendanube:</strong> para integrar los widgets con tu
              tienda. Nevux accede a la API oficial de Tiendanube con los
              permisos que otorgás durante la instalación.
            </li>
            <li>
              <strong>Supabase:</strong> proveedor de base de datos y
              autenticación. Almacena tus datos de forma segura.
            </li>
            <li>
              <strong>Vercel:</strong> hosting de la aplicación. Procesa las
              peticiones web pero no almacena datos personales de forma
              permanente.
            </li>
            <li>
              <strong>Resend:</strong> servicio de envío de emails
              transaccionales. Utilizamos únicamente para notificar
              vencimientos y pagos.
            </li>
          </UL>
          <P>
            <strong>
              Nevux NUNCA vende, alquila ni cede tus datos a terceros con fines
              comerciales o publicitarios.
            </strong>
          </P>
        </Section>

        <Section number="6" title="Tiempo de conservación">
          <P>
            Conservamos tus datos personales durante todo el tiempo que
            mantengas tu cuenta activa en Nevux.
          </P>
          <P>
            Si decidís eliminar tu cuenta o desinstalar la App, procederemos a:
          </P>
          <UL>
            <li>
              Eliminar tu información personal en un plazo máximo de 30
              (treinta) días.
            </li>
            <li>
              Conservar los registros de pagos por 10 (diez) años, según lo
              exige la normativa fiscal argentina.
            </li>
            <li>
              Mantener datos anonimizados con fines estadísticos (sin
              posibilidad de identificarte).
            </li>
          </UL>
        </Section>

        <Section number="7" title="Tus derechos">
          <P>
            En cumplimiento con la Ley 25.326 de Protección de Datos
            Personales, tenés los siguientes derechos sobre tus datos:
          </P>
          <UL>
            <li>
              <strong>Acceso:</strong> podés solicitar una copia de todos los
              datos personales que tenemos sobre vos.
            </li>
            <li>
              <strong>Rectificación:</strong> podés pedir que corrijamos datos
              incorrectos o desactualizados.
            </li>
            <li>
              <strong>Supresión:</strong> podés solicitar que eliminemos tus
              datos (con las excepciones legales indicadas en el punto 6).
            </li>
            <li>
              <strong>Oposición:</strong> podés oponerte al tratamiento de tus
              datos para fines específicos.
            </li>
            <li>
              <strong>Portabilidad:</strong> podés solicitar una copia de tus
              datos en formato estructurado.
            </li>
          </UL>
          <P>
            Para ejercer cualquiera de estos derechos, escribinos a{" "}
            <a
              href="mailto:soportenevux@gmail.com"
              style={{
                color: "#FF0000",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              soportenevux@gmail.com
            </a>
            . Responderemos en un plazo máximo de 10 (diez) días hábiles.
          </P>
          <P>
            Tenés también la facultad de presentar reclamos ante la{" "}
            <strong>
              Agencia de Acceso a la Información Pública (AAIP)
            </strong>
            , órgano de control de la Ley 25.326.
          </P>
        </Section>

        <Section number="8" title="Cookies y tecnologías similares">
          <P>Nevux utiliza cookies estrictamente necesarias para:</P>
          <UL>
            <li>Mantener tu sesión iniciada mientras usás la App.</li>
            <li>
              Recordar preferencias básicas (como si completaste el tutorial
              de onboarding).
            </li>
            <li>Garantizar la seguridad de la sesión.</li>
          </UL>
          <P>
            No utilizamos cookies de terceros para publicidad ni tracking de
            comportamiento. No usamos Google Analytics ni herramientas
            similares que recolecten datos personales.
          </P>
          <P>
            Podés configurar tu navegador para bloquear cookies, aunque esto
            puede afectar el funcionamiento normal de la App.
          </P>
        </Section>

        <Section number="9" title="Menores de edad">
          <P>
            Nevux está destinado a personas mayores de 18 (dieciocho) años que
            operan una tienda comercial. No recolectamos datos de menores de
            edad de forma intencional.
          </P>
          <P>
            Si detectás que un menor de edad ha proporcionado datos a Nevux,
            contactanos inmediatamente para proceder a su eliminación.
          </P>
        </Section>

        <Section number="10" title="Transferencia internacional de datos">
          <P>
            Nuestros proveedores de infraestructura (Supabase, Vercel, Resend)
            pueden almacenar datos en servidores ubicados fuera de Argentina,
            generalmente en Estados Unidos y otros países.
          </P>
          <P>
            Estos proveedores cumplen con estándares internacionales de
            protección de datos y aplican medidas técnicas y organizativas
            adecuadas para garantizar tu privacidad.
          </P>
        </Section>

        <Section number="11" title="Modificaciones a esta Política">
          <P>
            Podemos actualizar esta Política de Privacidad para reflejar
            cambios en nuestras prácticas o en la legislación aplicable.
          </P>
          <P>
            Cuando realicemos cambios significativos, te notificaremos por
            email con al menos 15 (quince) días de anticipación antes de que
            entren en vigor.
          </P>
          <P>
            La fecha de última actualización siempre aparecerá al inicio de
            este documento.
          </P>
        </Section>

        <Section number="12" title="Consultas y contacto">
          <P>
            Si tenés cualquier duda, consulta o reclamo sobre esta Política de
            Privacidad o sobre el tratamiento de tus datos personales,
            escribinos:
          </P>
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              marginTop: "0.5rem",
              fontSize: "0.92rem",
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:soportenevux@gmail.com"
                style={{
                  color: "#FF0000",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                soportenevux@gmail.com
              </a>
            </p>
            <p style={{ margin: "0.35rem 0 0 0" }}>
              <strong>Respuesta:</strong> hasta 10 días hábiles
            </p>
          </div>
        </Section>

        {/* Compromiso */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            background: "#000000",
            color: "#ffffff",
            borderRadius: "14px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            En Nevux nos comprometemos a proteger tu privacidad y usar tus
            datos únicamente para brindarte el mejor servicio posible.
          </p>
        </div>

        {/* Links relacionados */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1.25rem",
            flexWrap: "wrap",
            fontSize: "0.85rem",
          }}
        >
          <Link
            href="/terminos"
            style={{
              color: "#FF0000",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Términos y Condiciones →
          </Link>
          <Link
            href="/"
            style={{
              color: "#000000",
              opacity: 0.6,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ESTILOS COMPARTIDOS
// ═══════════════════════════════════════════════
const subheadingStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  color: "#000000",
  margin: "1.25rem 0 0.5rem 0",
  letterSpacing: "-0.005em",
};

// ═══════════════════════════════════════════════
// COMPONENTES INTERNOS (sin styled-jsx)
// ═══════════════════════════════════════════════

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "1.25rem",
          fontWeight: 800,
          color: "#000000",
          margin: "0 0 1rem 0",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "32px",
            height: "32px",
            padding: "0 0.5rem",
            background: "#FF0000",
            color: "#ffffff",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {number}
        </span>
        {title}
      </h2>
      <div
        style={{
          fontSize: "0.92rem",
          lineHeight: 1.7,
          color: "#000000",
          paddingLeft: "0.5rem",
        }}
      >
        {children}
      </div>
    </section>
  );
}

// Párrafo con margen consistente
function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 0.85rem 0" }}>
      {children}
    </p>
  );
}

// Lista con estilos consistentes
function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul
      style={{
        margin: "0 0 0.85rem 0",
        paddingLeft: "1.25rem",
        listStyle: "disc",
      }}
    >
      {children}
    </ul>
  );
              }
