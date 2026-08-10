import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const BUCKET_NAME = 'nevux-videos';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/webm',
]);

const ALLOWED_EXTENSIONS = new Set(['mp4', 'mov', 'avi', 'wmv', 'webm']);

function getExtension(filename: string) {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonError('No autorizado.', 401);
    }

    const formData = await request.formData();
    const widgetId = formData.get('widget_id');
    const fileEntry = formData.get('file');

    if (!widgetId || typeof widgetId !== 'string') {
      return jsonError('Falta el widget_id.', 400);
    }

    if (!fileEntry || !(fileEntry instanceof File)) {
      return jsonError('Falta el archivo de video.', 400);
    }

    const file = fileEntry;
    const extension = getExtension(file.name);

    if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(extension)) {
      return jsonError(
        'Formato de video no permitido. Usá MP4, MOV, AVI, WMV o WEBM.',
        400
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonError('El video supera el tamaño máximo de 5MB.', 400);
    }

    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, user_id')
      .eq('id', widgetId)
      .single();

    if (widgetError || !widget) {
      return jsonError('Widget no encontrado.', 404);
    }

    if (widget.user_id !== user.id) {
      return jsonError('No tenés permisos para subir videos a este widget.', 403);
    }

    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const storagePath = `${widgetId}/${timestamp}-${randomId}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return jsonError(`Error al subir el video: ${uploadError.message}`, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: storagePath,
      nombre: file.name,
      tamanoBytes: file.size,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ocurrió un error inesperado.';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
                                    }
