// lib/email.ts
// Capa central de envío de emails usando Resend.
// Actualmente solo se envían emails al ADMIN (sin dominio verificado, Resend
// no permite mandar a terceros). Los emails al cliente se manejan con mailto:
// desde el panel admin.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = "rodrigospehgt04@gmail.com";
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
// EMAILS AL ADMIN
// ═══════════════════════════════════════════════════════════

type NewPaymentAlertParams = {
  customerEmail: string;
  amount: number;
  transferReference: string | null;
  paymentId: string;
  storeId: number;
};

/**
 * Notifica al admin (Rodrigo) cuando un cliente sube un comprobante nuevo.
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
      <div style="display:inline-block;background:#FF0000;color:#ffffff;padding:6px 16px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
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
        <div style="font-size:24px;font-weight:800;color:#FF0000;">
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
      <a href="${adminPanelUrl}" style="display:inline-block;background:#FF0000;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;">
        Revisar en el panel →
      </a>
    </div>

    <!-- Info extra -->
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:24px;">
      <div style="font-size:13px;color:#000000;line-height:1.5;">
        <strong style="color:#FF0000;">Próximos pasos:</strong><br>
        1. Entrá al panel admin<br>
        2. Verificá el comprobante contra tu cuenta Naranja X<br>
        3. Aprobá o rechazá el pago<br>
        4. Enviá el email al cliente desde tu Gmail
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#000000;opacity:0.5;">
        Notificación automática · Nevux
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
