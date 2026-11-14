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
        "dias": [1, 2, 3, 4, 5],
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
              { "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/aro-de-luz.jpg", "video": "https://nevux.ar/clientes/hogar-digital/comunidad/aro-de-luz.mp4", "url": "https://www.instagram.com/reel/Dc5-mW-xr5o/" },
              { "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-compatibilidad.jpg", "video": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-compatibilidad.mp4", "url": "https://www.instagram.com/reel/Dc3gtpxxr5z/" },
              { "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/parlante-rgb.jpg", "video": "https://nevux.ar/clientes/hogar-digital/comunidad/parlante-rgb.mp4", "url": "https://www.instagram.com/reel/DcRbx7esRZI/" },
              { "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-smartwatch.jpg", "video": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-smartwatch.mp4", "url": "https://www.instagram.com/reel/Dcd-1K5xvjq/" },
              { "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/empaquetando.jpg" },
              { "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-consejos.jpg", "video": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-consejos.mp4", "url": "https://www.instagram.com/reel/DcbUqMARi4y/" }
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
  "suplementacion-la-plata": {
    nombre: "Suplementación La Plata",
    activo: true,
    // Premium estilo Destino en naranja (plantilla Ipanema). Se prende sola cuando paga en nevux.ar/pagar/suplementacion-la-plata.
    // Datos de la tienda (08/11): envío gratis desde $75.000, 3 cuotas sin interés, transferencia solo web (el % sale de cada producto),
    // 2 locales en La Plata, cambios hasta 2 días. Igual que Hogar Digital (cabecera, pie, ficha y carrito en tarjetas) con su naranja.
    cobro: { tipo: 'mercadopago', planPropio: true, gracia: 3 },
    dominios: ['suplementacionlaplata.com'],
    plan: 'premium',
    config: {
      "color": "#dd701b",
      "marca": {
        "oscuro": "#0b0b0b",
        "noche": "#141414"
      },
      "anuncios": [
        "🚚 Envío gratis a La Plata o a todo el país desde $75.000",
        "💳 Hasta 3 cuotas sin interés",
        "📍 2 locales en La Plata"
      ],
      "mediosDePago": [
        "Mercado Pago",
        "Transferencia",
        "Débito",
        "Crédito"
      ],
      "estiloFicha": "destino",
      "envioGratisDesde": 75000,
      "whatsapp": "542215704907",
      "premium": {
        "tema": "destino"
      },
      "fichaDestino": {
        "sello": "Suplementación La Plata · *desde 2017*",
        "confianza": [
          {
            "icono": "cambios",
            "titulo": "Cambios",
            "texto": "Hasta 2 días después de recibirlo"
          },
          {
            "icono": "chat",
            "titulo": "Te asesoramos",
            "texto": "Por WhatsApp"
          },
          {
            "icono": "cuotas",
            "titulo": "3 cuotas sin interés",
            "texto": "En la web y en los locales"
          }
        ],
        "faq": [
          {
            "p": "¿Cuánto sale el envío?",
            "r": "Es gratis a La Plata o a todo el país en compras superiores a $75.000. Enviamos por Correo Argentino o Andreani y te llega el código de seguimiento por mail."
          },
          {
            "p": "¿Cómo puedo pagar?",
            "r": "Con Mercado Pago, transferencia, débito o crédito. Hasta 3 cuotas sin interés en la web y en los locales; en efectivo, solo en los locales."
          },
          {
            "p": "¿Puedo cambiarlo o devolverlo?",
            "r": "Sí, hasta 2 días después de recibirlo o retirarlo. El producto tiene que estar cerrado y en excelente estado."
          },
          {
            "p": "¿Tienen local?",
            "r": "Sí, dos en La Plata: Avenida 32 n.º 842, entre 11 y 12, y Calle 14 n.º 629, entre 44 y 45."
          }
        ],
        "estilo": "hogar",
        "chip": "Desde 2017 · 2 locales en La Plata",
        "envioTexto": "A La Plata o a todo el país"
      },
      "packs": [],
      "tarjetas": {
        "estilo": "destacado"
      },
      "carrito": {
        "estilo": "hogar",
        "acento": "#dd701b",
        "marcador": "SLP"
      },
      "ventas": {
        "estilo": "destino",
        "marca": "Suplementación La Plata"
      },
      "home": {
        "destino": {
          "acento": "#dd701b",
          "modo": "editorial",
          "cinta": [
            "Envío *gratis* desde $75.000",
            "Hasta *3 cuotas* sin interés",
            "*2 locales* en La Plata",
            "Más de *40 marcas*"
          ],
          "portada": {
            "fotos": [
              "https://acdn-us.mitiendanube.com/stores/003/189/220/products/starnutrition-creatinamonohidrato-uva-995e3d2d8fe5b562e317884636144229-1024-1024.webp",
              "https://acdn-us.mitiendanube.com/stores/003/189/220/products/wheyprotein7900-gentech-chocolate1k-603eaf936e9e97198f17879291348728-1024-1024.webp",
              "https://acdn-us.mitiendanube.com/stores/003/189/220/products/creatina-gentech-500-149b2cfb4afc9b6ddb17839759250293-1024-1024.webp"
            ],
            "etiqueta": "Suplementación La Plata · Desde 2017",
            "titulo": "Suplementos al mejor precio.",
            "texto": "Proteínas, creatinas, barritas y más de 40 marcas.",
            "boton": "Ver productos",
            "url": "/productos1/",
            "boton2": "Ver ofertas",
            "url2": "/ofertas/",
            "productosUrl": "/productos1/proteinas/"
          },
          "beneficios": [
            {
              "icono": "envio",
              "titulo": "Envío gratis",
              "texto": "Desde $75.000 a todo el país"
            },
            {
              "icono": "cuotas",
              "titulo": "3 cuotas sin interés",
              "texto": "En la web y en los locales"
            },
            {
              "icono": "transferencia",
              "titulo": "Descuento por transferencia",
              "texto": "Solo en la web"
            },
            {
              "icono": "chat",
              "titulo": "Te asesoramos",
              "texto": "Por WhatsApp"
            }
          ],
          "tira": {
            "items": [
              {
                "nombre": "Proteína",
                "url": "/productos1/proteinas/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/b6aedc70-categoria-proteina/original/200.png"
              },
              {
                "nombre": "Creatina",
                "url": "/productos1/creatina/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/4d25b1c6-categoria-creatina/original/200.png"
              },
              {
                "nombre": "Barritas",
                "url": "/productos1/barras-proteicas/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/16612c3c-categoria-barraproteica/original/200.png"
              },
              {
                "nombre": "Colágeno",
                "url": "/productos1/colageno1/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/e09e7111-categoria-colageno/original/200.png"
              },
              {
                "nombre": "Magnesio",
                "url": "/productos1/citrato-de-magnesio/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/20baf9ab-categoria-citratodemagnesio/original/200.png"
              },
              {
                "nombre": "Proteína vegana",
                "url": "/productos1/proteina-vegana/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/9176e3ba-categoria-proteinavegetal/original/200.png"
              },
              {
                "nombre": "Ganador de masa",
                "url": "/productos1/ganador-de-masa/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/3b1cd934-categoria-ganadordemasa/original/200.png"
              },
              {
                "nombre": "Pre entreno",
                "url": "/productos1/pre-entreno/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/36b265bf-categoria-preentreno/original/200.png"
              },
              {
                "nombre": "Aminoácidos",
                "url": "/productos1/aminoacidos1/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/b49ea5af-categoria-aminoacidos/original/200.png"
              },
              {
                "nombre": "Vitaminas",
                "url": "/productos1/vitaminas/",
                "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/15e45c3d-categoria-vitaminas/original/200.png"
              }
            ]
          },
          "destacados": [
            {
              "etiqueta": "Lo más buscado",
              "titulo": "Proteínas",
              "url": "/productos1/proteinas/",
              "cantidad": 4
            },
            {
              "etiqueta": "Fuerza y rendimiento",
              "titulo": "*Creatinas*",
              "url": "/productos1/creatina/",
              "carrusel": true,
              "cantidad": 8
            },
            {
              "etiqueta": "Ahorrá más",
              "titulo": "Los mejores *combos*",
              "url": "/combos-creatina-proteina/",
              "carrusel": true,
              "cantidad": 8
            }
          ],
          "numeros": {
            "titulo": "Suplementación La Plata *en números*",
            "items": [
              {
                "valor": 2017,
                "texto": "El año en que empezamos"
              },
              {
                "valor": 40,
                "prefijo": "+",
                "texto": "Marcas"
              },
              {
                "valor": 2,
                "texto": "Locales en La Plata"
              }
            ]
          },
          "locales": {
            "etiqueta": "Suplementación La Plata",
            "titulo": "Vení a *conocernos*",
            "texto": "Te asesoramos en persona. En los locales también podés pagar en efectivo.",
            "items": [
              {
                "zona": "La Plata",
                "nombre": "Local de 32",
                "direccion": "Avenida 32 n.º 842, entre 11 y 12, La Plata"
              },
              {
                "zona": "La Plata",
                "nombre": "Local de 14",
                "direccion": "Calle 14 n.º 629, entre 44 y 45, La Plata"
              }
            ]
          },
          "faqTitulo": "Antes de comprar",
          "faq": [
            {
              "p": "¿Cómo compro?",
              "r": "Agregá los productos al carrito (elegí sabor y cantidad), tocá \"Iniciar compra\", completá tus datos y el envío, y elegí cómo pagar. Una vez acreditado el pago, te lo enviamos."
            },
            {
              "p": "¿Cuánto sale el envío?",
              "r": "Es gratis a La Plata o a todo el país en compras superiores a $75.000. Enviamos por Correo Argentino o Andreani y te llega el código de seguimiento por mail."
            },
            {
              "p": "¿Cómo puedo pagar?",
              "r": "Con Mercado Pago, transferencia, débito o crédito. Hasta 3 cuotas sin interés en la web y en los locales; en efectivo, solo en los locales."
            },
            {
              "p": "¿Puedo cambiarlo o devolverlo?",
              "r": "Sí, hasta 2 días después de recibirlo o retirarlo. El producto tiene que estar cerrado y en excelente estado."
            },
            {
              "p": "¿Tienen local?",
              "r": "Sí, dos en La Plata: Avenida 32 n.º 842, entre 11 y 12, y Calle 14 n.º 629, entre 44 y 45."
            }
          ],
          "banner": {
            "etiqueta": "[ Tu objetivo ]",
            "titulo": "Aumento de masa.",
            "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/998e1eb1-aumento-masa-muscular-nuevo/original/735.png",
            "boton": "Ver productos",
            "url": "/objetivo-fitness/aumento-de-masa"
          }
        },
        "rotador": {
          "etiqueta": "Tu objetivo fitness",
          "items": [
            {
              "nombre": "Aumento de masa",
              "url": "/objetivo-fitness/aumento-de-masa",
              "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/998e1eb1-aumento-masa-muscular-nuevo/original/735.png"
            },
            {
              "nombre": "Definición muscular",
              "url": "/objetivo-fitness/definicion-muscular",
              "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/9555230b-definicion-muscular-tamaog/original/520.png"
            },
            {
              "nombre": "Rendimiento y energía",
              "url": "/objetivo-fitness/rendimiento-y-energia",
              "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/325f0838-rendimiento-energia-tamaog/original/520.png"
            },
            {
              "nombre": "Recuperación y bienestar",
              "url": "/objetivo-fitness/recuperacion-y-bienestar",
              "foto": "https://acdn-us.mitiendanube.com/stores/003/189/220/media/8929ae7d-recuperacion-bienestar-tamaog/original/520.png"
            }
          ]
        }
      },
      "ocultar": [
        "[data-store=\"home-categories-featured\"]",
        "[data-store=\"home-institutional-message\"]",
        "[data-store=\"home-banner-categories\"]",
        "[data-store=\"home-products-sale\"]",
        "[data-store=\"featured_products_2\"]",
        "[data-store=\"banner-services\"]"
      ],
      "cabecera": {
        "logo": "https://nevux.ar/clientes/suplementacion-la-plata/logo-negro.png",
        "logoBlanco": "https://nevux.ar/clientes/suplementacion-la-plata/logo-blanco.png",
        "nombre": "Suplementación La Plata"
      },
      "transferencia": 8
    }
  },
  "kingsson": {
    nombre: "KING'SSON",
    activo: true,
    // Premium estilo Destino en negro y dorado (plantilla Uyuni). Se prende sola cuando paga en nevux.ar/pagar/kingsson.
    // Datos de la tienda y del Instagram (14/11): 2 productos (billetera negra y marrón), envío gratis desde $140.000,
    // 3 cuotas sin interés, 15 % por transferencia, envíos desde Buenos Aires. Sin local ni reseñas cargadas: [FALTA] que las pasen.
    // Logo redibujado de su foto de perfil (public/clientes/kingsson/). Videos de la comunidad: kingsson-landing.vercel.app/videos/.
    cobro: { tipo: 'mercadopago', planPropio: true, gracia: 3 },
    dominios: ['kingssonleather.mitiendanube.com'],
    plan: 'premium',
    config: {
      "color": "#B08A45",
      "efecto3d": true,
      "marca": {
        "oscuro": "#0a0a0a",
        "noche": "#141414"
      },
      "anuncios": [
        "🚚 Envíos a todo el país desde Buenos Aires",
        "💳 3 cuotas sin interés",
        "💸 15 % OFF pagando con transferencia"
      ],
      "mediosDePago": [
        "Tarjetas de crédito",
        "Débito",
        "Transferencia",
        "Pago Nube"
      ],
      "estiloFicha": "destino",
      "envioGratisDesde": 140000,
      "whatsapp": "5491157402805",
      "premium": {
        "tema": "destino"
      },
      "fichaDestino": {
        "sello": "KING'SSON · *billeteras minimalistas*",
        "confianza": [
          {
            "icono": "envio",
            "titulo": "Envíos a todo el país",
            "texto": "Desde Buenos Aires"
          },
          {
            "icono": "chat",
            "titulo": "Te asesoramos",
            "texto": "Por WhatsApp"
          },
          {
            "icono": "cuotas",
            "titulo": "3 cuotas sin interés",
            "texto": "Con tarjeta de crédito"
          }
        ],
        "faq": [
          {
            "p": "¿De qué material son?",
            "r": "De cuero seleccionado 100 % genuino, de curtido vegetal."
          },
          {
            "p": "¿Cuánto entra?",
            "r": "Entre 6 y 7 tarjetas y de 10 a 30 billetes, que van en vertical, sin perder el perfil delgado."
          },
          {
            "p": "¿Tiene broches o imán?",
            "r": "No. Cierra con el pliegue natural del cuero: sin imán, sin botón."
          },
          {
            "p": "¿Por qué cada billetera es distinta?",
            "r": "Porque es cuero auténtico: puede tener pequeñas marcas, variaciones de textura o de tono. No son defectos, son la prueba de que cada KING'SSON es única."
          },
          {
            "p": "¿Cómo puedo pagar?",
            "r": "Con tarjeta en 3 cuotas sin interés o por transferencia con 15 % de descuento."
          }
        ],
        "estilo": "hogar",
        "chip": "Cuero 100 % genuino · Hecha a mano en Argentina",
        "envioTexto": "A todo el país desde Buenos Aires"
      },
      "packs": [],
      "tarjetas": {
        "estilo": "destacado"
      },
      "carrito": {
        "estilo": "hogar",
        "acento": "#B08A45",
        "marcador": "KS"
      },
      "ventas": {
        "estilo": "destino",
        "marca": "KING'SSON"
      },
      "transferencia": 15,
      "home": {
        "destino": {
          "acento": "#B08A45",
          "modo": "editorial",
          "cinta": [
            "Cuero *100 % genuino*",
            "Hecha *a mano* en Argentina",
            "*3 cuotas* sin interés",
            "*15 % OFF* por transferencia",
            "Envíos a *todo el país*"
          ],
          "portada": {
            "fotos": [
              "https://acdn-us.mitiendanube.com/stores/005/212/331/products/img_6976-3961f164a606a4693317900377122600-1024-1024.webp",
              "https://acdn-us.mitiendanube.com/stores/005/212/331/products/img_6994-0734dfbd9b7f73109c17900382927363-1024-1024.webp",
              "https://acdn-us.mitiendanube.com/stores/005/212/331/products/img_2817-40f948a007f924a12917900374150164-1024-1024.webp"
            ],
            "etiqueta": "KING'SSON · Billeteras minimalistas",
            "titulo": "Lo esencial, sin llevar de más.",
            "texto": "Billeteras de cuero 100 % genuino, hechas a mano en Argentina.",
            "boton": "Ver la colección",
            "url": "/productos/",
            "boton2": "Escribinos",
            "url2": "https://wa.me/5491157402805",
            "productosUrl": "/productos/"
          },
          "beneficios": [
            {
              "icono": "envio",
              "titulo": "Envíos a todo el país",
              "texto": "Gratis desde $140.000"
            },
            {
              "icono": "cuotas",
              "titulo": "3 cuotas sin interés",
              "texto": "Con tarjeta de crédito"
            },
            {
              "icono": "transferencia",
              "titulo": "15 % OFF",
              "texto": "Pagando con transferencia"
            },
            {
              "icono": "chat",
              "titulo": "Te asesoramos",
              "texto": "Por WhatsApp"
            }
          ],
          "destacados": [
            {
              "etiqueta": "La colección",
              "titulo": "Elegí *la tuya*",
              "url": "/productos/",
              "cantidad": 2
            }
          ],
          "numeros": {
            "titulo": "KING'SSON *en números*",
            "items": [
              {
                "valor": 100,
                "texto": "% cuero genuino"
              },
              {
                "valor": 7,
                "texto": "Tarjetas, hasta"
              },
              {
                "valor": 30,
                "texto": "Billetes, hasta"
              }
            ]
          },
          "faqTitulo": "Antes de elegir la tuya",
          "faq": [
            {
              "p": "¿De qué material son?",
              "r": "De cuero seleccionado 100 % genuino, de curtido vegetal."
            },
            {
              "p": "¿Cuánto entra?",
              "r": "Entre 6 y 7 tarjetas y de 10 a 30 billetes, que van en vertical, sin perder el perfil delgado."
            },
            {
              "p": "¿Tiene broches o imán?",
              "r": "No. Cierra con el pliegue natural del cuero: sin imán, sin botón."
            },
            {
              "p": "¿Por qué cada billetera es distinta?",
              "r": "Porque es cuero auténtico: puede tener pequeñas marcas, variaciones de textura o de tono. No son defectos, son la prueba de que cada KING'SSON es única."
            },
            {
              "p": "¿Hacen envíos?",
              "r": "Sí, desde Buenos Aires a todo el país. El envío es gratis en compras desde $140.000."
            },
            {
              "p": "¿Cómo puedo pagar?",
              "r": "Con tarjeta en 3 cuotas sin interés o por transferencia con 15 % de descuento."
            },
            {
              "p": "¿Venden por mayor?",
              "r": "Sí. Escribinos por WhatsApp y te pasamos el catálogo mayorista."
            }
          ],
          "banner": {
            "etiqueta": "[ Bienvenido a la familia ]",
            "titulo": "Pensada para acompañarte por años.",
            "foto": "https://kingsson-landing.vercel.app/fotos/luz.jpg",
            "boton": "Elegir la mía",
            "url": "/productos/"
          },
          "comunidad": {
            "estilo": "movimiento",
            "titulo": "en movimiento",
            "boton": "Ver en Instagram",
            "etiqueta": "Detrás de escena",
            "cuenta": "Así trabajamos cada billetera",
            "url": "https://www.instagram.com/kingsson.leather/",
            "fotos": [
              {
                "foto": "https://kingsson-landing.vercel.app/videos/taller.jpg",
                "video": "https://kingsson-landing.vercel.app/videos/taller.mp4",
                "url": "https://www.instagram.com/kingsson.leather/"
              },
              {
                "foto": "https://kingsson-landing.vercel.app/videos/tiempo.jpg",
                "video": "https://kingsson-landing.vercel.app/videos/tiempo.mp4",
                "url": "https://www.instagram.com/kingsson.leather/"
              },
              {
                "foto": "https://kingsson-landing.vercel.app/videos/billetes.jpg",
                "video": "https://kingsson-landing.vercel.app/videos/billetes.mp4",
                "url": "https://www.instagram.com/kingsson.leather/"
              },
              {
                "foto": "https://kingsson-landing.vercel.app/videos/portada.jpg",
                "video": "https://kingsson-landing.vercel.app/videos/portada.mp4",
                "url": "https://www.instagram.com/kingsson.leather/"
              },
              {
                "foto": "https://kingsson-landing.vercel.app/videos/dia.jpg",
                "video": "https://kingsson-landing.vercel.app/videos/dia.mp4",
                "url": "https://www.instagram.com/kingsson.leather/"
              },
              {
                "foto": "https://kingsson-landing.vercel.app/videos/cuidado.jpg",
                "video": "https://kingsson-landing.vercel.app/videos/cuidado.mp4",
                "url": "https://www.instagram.com/kingsson.leather/"
              }
            ]
          }
        }
      },
      "cabecera": {
        "logo": "https://nevux.ar/clientes/kingsson/logo-negro.png",
        "nombre": "KING'SSON",
        "logoClaro": "https://nevux.ar/clientes/kingsson/logo-blanco.png"
      },
      "ocultar": [
        "#ns-section-product-list_1793813470186",
        "#ns-section-custom_1793835448078",
        "#ns-section-video_1794316692251",
        "#ns-section-custom_1794580421486",
        "#ns-section-custom_1793837528945",
        "#ns-section-video_1794529176598"
      ]
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
