// lib/email.ts
// Capa central de envío de emails usando Resend.
// Todos los correos de alertas administrativas se envían a nevuxapp@gmail.com

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = "nevuxapp@gmail.com";
const FROM_EMAIL = "Nevux <onboarding@resend.dev>";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Envío base a Resend vía fetch (sin SDK, sin dependencias extra).
 * Si falla, LOGUEA pero NO tira error para no romper el flujo principal.
 */
async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error("❌ [email] RESEND_API_KEY no configurada");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ [email] Resend respondió ${response.status}:`,
        errorText
      );
      return false;
    }

    const data = await response.json();
    console.log(`✅ [email] Enviado a ${to}, id:`, data.id);
    return true;
  } catch (error: any) {
    console.error("❌ [email] Error enviando:", error?.message || error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// EMAILS AL ADMIN (nevuxapp@gmail.com)
// ═══════════════════════════════════════════════════════════

type NewPaymentAlertParams = {
  customerEmail: string;
  amount: number;
  transferReference: string | null;
  paymentId: string;
  storeId: number;
};

/**
 * Notifica al admin (nevuxapp@gmail.com) cuando un cliente sube un comprobante nuevo.
 * Se dispara desde /api/plan/upload-receipt.
 */
export async function sendNewPaymentAlert(
  params: NewPaymentAlertParams
): Promise<boolean> {
  const { customerEmail, amount, transferReference, paymentId, storeId } =
    params;

  const formattedAmount = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);

  const now = new Date().toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "full",
    timeStyle: "short",
  });

  const adminPanelUrl = "https://nexus2026-gx7e.vercel.app/admin/pagos";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nuevo pago recibido - Nevux</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#000000;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:#10B981;color:#ffffff;padding:6px 16px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
        Nevux Admin
      </div>
    </div>

    <!-- Título -->
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#000000;line-height:1.2;">
      💰 Nuevo pago recibido
    </h1>
    <p style="margin:0 0 32px;font-size:15px;color:#000000;opacity:0.6;">
      Un cliente subió un comprobante y está esperando aprobación.
    </p>

    <!-- Card con datos -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:24px;">

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Cliente
        </div>
        <div style="font-size:16px;font-weight:600;color:#000000;">
          ${customerEmail}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Monto
        </div>
        <div style="font-size:24px;font-weight:800;color:#059669;">
          ${formattedAmount}
        </div>
      </div>

      ${
        transferReference
          ? `
      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Referencia de la transferencia
        </div>
        <div style="font-size:14px;font-weight:600;color:#000000;font-family:'Courier New',monospace;">
          ${transferReference}
        </div>
      </div>
      `
          : ""
      }

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Fecha
        </div>
        <div style="font-size:14px;color:#000000;">
          ${now}
        </div>
      </div>

      <div>
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          IDs
        </div>
        <div style="font-size:12px;color:#000000;opacity:0.7;font-family:'Courier New',monospace;">
          Payment: ${paymentId}<br>
          Store: ${storeId}
        </div>
      </div>

    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${adminPanelUrl}" style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;">
        Revisar en el panel →
      </a>
    </div>

    <!-- Info extra -->
    <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:16px;margin-bottom:24px;">
      <div style="font-size:13px;color:#000000;line-height:1.5;">
        <strong style="color:#059669;">Próximos pasos:</strong><br>
        1. Entrá al panel admin<br>
        2. Verificá el comprobante contra tu cuenta Naranja X<br>
        3. Aprobá o rechazá el pago<br>
        4. Enviá el email al cliente desde tu Gmail (nevuxapp@gmail.com)
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#000000;opacity:0.5;">
        Notificación automática · Nevux Admin
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `💰 Nuevo pago de ${customerEmail} — ${formattedAmount}`,
    html,
  });
}

// ═══════════════════════════════════════════════════════════
// EMAIL: PLAN POR VENCER O VENCIDO
// ═══════════════════════════════════════════════════════════

type PlanExpiringAlertParams = {
  customerEmail: string;
  storeId: number;
  daysLeft: number;
  planEndDate: string; // ISO
  monthsActive: number;
};

/**
 * Notifica al admin (nevuxapp@gmail.com) cuando el plan de un cliente está por vencer o venció hoy.
 * Se dispara desde el cron /api/cron/check-plans.
 * Incluye un enlace mailto: pre-armado para avisarle al cliente desde Gmail.
 */
export async function sendPlanExpiringAlert(
  params: PlanExpiringAlertParams
): Promise<boolean> {
  const { customerEmail, storeId, daysLeft, planEndDate, monthsActive } =
    params;

  const endDateFormatted = new Date(planEndDate).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const urgencyColor = daysLeft <= 1 ? "#dc2626" : "#f59e0b";
  const urgencyBg = daysLeft <= 1 ? "#fee2e2" : "#fef3c7";
  const urgencyText = daysLeft <= 1 ? "🚨 ÚLTIMO DÍA / EXPIRADO" : "⏰ VENCE PRONTO";

  // Mailto: pre-armado para avisar al cliente
  const clientEmailSubject =
    daysLeft <= 1
      ? "🚨 Tu plan Nevux vence hoy"
      : `⏰ Tu plan Nevux vence en ${daysLeft} días`;

  const clientEmailBody = `¡Hola!

Te escribimos para recordarte que tu plan Nevux vence ${
    daysLeft <= 1 ? "HOY" : `en ${daysLeft} días`
  } (${endDateFormatted}).

Para no perder el acceso a tus widgets y mantener activo tu plan, podés renovar desde acá:

👉 Renovar mi plan: https://nexus2026-gx7e.vercel.app/plan/pagar

Recordá que:
• El plan cuesta $30.000 ARS/mes
• Al renovar mantenés todos tus widgets configurados
• Seguís acumulando meses para desbloquear recompensas${
    monthsActive >= 2
      ? `\n• Ya llevás ${monthsActive} meses con Nevux, ¡no cortemos la racha!`
      : ""
  }

Si tenés cualquier consulta, respondé este mail y te ayudamos.

Gracias por confiar en Nevux 🚀`;

  const mailtoLink = `mailto:${encodeURIComponent(
    customerEmail
  )}?subject=${encodeURIComponent(clientEmailSubject)}&body=${encodeURIComponent(
    clientEmailBody
  )}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Plan por vencer - Nevux</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#000000;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:#10B981;color:#ffffff;padding:6px 16px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
        Nevux Admin
      </div>
    </div>

    <!-- Badge urgencia -->
    <div style="text-align:center;margin-bottom:16px;">
      <div style="display:inline-block;background:${urgencyBg};color:${urgencyColor};padding:6px 14px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:0.5px;">
        ${urgencyText}
      </div>
    </div>

    <!-- Título -->
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#000000;line-height:1.2;text-align:center;">
      Plan de cliente ${daysLeft <= 1 ? "vencido" : "por vencer"}
    </h1>
    <p style="margin:0 0 32px;font-size:15px;color:#000000;opacity:0.6;text-align:center;">
      ${
        daysLeft <= 1
          ? "El plan de este cliente vence HOY o ya expiró. Avisale por email."
          : `Faltan ${daysLeft} días para el vencimiento. Avisale por email.`
      }
    </p>

    <!-- Card cliente -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:24px;">

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Cliente
        </div>
        <div style="font-size:16px;font-weight:600;color:#000000;">
          ${customerEmail}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Vence el
        </div>
        <div style="font-size:20px;font-weight:800;color:${urgencyColor};">
          ${endDateFormatted}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Días restantes
        </div>
        <div style="font-size:16px;font-weight:700;color:#000000;">
          ${daysLeft} ${daysLeft === 1 ? "día" : "días"}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Meses activo
        </div>
        <div style="font-size:14px;color:#000000;font-weight:600;">
          ${monthsActive} ${monthsActive === 1 ? "mes" : "meses"}
        </div>
      </div>

      <div>
        <div style="font-size:11px;font-weight:700;color:#000000;opacity:0.5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Tienda
        </div>
        <div style="font-size:12px;color:#000000;opacity:0.7;font-family:'Courier New',monospace;">
          #${storeId}
        </div>
      </div>

    </div>

    <!-- CTA principal: mailto -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${mailtoLink}" style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;">
        📧 Avisarle al cliente
      </a>
      <p style="margin:12px 0 0;font-size:12px;color:#000000;opacity:0.5;">
        Se abre tu casilla (nevuxapp@gmail.com) con el mensaje redactado
      </p>
    </div>

    <!-- Info extra -->
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:16px;">
      <div style="font-size:13px;color:#000000;line-height:1.5;">
        <strong style="color:#dc2626;">Recordatorio:</strong> Si el cliente no renueva antes del ${endDateFormatted}, su plan pasará automáticamente a "expirado" y verá el paywall en su próximo login.
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;margin-top:24px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#000000;opacity:0.5;">
        Notificación automática · Nevux Admin
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `${daysLeft <= 1 ? "🚨" : "⏰"} Plan de ${customerEmail} ${
      daysLeft <= 1 ? "venció hoy" : `vence en ${daysLeft} días`
    }`,
    html,
  });
  }
