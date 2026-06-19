"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { sendEmail, passwordResetEmail } from "@/lib/mail";
import { absoluteUrl, deriveUsername } from "@/lib/utils";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations";
import type { ActionResult } from "@/server/action-result";

export async function registerUser(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: String(formData.get("username") ?? "").toLowerCase(),
    email: String(formData.get("email") ?? "").toLowerCase(),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos do formulário.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;
  let { username } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { ok: false, error: "Este e-mail já está em uso." };
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    username = deriveUsername(username);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, username, email, passwordHash },
  });

  return { ok: true };
}

export async function requestPasswordReset(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: String(formData.get("email") ?? "").toLowerCase(),
  });

  if (!parsed.success) {
    return { ok: false, error: "E-mail inválido." };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Resposta idêntica exista ou não o usuário (evita enumeração de e-mails).
  if (user) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    const resetUrl = absoluteUrl(`/reset-password?token=${token}`);
    const tpl = passwordResetEmail(resetUrl);
    await sendEmail({ to: email, ...tpl });
  }

  return { ok: true };
}

export async function resetPassword(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return { ok: false, error: "Token inválido ou expirado." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash },
  });
  await prisma.passwordResetToken.deleteMany({
    where: { email: record.email },
  });

  return { ok: true };
}
