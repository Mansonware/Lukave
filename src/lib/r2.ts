/**
 * Cloudflare R2 Storage Service
 *
 * R2 é S3-compatível. Usamos o AWS SDK v3 com endpoint customizado.
 * Secrets NUNCA chegam ao cliente — apenas Server Actions usam este módulo.
 *
 * Variáveis de ambiente necessárias:
 *   R2_ACCOUNT_ID          — ID da conta Cloudflare (sem https://)
 *   R2_ACCESS_KEY_ID       — Access Key ID do R2
 *   R2_SECRET_ACCESS_KEY   — Secret Access Key do R2
 *   R2_BUCKET_NAME         — Nome do bucket R2
 *   R2_PUBLIC_URL          — URL pública/CDN do bucket (ex: https://cdn.nexus.app)
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "nexus-media";

export const isR2Configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export interface PresignedUpload {
  uploadUrl: string;  // URL para PUT direto do browser
  key: string;        // chave no bucket
  publicUrl: string;  // URL pública após upload
}

export interface R2UploadMeta {
  provider: "r2";
  bucket: string;
  key: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
}

/**
 * Gera uma URL pré-assinada para upload direto do browser ao R2.
 * O cliente faz PUT para uploadUrl; o servidor nunca toca no binário.
 *
 * @param key    - Caminho no bucket, ex: "posts/userId/abc123.webp"
 * @param contentType - MIME type do arquivo
 * @param expiresIn   - Segundos até expirar (padrão: 5 minutos)
 */
export async function generateR2UploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
): Promise<PresignedUpload | null> {
  if (!isR2Configured) return null;

  try {
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn });
    const publicUrl = getR2PublicUrl(key);

    return { uploadUrl, key, publicUrl };
  } catch (err) {
    console.error("[r2] generateUploadUrl error:", err);
    return null;
  }
}

/**
 * Remove um objeto do bucket R2.
 * Chamado server-side ao deletar um post/story com mídia associada.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured) return false;

  try {
    const client = getR2Client();
    await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch (err) {
    console.error("[r2] deleteObject error:", err);
    return false;
  }
}

/** Constrói a URL pública de um objeto já carregado no R2. */
export function getR2PublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  return `${base}/${key}`;
}

/**
 * Monta os metadados para salvar no banco (MediaAsset) após um upload R2.
 * Use após confirmar o upload do lado do cliente.
 */
export function buildR2Meta(
  key: string,
  mimeType: string,
  opts?: { sizeBytes?: number; width?: number; height?: number; durationSeconds?: number },
): R2UploadMeta {
  return {
    provider: "r2",
    bucket: R2_BUCKET,
    key,
    url: getR2PublicUrl(key),
    mimeType,
    ...opts,
  };
}
