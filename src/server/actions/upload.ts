"use server";

import { randomBytes } from "crypto";

import { requireUser } from "@/lib/session";
import { uploadToStorage, isSupabaseConfigured } from "@/lib/supabase";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Faz upload de uma imagem (avatar, banner ou mídia de post).
 * `folder` separa os arquivos por contexto no bucket.
 */
export async function uploadImage(
  folder: "avatars" | "banners" | "posts",
  formData: FormData,
): Promise<UploadResult> {
  const user = await requireUser();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, error: "Nenhum arquivo enviado." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Arquivo muito grande (máx. 8MB)." };
  }
  if (!ALLOWED.includes(file.type)) {
    return { ok: false, error: "Formato não suportado." };
  }

  if (!isSupabaseConfigured) {
    // Em desenvolvimento, degrada para um placeholder determinístico para não
    // bloquear o fluxo. Em produção, falha de forma controlada.
    if (process.env.NODE_ENV !== "production") {
      const seed = `${user.id}-${folder}-${Date.now()}`;
      return {
        ok: true,
        url: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}`,
      };
    }
    return {
      ok: false,
      error:
        "Storage não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e as chaves do Supabase.",
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${user.id}/${randomBytes(8).toString("hex")}.${ext}`;
  const buffer = await file.arrayBuffer();

  const url = await uploadToStorage(path, buffer, file.type);
  if (!url) {
    return { ok: false, error: "Falha no upload. Tente novamente." };
  }

  return { ok: true, url };
}
