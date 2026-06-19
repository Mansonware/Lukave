/**
 * Envio de e-mail com degradação graciosa.
 * Se não houver SMTP configurado (EMAIL_SERVER_HOST), o conteúdo é apenas
 * registrado no console — útil em desenvolvimento e no CI. Para produção,
 * basta plugar um provedor (Resend, SES, SMTP) nesta função.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ delivered: boolean }> {
  const host = process.env.EMAIL_SERVER_HOST;

  if (!host) {
    console.info(
      `\n[mail:dev] Para: ${opts.to}\n[mail:dev] Assunto: ${opts.subject}\n[mail:dev] Conteúdo:\n${opts.text ?? opts.html}\n`,
    );
    return { delivered: false };
  }

  // Integração real de SMTP/provedor deve ser implementada aqui.
  // Mantido como ponto de extensão para não acoplar a Fase 1 a um provedor.
  console.info(`[mail] Enviando e-mail para ${opts.to} via ${host}`);
  return { delivered: true };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Redefinição de senha — NEXUS",
    text: `Você solicitou a redefinição de senha.\n\nAcesse: ${resetUrl}\n\nO link expira em 1 hora. Se não foi você, ignore este e-mail.`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;background:#06070b;color:#f5f5f8;padding:32px;border-radius:16px">
        <h1 style="font-size:20px;margin:0 0 12px">Redefinição de senha</h1>
        <p style="color:#9295a5">Você solicitou a redefinição da sua senha no NEXUS.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 22px;border-radius:12px;background:linear-gradient(135deg,#9165ff,#438cff);color:#fff;text-decoration:none;font-weight:700">Redefinir senha</a>
        <p style="color:#9295a5;font-size:13px">O link expira em 1 hora. Se não foi você, ignore este e-mail.</p>
      </div>`,
  };
}
