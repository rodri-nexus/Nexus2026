// Semana 4 de @hogardigitaltiendaonline (lunes 23 al viernes 27 de noviembre de 2026). Se arma día por día (pedido de Rodrigo).
// Catálogo revisado en vivo el 22/11 (precios, stock y fotos de cada ficha). Promos reales: 10% con transferencia y,
// en las fichas que lo muestran, 15% llevando 2 / 25% llevando 3 ("no acumulable con algunas promociones").
// Desde el 22/11 ya NO hay envío gratis desde $50.000 (envioGratisDesde: 0): no prometerlo. Tampoco "cuotas sin interés".
// Combo Navideño (22/11): $44.000; trae árbol blanco de 90 cm, estrella, luces LED con control y arbolito de mesa (ya no los adornos).
// Anteojos Hyundai: la tienda muestra un precio de lista que no corresponde ($144.372): se muestra solo el precio.
const P = require("./productos.json");
const H = "#hogardigital #tecnologia #regalos #hogar #deco #emprendedoresargentinos #compraonline #envios #argentina";

const prod = (k, n, texto) => ({ tipo: "producto", n, nombre: P[k].nombre.replace(/\s*\(.*\)$/, ""), precio: P[k].precio, lista: P[k].lista, img: P[k].img, texto });
const nuevo = (archivo, eb, titulo, sub) => ({ archivo, tipo: "portada", eb, titulo, sub, boton: "Miralo en el perfil" });
const plata = (n) => "$" + Math.round(n).toLocaleString("es-AR");

const carruseles = [
  {
    carpeta: "11-novedades",
    nombre: "Novedades en Hogar Digital",
    placas: [
      { tipo: "portada", eb: "Recién llegados", titulo: 'Novedades en <span class="az">Hogar Digital</span>', sub: "6 productos nuevos en la tienda. Deslizá y elegí el tuyo.", desliza: "Deslizá →" },
      prod("antifaz", "NUEVO · PARA DORMIR Y VIAJAR", "Auriculares Bluetooth integrados y micrófono. Unas 8 horas de reproducción."),
      prod("anteojos", "NUEVO · MÚSICA EN LAS PATILLAS", "Bluetooth 5.4: escuchás música y atendés llamadas desde los anteojos."),
      prod("reloj-oryx", "NUEVO · PARA LA MESA O LA PARED", "Números 3D con luz LED: hora, fecha y temperatura. 3 alarmas."),
      prod("morral", "NUEVO · COMPACTO Y SEGURO", "Cierre con dos tiradores y hebilla. En negro, marrón o camuflado."),
      prod("luz-120", "NUEVO · PARA LOS CORTES DE LUZ", "120 LED para tener luz en casa cuando se corta."),
      prod("zl73j", "NUEVO · RESISTENTE AL AGUA", "Smartwatch con Bluetooth, pantalla de 1,39\" y malla de silicona."),
      { tipo: "portada", eb: "¿Cuál te llevás?", titulo: 'Todos ya están <span class="az">en la tienda</span>', sub: "Pagando con transferencia tenés <b>10% OFF</b>. Envíos a todo el país.", boton: "Link en el perfil" },
    ],
    caption: `✨ Novedades en Hogar Digital: 6 productos nuevos en la tienda

1️⃣ Antifaz Bluetooth para dormir · ${plata(P.antifaz.precio)}
Auriculares integrados y micrófono, unas 8 horas de reproducción.

2️⃣ Anteojos inteligentes Hyundai HY-C8 · ${plata(P.anteojos.precio)}
Bluetooth 5.4: música y llamadas desde las patillas.

3️⃣ Reloj digital Oryx 3D con luz LED · ${plata(P["reloj-oryx"].precio)}
Hora, fecha y temperatura, 3 alarmas. Para la mesa o la pared.

4️⃣ Bolso morral MODS-772 · ${plata(P.morral.precio)}
Compacto, con cierre doble y hebilla. Negro, marrón o camuflado.

5️⃣ Luz de emergencia 120 LED · ${plata(P["luz-120"].precio)}
Para tener luz en casa cuando se corta.

6️⃣ Smartwatch ZL73J negro · ${plata(P.zl73j.precio)}
Bluetooth, pantalla de 1,39" y resistente al agua.

💸 Pagando con transferencia, 10% OFF
📦 Envíos a todo el país

¿Cuál te llevás? Contanos en los comentarios 👇
🛒 hogardigital.com.ar (link en el perfil)

${H}`,
  },
  {
    carpeta: "12-combo-nuevo-precio",
    nombre: "Combo Navideño, nuevo precio",
    placas: [
      { ...prod("combo", "COMBO NAVIDEÑO · NUEVO PRECIO", "Todo para armar tu Navidad, en un solo pedido. Deslizá y mirá qué trae 👉") },
      { tipo: "producto", n: "1 · EL ÁRBOL", nombre: "Árbol blanco de 90 cm", img: "p/combo-arbol.jpg", texto: "Para decorar cualquier espacio de tu casa." },
      { tipo: "producto", n: "2 · LA PUNTA", nombre: "Estrella para el árbol", img: "p/combo-estrella-2.jpg", texto: "Para que tu árbol se destaque." },
      { tipo: "producto", n: "3 · LAS LUCES", nombre: "Luces LED con control remoto", img: "p/combo-luces.jpg", texto: "Con distintos efectos para ambientar tus reuniones." },
      { tipo: "producto", n: "4 · PARA LA MESA", nombre: "Arbolito de mesa", img: "p/combo-arbolito.jpg", texto: "El detalle especial para tu mesa navideña." },
      { tipo: "portada", eb: "Combo Navideño", titulo: `Ahora <span class="az">${plata(P.combo.precio)}</span>`, sub: `Antes ${plata(P.combo.lista)}. Pagando con transferencia, <b>${plata(P.combo.precio * 0.9)}</b>. Envíos a todo el país.`, boton: "Link en el perfil" },
    ],
    caption: `🎄 Combo Navideño, nuevo precio: ${plata(P.combo.precio)}

Todo para armar tu Navidad, en un solo pedido:
🌲 Árbol de Navidad blanco de 90 cm
⭐ Punta de árbol con estrella
💡 Luces LED con control remoto, con distintos efectos
🎁 Arbolito de mesa, para el detalle especial

💲 ${plata(P.combo.precio)} (antes ${plata(P.combo.lista)})
💸 Pagando con transferencia: ${plata(P.combo.precio * 0.9)}
📦 Envíos a todo el país

¿Lo armás antes del 8 de diciembre? Comentá 🎄 y te paso el link.
🛒 hogardigital.com.ar (link en el perfil)

#hogardigital #navidad #decoracionnavideña #arbolitodenavidad #hogar #deco #compraonline #envios #argentina`,
  },
];

const historias = [
  // Lun 23/11 · Carrusel: novedades
  { archivo: "1123-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Viste lo nuevo <span class="az">de la tienda</span>?', sub: "Contestame con la encuesta 👇 Hoy te mostramos 6 productos nuevos.", resp: "Sí · Todavía no ✨" },
  { ...prod("reloj-oryx", "NUEVO EN LA TIENDA", "Números 3D con luz LED: hora, fecha y temperatura."), archivo: "1123-2" },
  nuevo("1123-3", "Nuevo post", 'Novedades en <span class="az">Hogar Digital</span>', "6 productos nuevos. Miralos en el perfil ✨"),

  // Mar 24/11 · Reel: anteojos inteligentes Hyundai
  { archivo: "1124-1", tipo: "opciones", eb: "Elegí uno", titulo: '¿Música con <span class="az">auriculares o anteojos</span>?', opciones: [
    { letra: "A", nombre: "Auriculares", img: P.auriculares.img }, { letra: "B", nombre: "Anteojos", img: P.anteojos.img }], resp: "Respondé A o B en la encuesta 👇" },
  { archivo: "1124-2", tipo: "dato", eb: "Anteojos Hyundai HY-C8", grande: "9 h", az: true, titulo: "de música", sub: `Bluetooth 5.4, hasta 10 m de alcance y llamadas desde las patillas. <b>${plata(P.anteojos.precio)}</b>.` },
  nuevo("1124-3", "Nuevo reel", 'Anteojos que <span class="az">también suenan</span>', "Música y llamadas desde las patillas 🕶️"),

  // Mié 25/11 · Carrusel: Combo Navideño, nuevo precio
  { archivo: "1125-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Cuándo <span class="az">armás el árbol</span>?', sub: "Contestame con la encuesta 👇", resp: "Ya está armado · El 8 de diciembre 🎄" },
  { archivo: "1125-2", tipo: "dato", eb: "Combo Navideño · nuevo precio", grande: plata(P.combo.precio), az: true, titulo: "todo el combo", sub: `Árbol, estrella, luces y arbolito de mesa. Con transferencia, <b>${plata(P.combo.precio * 0.9)}</b>.` },
  nuevo("1125-3", "Nuevo post", 'Combo Navideño, <span class="az">nuevo precio</span>', "Miralo en el perfil 🎄"),
];

module.exports = { carruseles, historias };
