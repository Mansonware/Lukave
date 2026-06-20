import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId, buyerId, productId } = session.metadata ?? {};

    if (!orderId || !buyerId || !productId) {
      return NextResponse.json({ error: "Metadata incompleto." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
        },
      }),
      prisma.libraryItem.upsert({
        where: { userId_productId: { userId: buyerId, productId } },
        create: { userId: buyerId, productId, orderId },
        update: {},
      }),
    ]);

    await prisma.notification.create({
      data: {
        type: "PURCHASE",
        recipientId: buyerId,
        actorId: buyerId,
      },
    }).catch(() => null);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId } = session.metadata ?? {};
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      }).catch(() => null);
    }
  }

  return NextResponse.json({ received: true });
}
