// app/terminos/page.tsx
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export const metadata = {
  title: "Términos y Condiciones · Nevux",
  description:
    "Términos y condiciones de uso de Nevux, la app para aumentar el ticket promedio de tu Tiendanube.",
};

// Fecha de última actualización (actualizar cuando se modifiquen los términos)
const LAST_UPDATE = "15 de enero de 2025";

export default function TerminosPage() {
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
            <FileText size={12} />
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
            Términos y Condiciones
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
          Al instalar y utilizar Nevux (en adelante, "la App"), aceptás estos
          Términos y Condiciones de forma íntegra. Si no estás de acuerdo, no
          instales ni utilices la App. Te recomendamos leerlos con atención.
        </div>

        {/* Secciones */}
        <Section number="1" title="Definiciones">
          <p>
            <strong>Nevux</strong>: aplicación desarrollada por Rodrigo Lazaro
            Spehgt (Diamante, Entre Ríos, Argentina), diseñada para integrarse
            con tiendas de Tiendanube y aumentar el ticket promedio mediante
            widgets personalizables.
          </p>
          <p>
            <strong>Usuario</strong>: persona humana o jurídica que instala y
            utiliza la App en su tienda de Tiendanube.
          </p>
          <p>
            <strong>Tiendanube</strong>: plataforma de e-commerce a través de
            la cual se instala Nevux.
          </p>
          <p>
            <strong>Widgets</strong>: componentes visuales interactivos que
            Nevux instala en tu tienda para incrementar ventas.
          </p>
        </Section>

        <Section number="2" title="Objeto del servicio">
          <p>
            Nevux ofrece un catálogo de widgets personalizables que se integran
            automáticamente con tu Tiendanube. El objetivo es aumentar el ticket
            promedio de tus ventas mediante recomendaciones de productos,
            promociones dinámicas, barras de progreso, temporizadores y otras
            estrategias probadas de e-commerce.
          </p>
          <p>
            La App requiere una tienda activa en Tiendanube y los permisos
            necesarios otorgados durante la instalación.
          </p>
        </Section>

        <Section number="3" title="Registro y cuenta">
          <p>
            Para utilizar Nevux, el Usuario debe:
          </p>
          <ul>
            <li>Tener una cuenta activa en Tiendanube.</li>
            <li>
              Registrarse en Nevux con un email válido y crear una contraseña
              segura.
            </li>
            <li>Conectar su tienda de Tiendanube a Nevux.</li>
            <li>Proporcionar información veraz y actualizada.</li>
          </ul>
          <p>
            El Usuario es el único responsable de mantener la confidencialidad
            de sus credenciales y de todas las actividades realizadas desde su
            cuenta.
          </p>
        </Section>

        <Section number="4" title="Período de prueba gratuito (Trial)">
          <p>
            Nevux ofrece un período de prueba gratuito de{" "}
            <strong>7 (siete) días corridos</strong> desde el momento en que el
            Usuario conecta su tienda de Tiendanube por primera vez.
          </p>
          <p>
            Durante el trial, el Usuario tiene acceso completo a todos los
            widgets y funcionalidades de la App, sin cargo alguno y sin
            requerimiento de datos de pago.
          </p>
          <p>
            El período de prueba es <strong>único e intransferible</strong>. La
            reinstalación de la App o el registro con un nuevo email no genera
            un nuevo trial para la misma tienda.
          </p>
        </Section>

        <Section number="5" title="Planes y precios">
          <p>
            Finalizado el período de prueba, el Usuario debe suscribirse al plan
            mensual para continuar utilizando Nevux.
          </p>
          <p>
            <strong>Plan mensual:</strong> $30.000 ARS (pesos argentinos) por
            mes, con renovación manual mediante transferencia bancaria.
          </p>
          <p>
            El pago se realiza a través de la cuenta Naranja X indicada dentro
            de la App. El Usuario debe subir el comprobante de pago para que
            Nevux verifique y active el plan.
          </p>
          <p>
            Los precios pueden actualizarse con un aviso previo de al menos 15
            (quince) días. Los cambios de precio no afectan a los pagos ya
            procesados.
          </p>
        </Section>

        <Section number="6" title="Aprobación y activación del plan">
          <p>
            Una vez que el Usuario sube el comprobante de pago, Nevux verifica
            la transferencia dentro de las próximas <strong>24 horas hábiles</strong>.
          </p>
          <p>
            Si el pago es aprobado, el plan se activa automáticamente por 30
            (treinta) días corridos y el Usuario recibe una notificación por
            email.
          </p>
          <p>
            Si el pago es rechazado (por ejemplo, si el monto no coincide, el
            comprobante es ilegible o no se encuentra la transferencia), el
            Usuario recibirá una notificación con el motivo y podrá subir un
            nuevo comprobante sin costo adicional.
          </p>
        </Section>

        <Section number="7" title="Política de reembolsos">
          <p>
            <strong>
              Nevux no realiza reembolsos bajo ninguna circunstancia
            </strong>{" "}
            una vez que el pago ha sido aprobado y el plan activado.
          </p>
          <p>
            Recomendamos utilizar el período de prueba gratuito de 7 días para
            evaluar si la App se adapta a tus necesidades antes de abonar el
            plan.
          </p>
          <p>
            En caso de fallas técnicas atribuibles exclusivamente a Nevux que
            impidan el uso normal de la App por más de 72 horas consecutivas,
            se podrá otorgar una compensación en forma de extensión del plan
            por los días afectados.
          </p>
        </Section>

        <Section number="8" title="Recompensas por fidelidad">
          <p>
            Nevux premia a los Usuarios que mantienen su plan activo de forma
            continua con las siguientes recompensas:
          </p>
          <ul>
            <li>
              <strong>Mes 3:</strong> Acceso a widgets premium y 1 widget
              personalizado único.
            </li>
            <li>
              <strong>Mes 6:</strong> Más widgets personalizados y descuentos
              exclusivos en renovaciones.
            </li>
            <li>
              <strong>Mes 12+:</strong> Estatus de Cliente VIP con beneficios
              exclusivos de por vida.
            </li>
          </ul>
          <p>
            Las recompensas se otorgan siempre que el plan esté activo de forma
            ininterrumpida. Si el plan expira y el Usuario reactiva, el contador
            de meses se preserva pero las recompensas ya desbloqueadas se
            mantienen.
          </p>
        </Section>

        <Section number="9" title="Renovación y vencimiento">
          <p>
            El plan mensual <strong>no se renueva automáticamente</strong>. El
            Usuario recibirá recordatorios por email cuando falten 3 (tres) días
            y 1 (un) día para el vencimiento.
          </p>
          <p>
            Si el plan vence sin renovación, la App bloquea el acceso a los
            widgets pero mantiene toda la configuración guardada. El Usuario
            puede reactivar el plan en cualquier momento sin perder sus
            widgets configurados.
          </p>
        </Section>

        <Section number="10" title="Uso permitido">
          <p>El Usuario se compromete a:</p>
          <ul>
            <li>
              Utilizar Nevux exclusivamente para fines lícitos y comerciales.
            </li>
            <li>
              No revender, sublicenciar ni distribuir la App a terceros sin
              autorización expresa.
            </li>
            <li>
              No intentar acceder, modificar o interferir con el código fuente,
              bases de datos o infraestructura de Nevux.
            </li>
            <li>
              No utilizar la App para actividades fraudulentas, engañosas o
              que violen leyes locales o internacionales.
            </li>
          </ul>
        </Section>

        <Section number="11" title="Suspensión y cancelación">
          <p>
            Nevux se reserva el derecho de <strong>suspender o cancelar</strong>{" "}
            la cuenta de un Usuario, sin previo aviso ni derecho a reembolso,
            en los siguientes casos:
          </p>
          <ul>
            <li>Incumplimiento de estos Términos y Condiciones.</li>
            <li>Actividad fraudulenta o sospechosa.</li>
            <li>
              Uso indebido de la App que afecte a otros Usuarios o a la
              infraestructura de Nevux.
            </li>
            <li>Falta de pago del plan mensual.</li>
          </ul>
          <p>
            El Usuario puede cancelar su cuenta en cualquier momento
            desinstalando la App desde el panel de Tiendanube.
          </p>
        </Section>

        <Section number="12" title="Propiedad intelectual">
          <p>
            Todo el contenido de Nevux (incluyendo código fuente, diseños,
            logos, textos, widgets y funcionalidades) es propiedad exclusiva
            de Rodrigo Lazaro Spehgt y está protegido por las leyes de
            propiedad intelectual vigentes en la República Argentina.
          </p>
          <p>
            El Usuario obtiene únicamente una licencia limitada, no exclusiva y
            revocable para utilizar la App durante el período de suscripción
            activa.
          </p>
        </Section>

        <Section number="13" title="Limitación de responsabilidad">
          <p>
            Nevux se ofrece "tal cual" (as-is) y no garantiza que la App:
          </p>
          <ul>
            <li>Estará disponible ininterrumpidamente sin fallas.</li>
            <li>
              Cumplirá con todos los objetivos comerciales del Usuario.
            </li>
            <li>
              Generará un aumento específico o garantizado del ticket promedio
              o de las ventas.
            </li>
          </ul>
          <p>
            En ningún caso Nevux será responsable por daños indirectos,
            incidentales, pérdida de ingresos, pérdida de datos o cualquier
            otro perjuicio derivado del uso o imposibilidad de uso de la App.
          </p>
          <p>
            La responsabilidad máxima de Nevux frente al Usuario se limita al
            monto abonado por el Usuario en los últimos 30 (treinta) días
            corridos.
          </p>
        </Section>

        <Section number="14" title="Modificaciones a los Términos">
          <p>
            Nevux se reserva el derecho de modificar estos Términos y
            Condiciones en cualquier momento. Los cambios serán notificados por
            email a todos los Usuarios activos con al menos 15 (quince) días de
            anticipación.
          </p>
          <p>
            El uso continuado de la App después de la entrada en vigor de las
            modificaciones implica la aceptación de los nuevos Términos.
          </p>
        </Section>

        <Section number="15" title="Ley aplicable y jurisdicción">
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la República
            Argentina.
          </p>
          <p>
            Cualquier controversia derivada del uso de Nevux será resuelta por
            los tribunales ordinarios de la ciudad de{" "}
            <strong>Diamante, Provincia de Entre Ríos, Argentina</strong>,
            renunciando expresamente el Usuario a cualquier otro fuero o
            jurisdicción que pudiera corresponderle.
          </p>
        </Section>

        <Section number="16" title="Contacto">
          <p>
            Para cualquier consulta, reclamo o notificación relacionada con
            estos Términos y Condiciones, el Usuario puede contactarnos a
            través de:
          </p>
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              marginTop: "0.5rem",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Email de soporte:</strong>{" "}
              <a
                href="mailto:soportenevux@gmail.com"
                style={{ color: "#FF0000", textDecoration: "none", fontWeight: 700 }}
              >
                soportenevux@gmail.com
              </a>
            </p>
            <p style={{ margin: "0.35rem 0 0 0" }}>
              <strong>Responsable:</strong> Rodrigo Lazaro Spehgt
            </p>
            <p style={{ margin: "0.35rem 0 0 0" }}>
              <strong>Ubicación:</strong> Diamante, Entre Ríos, Argentina
            </p>
          </div>
        </Section>

        {/* Aceptación */}
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
            Al utilizar Nevux, declarás haber leído, entendido y aceptado en su
            totalidad estos Términos y Condiciones.
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
            href="/privacidad"
            style={{
              color: "#FF0000",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Política de Privacidad →
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
// COMPONENTE INTERNO: Section
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
        className="section-content"
      >
        <style jsx>{`
          .section-content p {
            margin: 0 0 0.85rem 0;
          }
          .section-content p:last-child {
            margin-bottom: 0;
          }
          .section-content ul {
            margin: 0 0 0.85rem 0;
            padding-left: 1.25rem;
          }
          .section-content li {
            margin-bottom: 0.4rem;
          }
          .section-content strong {
            font-weight: 700;
            color: #000000;
          }
        `}</style>
        {children}
      </div>
    </section>
  );
      }
