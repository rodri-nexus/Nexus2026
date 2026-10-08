import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const BUCKET_NAME = 'widget-videos';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

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
      return jsonError('No autorizado. Iniciá sesión para subir videos.', 401);
    }

    const formData = await request.formData();
    const widgetId = formData.get('widget_id') || 'nuevo';
    const fileEntry = formData.get('file');

    if (!fileEntry || !(fileEntry instanceof File)) {
      return jsonError('Falta el archivo de video.', 400);
    }

    const file = fileEntry;
    const extension = getExtension(file.name);

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(extension)) {
      return jsonError(
        'Formato de video no permitido. Usá MP4, MOV, AVI, WMV o WEBM.',
        400
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonError('El video supera el tamaño máximo permitido de 10MB.', 400);
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const storagePath = `${user.id}/${widgetId}/${timestamp}-${randomId}.${extension || 'mp4'}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Intentar subir al bucket público 'widget-videos'
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'video/mp4',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      // Fallback secundario al bucket 'nevux-videos'
      const { error: fallbackError } = await supabase.storage
        .from('nevux-videos')
        .upload(storagePath, fileBuffer, {
          contentType: file.type || 'video/mp4',
          cacheControl: '3600',
          upsert: true,
        });

      if (fallbackError) {
        return jsonError(`Error al subir el video: ${uploadError.message}`, 500);
      }

      const { data: fallbackUrl } = supabase.storage
        .from('nevux-videos')
        .getPublicUrl(storagePath);

      return NextResponse.json({
        success: true,
        url: fallbackUrl.publicUrl,
        path: storagePath,
        nombre: file.name,
        tamanoBytes: file.size,
      });
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
