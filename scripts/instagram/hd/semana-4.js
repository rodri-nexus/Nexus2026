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
];

const historias = [
  // Lun 23/11 · Carrusel: novedades
  { archivo: "1123-1", tipo: "portada", eb: "Pregunta rápida", titulo: '¿Viste lo nuevo <span class="az">de la tienda</span>?', sub: "Contestame con la encuesta 👇 Hoy te mostramos 6 productos nuevos.", resp: "Sí · Todavía no ✨" },
  { ...prod("reloj-oryx", "NUEVO EN LA TIENDA", "Números 3D con luz LED: hora, fecha y temperatura."), archivo: "1123-2" },
  nuevo("1123-3", "Nuevo post", 'Novedades en <span class="az">Hogar Digital</span>', "6 productos nuevos. Miralos en el perfil ✨"),
];

module.exports = { carruseles, historias };
