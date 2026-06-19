import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/** Indica se o Stripe está configurado (usado para habilitar UI de pagamento). */
export const isStripeConfigured = Boolean(secretKey);

/**
 * Instância singleton do Stripe — configuração segura apenas.
 * Retorna null quando não configurado, para que a Fase 1 rode sem pagamentos.
 * O fluxo de checkout/assinaturas será implementado nas Fases 4 e 5.
 */
export const stripe: Stripe | null = secretKey
  ? new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" })
  : null;
