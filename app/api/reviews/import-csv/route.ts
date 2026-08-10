import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const MAX_FILAS = 500

// ═══════════════════════════════════════════════════════════
// Helper: parsea el texto CSV en filas + columnas
// Maneja comillas dobles y comas dentro de campos
// ═══════════════════════════════════════════════════════════
function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  const lines = text.split(/\r?\n/)

  for (const line of lines) {
    if (line.trim() === '') continue

    const cols: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const ch = line[i]

      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(current)
        current = ''
      } else {
        current += ch
      }
    }

    cols.push(current)
    rows.push(cols)
  }

  return rows
}

// ═══════════════════════════════════════════════════════════
// Helper: normaliza un valor booleano del CSV
// ═══════════════════════════════════════════════════════════
function parseBool(value: string): boolean {
  const v = value.trim().toLowerCase()
  return v === 'true' || v === '1' || v === 'si' || v === 'sí'
}

// ═══════════════════════════════════════════════════════════
// Helper: valida y normaliza una fecha del CSV
// ═══════════════════════════════════════════════════════════
function parseFecha(value: string): string | null {
  if (!value || value.trim() === '') return null
  const trimmed = value.trim()
  const parsed = Date.parse(trimmed)
  if (Number.isNaN(parsed)) return null
  return new Date(parsed).toISOString().split('T')[0]
}

// ═══════════════════════════════════════════════════════════
// POST /api/reviews/import-csv
// Importa reseñas desde un CSV — solo el dueño del widget
// ═══════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // 1. Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Leer form-data
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json(
        { error: 'El body debe ser multipart/form-data' },
        { status: 400 }
      )
    }

    const widgetId = formData.get('widget_id')
    const productIdRaw = formData.get('product_id')
    const file = formData.get('file')

    if (!widgetId || typeof widgetId !== 'string') {
      return NextResponse.json(
        { error: 'widget_id es requerido' },
        { status: 400 }
      )
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'El campo "file" debe ser un archivo CSV' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'El archivo debe tener extensión .csv' },
        { status: 400 }
      )
    }

    // 3. Verificar ownership del widget
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, store_id, user_id')
      .eq('id', widgetId)
      .eq('user_id', user.id)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { error: 'Widget no encontrado o no autorizado' },
        { status: 403 }
      )
    }

    // 4. Leer y parsear el CSV
    const rawText = await file.text()
    const rows = parseCSV(rawText)

    if (rows.length < 2) {
      return NextResponse.json(
        { error: 'El CSV está vacío o solo tiene encabezados' },
        { status: 400 }
      )
    }

    // 5. Leer encabezados (primera fila) — case insensitive, trim
    const headers = rows[0].map((h) => h.trim().toLowerCase())

    const idxNombre = headers.indexOf('nombre')
    const idxEstrellas = headers.indexOf('estrellas')
    const idxTexto = headers.indexOf('texto')
    const idxFecha = headers.indexOf('fecha')
    const idxVerificada = headers.indexOf('verificada')
    const idxFotoUrl = headers.indexOf('foto_url')

    if (idxNombre === -1 || idxEstrellas === -1 || idxTexto === -1) {
      return NextResponse.json(
        {
          error:
            'El CSV debe tener al menos las columnas: nombre, estrellas, texto',
        },
        { status: 400 }
      )
    }

    // 6. Preparar datos para inserción
    const dataRows = rows.slice(1)

    if (dataRows.length > MAX_FILAS) {
      return NextResponse.json(
        {
          error: `El CSV no puede tener más de ${MAX_FILAS} filas de datos`,
        },
        { status: 400 }
      )
    }

    const productIdNum =
      productIdRaw && String(productIdRaw).trim() !== ''
        ? parseInt(String(productIdRaw), 10)
        : null

    const hoy = new Date().toISOString().split('T')[0]
    const storeId = String(widget.store_id)

    // 7. Obtener reseñas existentes para chequeo de duplicados en bloque
    //    (evita N queries, una sola consulta al inicio)
    const { data: existentes } = await supabase
      .from('reviews')
      .select('nombre, product_id')
      .eq('widget_id', widgetId)

    const setExistentes = new Set(
      (existentes || []).map((r) => {
        const pid = r.product_id !== null ? String(r.product_id) : 'null'
        return `${r.nombre.trim().toLowerCase()}::${pid}`
      })
    )

    // 8. Procesar filas
    const registrosParaInsertar: Record<string, any>[] = []
    const errores: { fila: number; motivo: string }[] = []

    for (let i = 0; i < dataRows.length; i++) {
      const filaNum = i + 2 // +2 porque fila 1 = headers, y es 1-indexed
      const cols = dataRows[i]

      // Extraer valores
      const nombre = cols[idxNombre]?.trim() ?? ''
      const estrellasRaw = cols[idxEstrellas]?.trim() ?? ''
      const texto = cols[idxTexto]?.trim() ?? ''
      const fechaRaw = idxFecha !== -1 ? cols[idxFecha]?.trim() ?? '' : ''
      const verificadaRaw =
        idxVerificada !== -1 ? cols[idxVerificada]?.trim() ?? '' : ''
      const fotoUrl =
        idxFotoUrl !== -1 ? cols[idxFotoUrl]?.trim() ?? '' : ''

      // Validar nombre
      if (nombre.length < 2) {
        errores.push({
          fila: filaNum,
          motivo: 'nombre debe tener al menos 2 caracteres',
        })
        continue
      }
      if (nombre.length > 80) {
        errores.push({
          fila: filaNum,
          motivo: 'nombre no puede superar 80 caracteres',
        })
        continue
      }

      // Validar estrellas
      const estrellasNum = parseInt(estrellasRaw, 10)
      if (
        Number.isNaN(estrellasNum) ||
        estrellasNum < 1 ||
        estrellasNum > 5
      ) {
        errores.push({
          fila: filaNum,
          motivo: 'estrellas inválidas (debe ser 1 a 5)',
        })
        continue
      }

      // Validar texto
      if (texto.length < 5) {
        errores.push({
          fila: filaNum,
          motivo: 'texto debe tener al menos 5 caracteres',
        })
        continue
      }
      if (texto.length > 2000) {
        errores.push({
          fila: filaNum,
          motivo: 'texto no puede superar 2000 caracteres',
        })
        continue
      }

      // Chequeo de duplicado (contra BD + contra el mismo CSV en esta importación)
      const pidKey =
        productIdNum !== null ? String(productIdNum) : 'null'
      const claveUnica = `${nombre.toLowerCase()}::${pidKey}`

      if (setExistentes.has(claveUnica)) {
        errores.push({
          fila: filaNum,
          motivo: 'Ya existe una reseña con ese nombre para este producto',
        })
        continue
      }

      // Agregar al set para evitar duplicados dentro del mismo CSV
      setExistentes.add(claveUnica)

      // Parsear campos opcionales
      const fechaFinal = parseFecha(fechaRaw) ?? hoy
      const verificadaFinal =
        verificadaRaw !== '' ? parseBool(verificadaRaw) : false
      const fotoUrlFinal =
        fotoUrl !== '' && fotoUrl.length <= 2 * 1024 * 1024
          ? fotoUrl
          : null

      registrosParaInsertar.push({
        widget_id: widgetId,
        store_id: storeId,
        product_id: productIdNum,
        nombre,
        email: null,
        estrellas: estrellasNum,
        texto,
        foto_url: fotoUrlFinal,
        talle: null,
        ajuste_talle: null,
        verificada: verificadaFinal,
        estado: 'aprobada',
        desde_calificar: false,
        fecha_resena: fechaFinal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    // 9. Insertar en lotes de 100 para no saturar Supabase
    let importadas = 0

    for (let i = 0; i < registrosParaInsertar.length; i += 100) {
      const lote = registrosParaInsertar.slice(i, i + 100)

      const { error: insertError } = await supabase
        .from('reviews')
        .insert(lote)

      if (insertError) {
        console.error('Error insertando lote CSV:', insertError)
        // No abortamos todo — reportamos cuántas se insertaron hasta acá
        return NextResponse.json(
          {
            success: false,
            error: 'Error al insertar un lote de reseñas',
            details: insertError.message,
            importadas,
            salteadas: errores.length,
            errores,
          },
          { status: 500 }
        )
      }

      importadas += lote.length
    }

    // 10. Respuesta final
    return NextResponse.json({
      success: true,
      importadas,
      salteadas: errores.length,
      errores,
    })
  } catch (error: any) {
    console.error('Error en POST /api/reviews/import-csv:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error?.message,
      },
      { status: 500 }
    )
  }
            }
