import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, message, type = "report", store_id = "8293155" } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Se requiere un número de teléfono y un mensaje." },
        { status: 400 }
      );
    }

    // Clean phone number (remove spaces, dashes, +, etc.)
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // 1. WhatsApp Web / wa.me direct link (Works 100% everywhere without third-party limits)
    const encodedText = encodeURIComponent(message);
    const whatsappWebUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // 2. Meta WhatsApp Cloud API (If WHATSAPP_TOKEN & WHATSAPP_PHONE_NUMBER_ID exist in process.env)
    let apiSent = false;
    let apiResponse = null;

    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (whatsappToken && whatsappPhoneId) {
      try {
        const metaRes = await fetch(
          `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: cleanPhone,
              type: "text",
              text: { body: message },
            }),
          }
        );

        apiResponse = await metaRes.json();
        if (metaRes.ok) {
          apiSent = true;
        }
      } catch (metaErr: any) {
        console.error("Meta WhatsApp Cloud API send error:", metaErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      apiSent,
      phone: cleanPhone,
      message,
      whatsappWebUrl,
      apiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error enviando mensaje de WhatsApp", details: err.message },
      { status: 500 }
    );
  }
        }
