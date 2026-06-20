import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getSupabaseAdmin, SUPABASE_BUCKET } from "@/lib/supabase";

const SIGNED_URL_EXPIRES_IN = 60 * 5; // 5 minutos

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const userId = session.user.id;

  const item = await prisma.libraryItem.findUnique({
    where: { userId_productId: { userId, productId } },
    include: { product: { select: { fileUrl: true, title: true } } },
  });

  if (!item) {
    return NextResponse.json({ error: "Produto não encontrado na biblioteca." }, { status: 403 });
  }

  const fileUrl = item.product.fileUrl;
  if (!fileUrl) {
    return NextResponse.json({ error: "Arquivo não disponível." }, { status: 404 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.redirect(fileUrl);
  }

  // Extrai o path relativo dentro do bucket (ex: "products/abc/file.pdf")
  const bucketPrefix = `/storage/v1/object/public/${SUPABASE_BUCKET}/`;
  const filePath = fileUrl.includes(bucketPrefix)
    ? fileUrl.split(bucketPrefix)[1]
    : fileUrl;

  const { data, error } = await admin.storage
    .from(SUPABASE_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRES_IN, {
      download: item.product.title,
    });

  if (error || !data?.signedUrl) {
    return NextResponse.redirect(fileUrl);
  }

  return NextResponse.redirect(data.signedUrl);
}
