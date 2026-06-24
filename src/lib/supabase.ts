import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const SUPABASE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "nuk-media";

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Cliente público (browser/RSC) — operações de leitura e upload autenticado. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/** Cliente com service role (apenas server) — uploads server-side e admin. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

/**
 * Faz upload de um arquivo no Storage e retorna a URL pública.
 * Usado server-side a partir de Server Actions.
 */
export async function uploadToStorage(
  path: string,
  file: ArrayBuffer | Buffer | Blob,
  contentType: string,
): Promise<string | null> {
  const admin = getSupabaseAdmin() ?? getSupabaseClient();
  if (!admin) return null;

  const body =
    file instanceof Blob ? file : new Blob([file as ArrayBuffer], { type: contentType });

  const { error } = await admin.storage
    .from(SUPABASE_BUCKET)
    .upload(path, body, { contentType, upsert: true });

  if (error) {
    console.error("[supabase] upload error:", error.message);
    return null;
  }

  const { data } = admin.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
