"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createProductSchema, updateProductSchema } from "@/lib/validations";
import type { ActionResult } from "@/server/action-result";

export async function createProduct(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados do produto inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      fileUrl: parsed.data.fileUrl || null,
      coverUrl: parsed.data.coverUrl || null,
      creatorId: user.id,
    },
  });

  revalidatePath(`/${user.username}`);
  revalidatePath("/marketplace");
  return { ok: true, data: { id: product.id } };
}

export async function updateProduct(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, ...data } = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Produto não encontrado." };
  if (existing.creatorId !== user.id) return { ok: false, error: "Sem permissão." };

  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      fileUrl: data.fileUrl === "" ? null : data.fileUrl,
      coverUrl: data.coverUrl === "" ? null : data.coverUrl,
    },
  });

  revalidatePath(`/marketplace/products/${id}`);
  revalidatePath(`/${user.username}`);
  return { ok: true, data: { id } };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const user = await requireUser();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, error: "Produto não encontrado." };
  if (product.creatorId !== user.id && user.role !== "ADMIN") {
    return { ok: false, error: "Sem permissão." };
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/marketplace");
  revalidatePath(`/${user.username}`);
  return { ok: true };
}

export async function createCheckoutSession(
  productId: string,
): Promise<ActionResult<{ url: string }>> {
  const user = await requireUser();

  if (!isStripeConfigured || !stripe) {
    return { ok: false, error: "Pagamentos não configurados neste ambiente." };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, error: "Produto não encontrado." };
  if (!product.published) return { ok: false, error: "Produto indisponível." };
  if (product.creatorId === user.id) {
    return { ok: false, error: "Você não pode comprar seu próprio produto." };
  }

  const alreadyOwns = await prisma.libraryItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (alreadyOwns) return { ok: false, error: "Você já possui este produto." };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const order = await prisma.order.create({
    data: {
      buyerId: user.id,
      stripeCheckoutId: "pending",
      totalCents: product.priceCents,
      currency: product.currency,
      items: {
        create: { productId, priceCents: product.priceCents },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: product.currency,
          unit_amount: product.priceCents,
          product_data: {
            name: product.title,
            description: product.description.slice(0, 500),
            ...(product.coverUrl ? { images: [product.coverUrl] } : {}),
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: order.id,
      buyerId: user.id,
      productId,
    },
    success_url: `${appUrl}/library?order=${order.id}&success=1`,
    cancel_url: `${appUrl}/marketplace/products/${productId}?cancelled=1`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutId: session.id },
  });

  return { ok: true, data: { url: session.url! } };
}
