import { Resend } from "resend";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ delivered: boolean }> {
  if (!resend) {
    console.info(
      `\n[mail:dev] Para: ${opts.to}\n[mail:dev] Assunto: ${opts.subject}\n[mail:dev] Conteúdo:\n${opts.text ?? opts.html}\n`,
    );
    return { delivered: false };
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Núk <no-reply@nexus.app>",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  if (error) {
    console.error("[mail] Falha ao enviar e-mail:", error);
    return { delivered: false };
  }

  return { delivered: true };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Redefinição de senha — Núk",
    text: `Você solicitou a redefinição de senha.\n\nAcesse: ${resetUrl}\n\nO link expira em 1 hora. Se não foi você, ignore este e-mail.`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;background:#06070b;color:#f5f5f8;padding:32px;border-radius:16px">
        <h1 style="font-size:20px;margin:0 0 12px">Redefinição de senha</h1>
        <p style="color:#9295a5">Você solicitou a redefinição da sua senha no Núk.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 22px;border-radius:12px;background:linear-gradient(135deg,#9165ff,#438cff);color:#fff;text-decoration:none;font-weight:700">Redefinir senha</a>
        <p style="color:#9295a5;font-size:13px">O link expira em 1 hora. Se não foi você, ignore este e-mail.</p>
      </div>`,
  };
}
