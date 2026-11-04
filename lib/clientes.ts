// Clientes de Nevux: cada uno con su interruptor, su forma de cobro, sus dominios y su configuración.
// La línea que pega cada tienda (https://nevux.ar/c/<id>.js) se arma con estos datos en app/c/[archivo]/route.ts.

export type Cobro =
  | { tipo: "manual" }
  | {
      tipo: "mercadopago";
      // ID de la suscripción en Mercado Pago (preferido) o email con el que se suscribió
      suscripcion?: string;
      email?: string;
      // ID del plan de Mercado Pago (preapproval_plan_id): sirve cuando el cliente todavía no se suscribió y no sabemos su email.
      // Toma la suscripción más reciente de ese plan, así que solo vale mientras el plan tenga un único cliente.
      planMp?: string;
      // Plan propio de Mercado Pago para este cliente (recomendado): se crea solo en nevux.ar/suscribirme?c=<id>
      // y la tienda se prende sola cuando paga. No hace falta email ni planMp. Ver lib/planesMp.ts.
      planPropio?: boolean;
      // Días de tolerancia después del vencimiento antes de apagar la tienda
      gracia?: number;
    };

export type Cliente = {
  nombre: string;
  activo: boolean;
  cobro: Cobro;
  dominios: string[];
  // Plan de suscripción (lib/planes.ts). Sin plan = básico
  plan?: "basico" | "premium";
  config: Record<string, unknown>;
};

export const CLIENTES: Record<string, Cliente> = {
  "hogar-digital": {
    nombre: "Hogar Digital (Marcelo)",
    // Interruptor manual: false = apagada siempre, aunque esté al día con el pago
    activo: true,
    // Cobro automático con plan propio: paga en nevux.ar/suscribirme?c=hogar-digital y la tienda se prende sola (y se apaga si deja de pagar)
    cobro: { tipo: 'mercadopago', planPropio: true, gracia: 3 },
    // Dominios donde puede funcionar esta línea (sin www)
    dominios: ['hogardigital.com.ar'],
    // Plan Premium: sección comunidad con links directos a reels de Instagram (04/11/2026)
    plan: 'premium',
    config: {
      "color": "#3498db",
      "marca": {
        "oscuro": "#0b0f17"
      },
      "anuncios": [
        "🚚 Envíos a todo el país",
        "🛡️ 30 días de garantía",
        "💬 Atención personalizada por WhatsApp"
      ],
      "mediosDePago": [
        "Visa",
        "Mastercard",
        "Débito",
        "Mercado Pago"
      ],
      "estiloFicha": "destino",
      "envio": {
        "corte": 18,
        "dias": [
          1,
          2,
          3,
          4,
          5
        ],
        "min": 5,
        "max": 6,
        "zona": ""
      },
      "envioGratisDesde": 0,
      "whatsapp": "5493489520436",
      "evento": {
        "nombre": "La Semana Cyber",
        "desde": "2026-11-02T00:00:00-03:00",
        "hasta": "2026-11-04T23:59:59-03:00",
        "anticipo": 3,
        "barraAntes": "⚡ Se viene la Semana Cyber · Lunes 2 al miércoles 4 de noviembre",
        "barra": "🔥 Semana Cyber en Hogar Digital · Hasta el miércoles 4 de noviembre",
        "cinta": [
          "Semana Cyber",
          "Del 2 al 4 de noviembre",
          "Hasta 12 cuotas"
        ]
      },
      "tarjetas": {
        "quedan": 5,
        "estilo": "destacado"
      },
      "ocultar": [
        "[data-store=\"home-products-featured\"]",
        "[data-store=\"home-banner-news\"]",
        "[data-store=\"home-product-main\"]",
        "[data-store=\"home-banner-categories\"]",
        "[data-store=\"home-products-sale\"]",
        "[data-store=\"home-banner-promotional\"]",
        "[data-store=\"home-products-new\"]",
        "[data-store=\"banner-services\"]"
      ],
      "ventas": {
        "estilo": "destino",
        "marca": "Hogar Digital"
      },
      "carrito": true,
      "home": {
        "destino": {
          "acento": "#3498db",
          "cinta": [
            "Envíos a *todo el país*",
            "*30 días* de garantía",
            "Atención por *WhatsApp*",
            "Devolución *gratis* por falla"
          ],
          "portada": {
            "fotos": [
              "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/67263e3e-c4fc-4cef-ba61-c371cc90d542-0530aaf0-cd39-4906-81e0-ed2829b6b77c-1024-1024.webp",
              "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/a372b7c6-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-bfc7-477a-be6b-7ddaf28a8ff1-1024-1024.webp",
              "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/6705b24e1a3e1-1024-1024.webp"
            ],
            "etiqueta": "Hogar Digital · Desde los años 80",
            "titulo": "Lo que tu casa necesita.",
            "texto": "Humidificadores, audio, smartwatches y más.",
            "boton": "Ver productos",
            "url": "/productos/",
            "boton2": "Humidificadores",
            "url2": "/humidificadores-19h94/",
            "productosUrl": "/humidificadores-19h94/"
          },
          "beneficios": [
            {
              "icono": "envio",
              "titulo": "Envíos a todo el país",
              "texto": "Llega en 5 a 6 días hábiles"
            },
            {
              "icono": "garantia",
              "titulo": "30 días de garantía",
              "texto": "Por falla, daño o error"
            },
            {
              "icono": "chat",
              "titulo": "Atención por WhatsApp",
              "texto": "Te ayudamos a elegir"
            },
            {
              "icono": "cambios",
              "titulo": "Devolución gratis",
              "texto": "Si hay una falla"
            }
          ],
          "tira": {
            "items": [
              {
                "nombre": "Humidificadores",
                "url": "/humidificadores-19h94/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/67263e3e-c4fc-4cef-ba61-c371cc90d542-0530aaf0-cd39-4906-81e0-ed2829b6b77c-1024-1024.webp"
              },
              {
                "nombre": "Audio",
                "url": "/audio-auriculares/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/6705b1a1eba74-1024-1024.webp"
              },
              {
                "nombre": "Auriculares",
                "url": "/audio-auriculares/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/6705b24e1a3e1-1024-1024.webp"
              },
              {
                "nombre": "Smartwatches",
                "url": "/smartwatches-1jb09/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/66f79e48ada511-1024-1024.webp"
              },
              {
                "nombre": "Fitness",
                "url": "/fitness-y-bienestar-1v0hm/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/66f79e5ceac391-1024-1024.webp"
              },
              {
                "nombre": "Relax",
                "url": "/humidificadores-19h94/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/a372b7c6-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-bfc7-477a-be6b-7ddaf28a8ff1-1024-1024.webp"
              }
            ]
          },
          "destacados": [
            {
              "etiqueta": "Para tu casa",
              "titulo": "Destacados",
              "url": "/humidificadores-19h94/",
              "cantidad": 4
            },
            {
              "etiqueta": "Sonido",
              "titulo": "Audio y *auriculares*",
              "url": "/audio-auriculares/",
              "carrusel": true,
              "cantidad": 6
            },
            {
              "etiqueta": "Esto es para vos",
              "titulo": "Más para *tu casa*",
              "url": "/productos/",
              "carrusel": true,
              "cantidad": 8
            }
          ],
          "faqTitulo": "Antes de comprar",
          "faq": [
            {
              "p": "¿Cuánto tarda en llegar?",
              "r": "Despachamos de lunes a viernes: si comprás antes de las 18 h, sale ese mismo día. Llega en 5 a 6 días hábiles a todo el país."
            },
            {
              "p": "¿Tiene garantía?",
              "r": "Sí, 30 días desde que lo recibís por falla de fabricación, producto dañado o error en el envío. En esos casos la devolución es gratis."
            },
            {
              "p": "¿Puedo devolverlo si me arrepiento?",
              "r": "Sí, dentro de los 10 días corridos desde que lo recibís, sin uso y con su embalaje original."
            },
            {
              "p": "¿Cómo puedo pagar?",
              "r": "Con tarjeta de crédito o débito y con Mercado Pago."
            }
          ],
          "banner": {
            "etiqueta": "[ Hogar Digital ]",
            "titulo": "Tu rincón relax.",
            "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/67263e3e-c4fc-4cef-ba61-c371cc90d542-0530aaf0-cd39-4906-81e0-ed2829b6b77c-1024-1024.webp",
            "boton": "Ver humidificadores",
            "url": "/humidificadores-19h94/"
          },
          "comunidad": {
            "etiqueta": "Detrás de escena",
            "cuenta": "Así trabajamos día a día",
            "url": "https://instagram.com/hogardigitaltiendaonline",
            "fotos": [
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/parlante-rgb.jpg",
                "url": "https://www.instagram.com/reel/Dc5-mW-xr5o/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-smartwatch.jpg",
                "url": "https://www.instagram.com/reel/Dc3gtpxxr5z/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/aro-de-luz.jpg",
                "url": "https://www.instagram.com/reel/Dcd-1K5xvjq/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/empaquetando.jpg",
                "url": "https://www.instagram.com/reel/DcbUqMARi4y/"
              }
            ]
          },
          "locales": {
            "etiqueta": "Hogar Digital / Campana",
            "titulo": "¿Querés *conocer el local*?",
            "texto": "Vení a ver los productos en persona y te asesoramos. También te atendemos por WhatsApp.",
            "items": [
              {
                "zona": "Campana · Buenos Aires",
                "nombre": "Hogar Digital",
                "direccion": "Belgrano 276, Campana (2804), Buenos Aires",
                "horario": "Lunes a sábado de 8 a 21 h"
              }
            ]
          },
          "numeros": {
            "titulo": "Hogar Digital *en números*",
            "items": [
              {
                "valor": 35,
                "prefijo": "+",
                "texto": "Años de trayectoria"
              },
              {
                "valor": 300,
                "prefijo": "+",
                "texto": "Ventas en 2026"
              },
              {
                "valor": 800,
                "prefijo": "+",
                "texto": "Calificaciones en Mercado Libre"
              },
              {
                "valor": 1,
                "texto": "Local en Campana"
              }
            ]
          }
        },
        "rotador": {
          "etiqueta": "Encontrá lo tuyo",
          "items": [
            {
              "nombre": "Humidificadores",
              "url": "/humidificadores-19h94/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/67263e3e-c4fc-4cef-ba61-c371cc90d542-0530aaf0-cd39-4906-81e0-ed2829b6b77c-1024-1024.webp",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/67263e3e-c4fc-4cef-ba61-c371cc90d542-0530aaf0-cd39-4906-81e0-ed2829b6b77c-1024-1024.webp"
            },
            {
              "nombre": "Audio",
              "url": "/audio-auriculares/",
              "video": "https://nevux.ar/clientes/hogar-digital/parlante-rgb.mp4",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/6705b1a1eba74-1024-1024.webp"
            },
            {
              "nombre": "Smartwatches",
              "url": "/smartwatches-1jb09/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/66f79e48ada511-1024-1024.webp"
            },
            {
              "nombre": "Fitness",
              "url": "/fitness-y-bienestar-1v0hm/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/66f79e5ceac391-1024-1024.webp",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/001/623/489/products/66f79e6da89821-1024-1024.webp"
            }
          ]
        }
      },
      "premium": {
        "tema": "destino"
      },
      "cabecera": {
        "logo": "https://nevux.ar/clientes/hogar-digital/logo-negro.png",
        "logoBlanco": "https://nevux.ar/clientes/hogar-digital/logo-blanco.png"
      }
    }
  },
  "valmont": {
    nombre: "Valmont Relojes (Wess)",
    activo: false,
    cobro: { tipo: "manual" },
    dominios: ["valmontrelojes.com.ar", "valmont.com.ar"],
    plan: "premium",
    config: {
      "color": "#d4af37",
      "marca": {
        "oscuro": "#0a0a0a"
      },
      "anuncios": [
        "🚚 Envíos gratis a todo el país",
        "🛡️ 1 año de garantía oficial",
        "💬 Asesoramiento personalizado"
      ],
      "mediosDePago": [
        "Visa",
        "Mastercard",
        "American Express",
        "Mercado Pago"
      ],
      "estiloFicha": "destino",
      "envio": {
        "corte": 14,
        "dias": [1, 2, 3, 4, 5],
        "min": 2,
        "max": 5,
        "zona": ""
      },
      "envioGratisDesde": 0,
      "whatsapp": "5491141234567",
      "tarjetas": {
        "quedan": 3,
        "estilo": "destacado"
      },
      "ocultar": [
        "[data-store=\"home-products-featured\"]",
        "[data-store=\"home-banner-news\"]",
        "[data-store=\"home-product-main\"]",
        "[data-store=\"home-banner-categories\"]",
        "[data-store=\"home-products-sale\"]",
        "[data-store=\"home-banner-promotional\"]",
        "[data-store=\"home-products-new\"]",
        "[data-store=\"banner-services\"]"
      ],
      "ventas": {
        "estilo": "destino",
        "marca": "Valmont"
      },
      "carrito": true,
      "home": {
        "destino": {
          "acento": "#d4af37",
          "cinta": [
            "Envíos *gratis* a todo el país",
            "*1 año* de garantía oficial",
            "Asesoramiento *personalizado*",
            "Relojes *auténticos*"
          ],
          "portada": {
            "fotos": [
              "https://nevux.ar/clientes/valmont/portada-1.jpg",
              "https://nevux.ar/clientes/valmont/portada-2.jpg",
              "https://nevux.ar/clientes/valmont/portada-3.jpg"
            ],
            "etiqueta": "Valmont · Relojes desde 1985",
            "titulo": "Elegancia atemporal.",
            "texto": "Descubrí nuestra colección de relojes premium.",
            "boton": "Ver colección",
            "url": "/productos/",
            "boton2": "Relojes deportivos",
            "url2": "/deportivos/",
            "productosUrl": "/productos/"
          },
          "beneficios": [
            {
              "icono": "envio",
              "titulo": "Envíos gratis",
              "texto": "A todo el país"
            },
            {
              "icono": "garantia",
              "titulo": "1 año de garantía",
              "texto": "Garantía oficial"
            },
            {
              "icono": "chat",
              "titulo": "Asesoramiento",
              "texto": "Expertos en relojería"
            },
            {
              "icono": "cambios",
              "titulo": "Productos auténticos",
              "texto": "100% originales"
            }
          ],
          "tira": {
            "items": [
              {
                "nombre": "Digitales",
                "url": "/digitales/",
                "foto": "https://nevux.ar/clientes/valmont/cat-digitales.svg"
              },
              {
                "nombre": "Deportivos",
                "url": "/deportivos/",
                "foto": "https://nevux.ar/clientes/valmont/cat-deportivos.svg"
              },
              {
                "nombre": "Analógicos",
                "url": "/analogicos/",
                "foto": "https://nevux.ar/clientes/valmont/cat-analogicos.svg"
              },
              {
                "nombre": "Smartwatches",
                "url": "/smartwatches/",
                "foto": "https://nevux.ar/clientes/valmont/cat-smartwatches.svg"
              }
            ]
          },
          "destacados": [
            {
              "etiqueta": "Lo más vendido",
              "titulo": "Relojes *destacados*",
              "url": "/productos/",
              "carrusel": true,
              "cantidad": 6
            }
          ],
          "faqTitulo": "Preguntas frecuentes",
          "faq": [
            {
              "p": "¿Los relojes son originales?",
              "r": "Sí, todos nuestros relojes son 100% originales con garantía oficial del fabricante."
            },
            {
              "p": "¿Cuánto tarda el envío?",
              "r": "Los envíos son gratis a todo el país y demoran entre 2 y 5 días hábiles."
            },
            {
              "p": "¿Tienen garantía?",
              "r": "Todos los relojes incluyen 1 año de garantía oficial del fabricante."
            },
            {
              "p": "¿Puedo cambiar el reloj?",
              "r": "Sí, tenés 30 días para cambios y devoluciones."
            }
          ],
          "banner": {
            "etiqueta": "[ Valmont ]",
            "titulo": "Encontrá tu estilo.",
            "foto": "https://nevux.ar/clientes/valmont/detalle-reloj.webp",
            "boton": "Ver relojes",
            "url": "/productos/"
          },
          "comunidad": {
            "etiqueta": "Instagram",
            "cuenta": "@valmont.relojes",
            "url": "https://www.instagram.com/valmont.relojes/",
            "fotos": [
              {
                "foto": "https://nevux.ar/clientes/valmont/video-gshock-gst-b400.jpg",
                "video": "https://nevux.ar/clientes/valmont/video-gshock-gst-b400.mp4"
              },
              {
                "foto": "https://nevux.ar/clientes/valmont/video-rolex-submariner.jpg",
                "video": "https://nevux.ar/clientes/valmont/video-rolex-submariner.mp4"
              },
              {
                "foto": "https://nevux.ar/clientes/valmont/video-omega-speedmaster.jpg",
                "video": "https://nevux.ar/clientes/valmont/video-omega-speedmaster.mp4"
              },
              {
                "foto": "https://nevux.ar/clientes/valmont/video-complications-gold.jpg",
                "video": "https://nevux.ar/clientes/valmont/video-complications-gold.mp4"
              },
              {
                "foto": "https://nevux.ar/clientes/valmont/video-rolex-daytona.jpg",
                "video": "https://nevux.ar/clientes/valmont/video-rolex-daytona.mp4"
              }
            ]
          },
          "numeros": {
            "titulo": "Valmont *en números*",
            "items": [
              {
                "valor": 38,
                "prefijo": "+",
                "texto": "Años en el mercado"
              },
              {
                "valor": 5000,
                "prefijo": "+",
                "texto": "Clientes satisfechos"
              },
              {
                "valor": 200,
                "prefijo": "+",
                "texto": "Modelos disponibles"
              },
              {
                "valor": 2,
                "texto": "Locales en CABA"
              }
            ]
          }
        },
        "rotador": {
          "etiqueta": "Colecciones",
          "items": [
            {
              "nombre": "Casio",
              "url": "/search/?q=casio",
              "foto": "https://nevux.ar/clientes/valmont/marca-casio.jpg"
            },
            {
              "nombre": "G-Shock",
              "url": "/search/?q=g-shock",
              "foto": "https://nevux.ar/clientes/valmont/marca-gshock.jpg"
            },
            {
              "nombre": "Mistral",
              "url": "/search/?q=mistral",
              "foto": "https://nevux.ar/clientes/valmont/marca-mistral.jpg"
            },
            {
              "nombre": "Tressa",
              "url": "/search/?q=tressa",
              "foto": "https://nevux.ar/clientes/valmont/marca-tressa.jpg"
            }
          ]
        }
      },
      "premium": {
        "tema": "destino"
      },
      "cabecera": {
        "logo": "https://nevux.ar/clientes/valmont/logo-dorado.png"
      }
    }
  }
};
