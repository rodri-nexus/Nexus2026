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
    activo: true,
    cobro: { tipo: 'mercadopago', planPropio: true, gracia: 3 },
    dominios: ['hogardigital.com.ar'],
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
      "transferencia": 10,
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
      "carrito": {
        "estilo": "hogar",
        "acento": "#3498db"
      },
      "home": {
        "destino": {
          "acento": "#3498db",
          "modo": "editorial",
          "cinta": [
            "Envíos a *todo el país*",
            "*30 días* de garantía",
            "Atención por *WhatsApp*",
            "Devolución *gratis* por falla"
          ],
          "portada": {
            "fotos": [
              "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/aa21b036-c4fc-4cef-ba61-c371cc90d542-0530aaf0-4cc2707e7abbf2c1f317934564759826-1024-1024.webp",
              "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/0ac01ee3-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-12b78b996cf5c82b0417934072828698-1024-1024.webp",
              "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056700-b80630798d70727f1917901024718719-1024-1024.webp"
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
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056709-eba39cf6e5e33054c317901025394499-1024-1024.webp"
              },
              {
                "nombre": "Audio",
                "url": "/audio-auriculares/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000064948-1b2cdbc0b81707d0f817924511811491-1024-1024.webp"
              },
              {
                "nombre": "Auriculares",
                "url": "/audio-auriculares/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056695-5a06631053060d23e217901024050439-1024-1024.webp"
              },
              {
                "nombre": "Smartwatches",
                "url": "/smartwatches-1jb09/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056623-7322be0751a7f8955e17901015253577-1024-1024.webp"
              },
              {
                "nombre": "Fitness",
                "url": "/fitness-y-bienestar-1v0hm/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000059933-1564b3879882d329b217909447522683-1024-1024.webp"
              },
              {
                "nombre": "Relax",
                "url": "/humidificadores-19h94/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/0ac01ee3-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-12b78b996cf5c82b0417934072828698-1024-1024.webp"
              }
            ]
          },
          "destacados": [
            {
              "etiqueta": "Lo más elegido",
              "titulo": "Los *más vendidos*",
              "url": "/humidificadores-19h94/",
              "cantidad": 4
            },
            {
              "etiqueta": "Sonido",
              "titulo": "Audio y *auriculares*",
              "url": "/audio-auriculares/",
              "carrusel": true,
              "cantidad": 8
            },
            {
              "etiqueta": "Todo el catálogo",
              "titulo": "Encontrá *lo que buscás*",
              "url": "/productos/",
              "cantidad": 60,
              "paso": 12,
              "textoMas": "Ver más productos",
              "filtroTodos": "Todos",
              "filtros": [
                {
                  "nombre": "Humidificadores",
                  "url": "/humidificadores-19h94/"
                },
                {
                  "nombre": "Audio",
                  "url": "/audio-auriculares/"
                },
                {
                  "nombre": "Smartwatches",
                  "url": "/smartwatches-1jb09/"
                },
                {
                  "nombre": "Tecnología",
                  "url": "/tecnologia-y-accesorios-k82dt/"
                },
                {
                  "nombre": "Hogar",
                  "url": "/hogar-17ycd/"
                },
                {
                  "nombre": "Fitness",
                  "url": "/fitness-y-bienestar-1v0hm/"
                },
                {
                  "nombre": "Belleza",
                  "url": "/belleza/"
                }
              ]
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
            "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056700-b80630798d70727f1917901024718719-1024-1024.webp",
            "boton": "Ver humidificadores",
            "url": "/humidificadores-19h94/"
          },
          "comunidad": {
            "estilo": "movimiento",
            "titulo": "en movimiento",
            "boton": "Ver en Instagram",
            "etiqueta": "Detrás de escena",
            "cuenta": "Así trabajamos día a día",
            "url": "https://instagram.com/hogardigitaltiendaonline",
            "fotos": [
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/aro-de-luz.jpg",
                "video": "https://nevux.ar/clientes/hogar-digital/comunidad/aro-de-luz.mp4",
                "url": "https://www.instagram.com/reel/Dc5-mW-xr5o/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-compatibilidad.jpg",
                "video": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-compatibilidad.mp4",
                "url": "https://www.instagram.com/reel/Dc3gtpxxr5z/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/parlante-rgb.jpg",
                "video": "https://nevux.ar/clientes/hogar-digital/comunidad/parlante-rgb.mp4",
                "url": "https://www.instagram.com/reel/DcRbx7esRZI/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-smartwatch.jpg",
                "video": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-smartwatch.mp4",
                "url": "https://www.instagram.com/reel/Dcd-1K5xvjq/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/empaquetando.jpg"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-consejos.jpg",
                "video": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-consejos.mp4",
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
              "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056709-eba39cf6e5e33054c317901025394499-1024-1024.webp",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/aa21b036-c4fc-4cef-ba61-c371cc90d542-0530aaf0-4cc2707e7abbf2c1f317934564759826-1024-1024.webp"
            },
            {
              "nombre": "Audio",
              "url": "/audio-auriculares/",
              "video": "https://nevux.ar/clientes/hogar-digital/parlante-rgb.mp4",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056644-af25d4fda55df67c7817901018261560-1024-1024.webp"
            },
            {
              "nombre": "Smartwatches",
              "url": "/smartwatches-1jb09/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056623-7322be0751a7f8955e17901015253577-1024-1024.webp"
            },
            {
              "nombre": "Fitness",
              "url": "/fitness-y-bienestar-1v0hm/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000059933-1564b3879882d329b217909447522683-1024-1024.webp",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056639-27c93a9b66ee9dee8c17901017599283-1024-1024.webp"
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
      },
      "fichaDestino": {
        "sello": "Hogar Digital · *30 días* de garantía",
        "estilo": "hogar",
        "chip": "+800 calificaciones en Mercado Libre · +35 años",
        "confianza": [
          {
            "icono": "cambios",
            "titulo": "Cambios y devoluciones",
            "texto": "10 días para arrepentirte"
          },
          {
            "icono": "chat",
            "titulo": "Atención personalizada",
            "texto": "Te respondemos por WhatsApp"
          },
          {
            "icono": "garantia",
            "titulo": "30 días de garantía",
            "texto": "Por falla, daño o error"
          }
        ],
        "faq": [
          {
            "p": "¿Cuánto tarda en llegar?",
            "r": "Despachamos de lunes a viernes: si comprás antes de las 18 h, sale ese mismo día. Llega en 5 a 6 días hábiles a todo el país."
          },
          {
            "p": "¿Cuánto cuesta el envío?",
            "r": "Depende de tu código postal: lo calculás en el carrito antes de pagar. Muchos productos tienen envío gratis."
          },
          {
            "p": "¿Tiene garantía?",
            "r": "Sí, 30 días desde que lo recibís por falla de fabricación, producto dañado o error en el envío. En esos casos la devolución es gratis y nos encargamos de todo."
          },
          {
            "p": "¿Puedo devolverlo si me arrepiento?",
            "r": "Sí, dentro de los 10 días corridos desde que lo recibís, sin uso y con su embalaje original."
          },
          {
            "p": "¿Cómo puedo pagar?",
            "r": "Con tarjeta de crédito o débito y con Mercado Pago, en hasta 12 cuotas."
          },
          {
            "p": "¿Tengo una duda, a quién le escribo?",
            "r": "Escribinos por WhatsApp y te atendemos personalmente."
          }
        ]
      },
      "packs": []
    }
  },
  "perfumez": {
    nombre: "Perfumez (Lorenzo)",
    activo: true,
    // Plan propio: se prende sola cuando Lorenzo pague en nevux.ar/pagar/perfumez (principios de diciembre)
    cobro: { tipo: "mercadopago", planPropio: true, gracia: 3 },
    dominios: ["perfumes405.mitiendanube.com"],
    plan: "premium",
    config: {
      "color": "#d4a84f",
      "marca": {
        "oscuro": "#0a0907",
      "noche": "#0a0907"
      },
      "premium": {
        "titulos": "Oswald",
        "texto": "Inter",
        "animar": true,
        "tema": "wess"
      },
      "whatsapp": "5493492324502",
      "cabecera": {
        "imagen": "https://nevux.ar/clientes/perfumez/logo-z-chico.png",
        "nombre": "PERFUMEZ",
        "tamano": 58,
        "vuelta": 7
      },
      "pie": {
        "logo": "https://nevux.ar/clientes/perfumez/logo-z-chico.png",
        "titulo": "Perfumez",
        "texto": "Perfumes árabes de 100 ml",
        "instagram": "https://www.instagram.com/perfumez_2026/",
        "newsletter": "Registrate y enterate primero de los nuevos ingresos."
      },
      "credito": {
        "texto": "Tienda diseñada por",
        "marca": "@nevux.app",
        "url": "https://www.instagram.com/nevux.app/"
      },
      "estiloFicha": "wess",
      "envio": {
        "corte": 14,
        "dias": [
          1,
          2,
          3,
          4,
          5
        ],
        "min": 3,
        "max": 6,
        "zona": "a todo el país"
      },
      "precios": true,
      "tarjetas": {
        "estilo": "wess"
      },
      "packs": [],
      "ventas": {
      "estilo": "chico"
    },
      "efecto3d": true,
      "carrito": {
        "estilo": "hogar",
        "acento": "#d4a84f",
        "marcador": "Z",
        "sugeridos": true,
        "sugeridosTitulo": "Sumá otra fragancia"
      },
      "anuncios": [
        "✨ Perfumes árabes de 100 ml · Armaf, Afnan y Lattafa",
        "🚚 Envíos a todo el país por Correo Argentino",
        "💬 Te asesoramos por WhatsApp"
      ],
      "cinta": [
        "Perfumes árabes",
        "Frascos de 100 ml",
        "Envíos a todo el país",
        "Armaf · Afnan · Lattafa",
        "Te asesoramos"
      ],
      "ocultar": [
        "[data-store=\"home-products-featured\"]",
        "[data-store=\"home-banner-news\"]",
        "[data-store=\"home-product-main\"]",
        "[data-store=\"home-banner-categories\"]",
        "[data-store=\"home-products-sale\"]",
        "[data-store=\"home-banner-promotional\"]",
        "[data-store=\"home-products-new\"]",
        "[data-store=\"banner-services\"]",
        "[data-store=\"home-categories-featured\"]",
        "[data-store=\"home-testimonials\"]",
        "[data-store=\"home-newsletter\"]"
      ],
      "incluye": {
        "titulo": "Qué incluye tu perfume",
        "items": [
          {
            "icono": "🧴",
            "titulo": "Frasco de 100 ml",
            "texto": "Eau de parfum."
          },
          {
            "icono": "📦",
            "titulo": "En su caja",
            "texto": "Como sale de la marca."
          },
          {
            "icono": "🚚",
            "titulo": "Envío protegido",
            "texto": "Por Correo Argentino."
          },
          {
            "icono": "💬",
            "titulo": "Asesoramiento",
            "texto": "Antes y después de comprar."
          }
        ]
      },
      "regalo": {
        "titulo": "¿Es para regalar?",
        "texto": "Avisanos por WhatsApp y te ayudamos a elegir la fragancia ideal."
      },
      "comparativa": {
        "titulo": "Perfumez vs. comprar en cualquier lado",
        "marca": "Perfumez",
        "otro": "Otros",
        "filas": [
          "Marcas árabes con línea propia",
          "Frasco y caja de la marca",
          "Fragancias de larga duración",
          "Asesoramiento por WhatsApp",
          "Envío protegido a todo el país"
        ]
      },
      "faq": [
        {
          "p": "¿Qué marcas tienen?",
          "r": "Armaf, Afnan y Lattafa, tres de las marcas árabes más conocidas. Todos los frascos son de 100 ml."
        },
        {
          "p": "¿Cuánto dura en la piel?",
          "r": "Los perfumes árabes se destacan por su intensidad y su duración. Depende de cada fragancia y de tu piel: escribinos y te recomendamos."
        },
        {
          "p": "¿Hacen envíos?",
          "r": "Sí, a todo el país por Correo Argentino. El costo se calcula al finalizar la compra con tu código postal."
        },
        {
          "p": "¿Puedo probarlo antes?",
          "r": "Si nos vemos en persona, tenemos decants para que pruebes cada fragancia antes de llevarte el frasco."
        }
      ],
      "ficha": {
        "pill": "Perfume árabe",
        "regaloLinea": "Llega en su caja, listo para estrenar o para regalar.",
        "calidad": "Selección Perfumez",
        "whatsappTexto": "¿No sabés si es para vos?",
        "confianza": [
          {
            "icono": "original",
            "titulo": "Marca árabe",
            "texto": "Armaf, Afnan y Lattafa"
          },
          {
            "icono": "envio",
            "titulo": "Envío protegido",
            "texto": "Por Correo Argentino a todo el país"
          },
          {
            "icono": "garantia",
            "titulo": "Compra segura",
            "texto": "Te acompañamos antes y después"
          }
        ],
        "detallesEtiqueta": "Perfumez",
        "detallesTitulo": "Miralo de cerca",
        "detalles": [
          {
            "etiqueta": "Frasco",
            "titulo": "Tal cual llega",
            "texto": "Fotos del frasco original"
          },
          {
            "etiqueta": "Notas",
            "titulo": "Salida, corazón y fondo",
            "texto": "Su pirámide olfativa"
          },
          {
            "etiqueta": "Ficha",
            "titulo": "Para quién y cuándo",
            "texto": "Estilo y ocasión ideal"
          },
          {
            "etiqueta": "Presentación",
            "titulo": "100 ml",
            "texto": "Eau de parfum"
          }
        ],
        "historia": {
          "etiqueta": "Perfumez · Perfumes árabes",
          "titulo": "La fragancia que",
          "destacado": "no pasa desapercibida",
          "texto": "Perfumes intensos, de los que dejan estela y duran en la piel. Te lo mandamos listo para estrenar.",
          "puntos": [
            "Frasco de 100 ml, en su caja",
            "Te asesoramos por WhatsApp",
            "Envío protegido a todo el país",
            "Listo para regalar"
          ],
          "boton": "Lo quiero"
        },
        "cerca": {
          "etiqueta": "Cómo es",
          "titulo": "Una fragancia en tres tiempos",
          "items": [
            {
              "titulo": "Salida",
              "texto": "Lo primero que sentís al aplicarlo."
            },
            {
              "titulo": "Corazón",
              "texto": "Aparece a los minutos y define su carácter."
            },
            {
              "titulo": "Fondo",
              "texto": "Lo que queda en tu piel durante horas."
            },
            {
              "titulo": "Estela",
              "texto": "Lo que perciben los demás cuando pasás."
            }
          ]
        },
        "regalo": {
          "etiqueta": "Para regalar",
          "titulo": "Viene listo para regalar",
          "card": "En su caja",
          "texto": "Llega en la caja original de la marca. Si es para vos, lo estrenás; si es para alguien más, no tenés que envolver nada."
        },
        "tranquilo": {
          "etiqueta": "Comprá tranquilo",
          "titulo": "Perfumez",
          "items": [
            {
              "titulo": "Marcas árabes",
              "texto": "Armaf, Afnan y Lattafa."
            },
            {
              "titulo": "Envío protegido",
              "texto": "Por Correo Argentino."
            },
            {
              "titulo": "Atención personal",
              "texto": "Te asesoramos por WhatsApp."
            },
            {
              "titulo": "Listo para regalar",
              "texto": "En su caja original."
            },
            {
              "titulo": "Te ayudamos a elegir",
              "texto": "Según lo que te gusta."
            },
            {
              "titulo": "Pago seguro",
              "texto": "Con los medios de la tienda."
            }
          ]
        },
        "faqTitulo": "Lo que nos preguntan",
        "cta": {
          "etiqueta": "Perfumez",
          "titulo": "Elegí el tuyo",
          "boton": "Comprar ahora"
        },
        "similaresTitulo": "También te puede gustar",
        "similaresPill": "Perfume árabe",
        "similaresCantidad": 8
      },
      "home": {
        "portada": {
          "marca": "Perfumez",
          "franja": "Perfumes árabes · Envíos a todo el país",
          "reloj": false,
          "logo": "https://nevux.ar/clientes/perfumez/logo-z-chico.png",
          "etiqueta": "Armaf · Afnan · Lattafa",
          "titulo": "Perfumes",
          "titulo2": "árabes",
          "texto": "Fragancias intensas de 100 ml, de las que se notan. Elegí la tuya y te la mandamos a todo el país.",
          "boton": "Ver perfumes",
          "url": "#nvx-grilla",
          "foto": "https://nevux.ar/clientes/perfumez/portada-frascos.webp",
          "reemplazarBanner": true
        },
        "beneficios": [
          {
            "icono": "original",
            "titulo": "Marcas árabes",
            "texto": "Armaf, Afnan y Lattafa, con su frasco y su caja."
          },
          {
            "icono": "envio",
            "titulo": "Envío a todo el país",
            "texto": "Por Correo Argentino, con seguimiento."
          },
          {
            "icono": "cuotas",
            "titulo": "Pagá como quieras",
            "texto": "Con los medios de pago de la tienda."
          },
          {
            "icono": "regalo",
            "titulo": "Listos para regalar",
            "texto": "En su caja original."
          }
        ],
        "vitrinas": [
          {
            "estilo": "wess",
            "logo": "https://nevux.ar/clientes/perfumez/logo-z-chico.png",
            "etiqueta": "Selección Perfumez",
            "titulo": "Más vendidos",
            "pill": "Perfume árabe",
            "url": "/productos/",
            "boton": "Ver todos los perfumes"
          }
        ],
        "grilla": [
          {
            "titulo": "Últimos ingresos",
            "url": "/productos/",
            "cantidad": 8,
            "pill": "100 ml",
            "quedan": 2,
            "boton": "Ver todos los perfumes"
          }
        ],
        "puntos": {
          "estilo": "wess",
          "titulo": "Un perfume en tres tiempos.",
          "url": "/productos/lattafa-khamrah-qahwa-100ml/",
          "boton": "Ver el Khamrah Qahwa",
          "foto": "https://nevux.ar/clientes/perfumez/p-khamrah-qahwa.jpg",
          "items": [
            {
              "titulo": "Salida",
              "texto": "Canela, cardamomo y jengibre.",
              "x": 42,
              "y": 30
            },
            {
              "titulo": "Corazón",
              "texto": "Praliné, frutas confitadas y flores blancas.",
              "x": 58,
              "y": 50
            },
            {
              "titulo": "Fondo",
              "texto": "Café, vainilla, haba tonka y almizcle.",
              "x": 45,
              "y": 72
            },
            {
              "titulo": "Frasco",
              "texto": "Vidrio tallado de 100 ml.",
              "x": 66,
              "y": 28
            }
          ]
        },
        "colgado": {
          "etiqueta": "Perfumez · Stock limitado",
          "titulo": "Quedan",
          "titulo2": "pocas unidades.",
          "url": "/productos/",
          "boton": "Ver perfumes"
        },
        "porQue": {
          "etiqueta": "Confianza premium",
          "titulo": "Fragancias árabes, entregadas en todo el país.",
          "items": [
            {
              "destacado": "Marcas",
              "titulo": "Árabes reales",
              "texto": "Armaf, Afnan y Lattafa, con su caja.",
              "pie": "Selección Perfumez"
            },
            {
              "destacado": "100 ml",
              "titulo": "Eau de parfum",
              "texto": "Fragancias intensas y duraderas.",
              "pie": "Larga duración"
            },
            {
              "destacado": "Envío",
              "titulo": "A todo el país",
              "texto": "Por Correo Argentino, con seguimiento.",
              "pie": "Envío protegido"
            },
            {
              "destacado": "Asesoramiento",
              "titulo": "Por WhatsApp",
              "texto": "Te ayudamos a elegir según lo que te gusta.",
              "pie": "Atención personal"
            }
          ]
        },
        "faqTitulo": "Resolvé tus dudas",
        "faqLink": {
          "texto": "Quiero asesoramiento por WhatsApp",
          "url": "https://wa.me/5493492324502?text=Hola!%20Quiero%20que%20me%20asesores%20para%20elegir%20un%20perfume"
        },
        "faq": [
          {
            "p": "¿Qué marcas tienen?",
            "r": "Armaf, Afnan y Lattafa, tres de las marcas árabes más conocidas. Todos los frascos son de 100 ml."
          },
          {
            "p": "¿Qué diferencia hay entre perfumes árabes y de diseñador?",
            "r": "Los árabes se destacan por su intensidad, su duración y su relación precio-calidad. Los de diseñador son las marcas internacionales más conocidas."
          },
          {
            "p": "¿Qué perfume me recomiendan para recibir cumplidos?",
            "r": "Escribinos y te recomendamos fragancias con buena proyección y duración, según si es para salir, trabajar o todos los días."
          },
          {
            "p": "¿Mi perfume llega seguro?",
            "r": "Sí. Preparamos cada fragancia para que viaje protegida y llegue en perfectas condiciones."
          },
          {
            "p": "¿Cuánto tarda en llegar?",
            "r": "Depende de tu ciudad. Una vez despachado, te pasamos el seguimiento de Correo Argentino."
          },
          {
            "p": "¿Puedo probarlos antes?",
            "r": "Sí. Si nos vemos en persona, tenemos decants de cada fragancia para que la pruebes."
          }
        ],
        "cierre": {
          "etiqueta": "Perfumez",
          "titulo": "Encontrá tu fragancia",
          "texto": "Perfumes árabes de 100 ml con envío a todo el país.",
          "boton": "Ver todos los perfumes",
          "url": "/productos/"
        },
        "categorias": [
          {
            "nombre": "Hombre",
            "url": "/perfumes-arabes-hombre/",
            "foto": "https://nevux.ar/clientes/perfumez/cat-hombre.jpg",
            "texto": "Intensos y elegantes"
          },
          {
            "nombre": "Mujer",
            "url": "/perfumes-arabes-mujer/",
            "foto": "https://nevux.ar/clientes/perfumez/cat-mujer.jpg",
            "texto": "Dulces y sofisticados"
          },
          {
            "nombre": "Unisex",
            "url": "/productos/lattafa-badee-al-oud-sublime-100ml/",
            "foto": "https://nevux.ar/clientes/perfumez/cat-unisex.jpg",
            "texto": "Para compartir"
          }
        ],
        "categoriasEtiqueta": "Elegí por estilo",
        "categoriasTitulo": "Encontrá tu próxima fragancia",
        "categoriasEstilo": "tarjetas",
        "categoriasArriba": true
      }
    }
  },
  "valmont": {
    nombre: "Valmont Relojes (Wess)",
    activo: true,
    // Miguel se suscribió con el link general del Premium (mpago.la/2mkcebx): se lee la suscripción de ese plan
    cobro: { tipo: "mercadopago", planMp: "86ce0bba2cc849f3b04e9208748581af", gracia: 3 },
    dominios: ["valmontrelojes.mitiendanube.com", "valmontrelojes.com.ar"],
    plan: "premium",
    config: {
      "color": "#d4af37",
      "marca": {
        "oscuro": "#0a0a0a"
      },
      "anuncios": [
        "🚚 Envíos gratis a todo el país",
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
            "Asesoramiento *personalizado*"
          ],
          "portada": {
            "fotos": [
              "https://nevux.ar/clientes/valmont/video-gshock-gst-b400.jpg"
            ],
            "etiqueta": "Valmont · Relojería",
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
              "icono": "chat",
              "titulo": "Asesoramiento",
              "texto": "Expertos en relojería"
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
              "p": "¿Cuánto tarda el envío?",
              "r": "Los envíos son gratis a todo el país y demoran entre 2 y 5 días hábiles."
            },
            {
              "p": "¿Puedo cambiar el reloj?",
              "r": "Sí, tenés 30 días para cambios y devoluciones."
            }
          ],
          "banner": {
            "etiqueta": "[ Valmont ]",
            "titulo": "Encontrá tu estilo.",
            "foto": "https://nevux.ar/clientes/valmont/video-gshock-gst-b400.jpg",
            "boton": "Ver relojes",
            "url": "/productos/"
          }
        },
        "rotador": {
          "etiqueta": "Colecciones",
          "items": [
            {
              "nombre": "Casio",
              "url": "/search/?q=casio",
              "foto": "https://nevux.ar/clientes/valmont/cat-digitales.svg"
            },
            {
              "nombre": "G-Shock",
              "url": "/search/?q=g-shock",
              "foto": "https://nevux.ar/clientes/valmont/cat-deportivos.svg"
            },
            {
              "nombre": "Mistral",
              "url": "/search/?q=mistral",
              "foto": "https://nevux.ar/clientes/valmont/cat-analogicos.svg"
            },
            {
              "nombre": "Tressa",
              "url": "/search/?q=tressa",
              "foto": "https://nevux.ar/clientes/valmont/cat-smartwatches.svg"
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
