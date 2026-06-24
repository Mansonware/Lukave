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
import { publicFormAction } from "@/lib/action-wrapper";

export const registerUser = publicFormAction(
  registerSchema,
  async (formData) => ({
    name: formData.get("name") as string,
    username: String(formData.get("username") ?? "").toLowerCase(),
    email: String(formData.get("email") ?? "").toLowerCase(),
    password: formData.get("password") as string,
  }),
  async (data) => {
    const { name, email, password } = data;
    let { username } = data;

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
);

export const requestPasswordReset = publicFormAction(
  forgotPasswordSchema,
  async (formData) => ({
    email: String(formData.get("email") ?? "").toLowerCase(),
  }),
  async ({ email }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 1000 * 60 * 60);

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
);

export const resetPassword = publicFormAction(
  resetPasswordSchema,
  async (formData) => ({
    token: formData.get("token") as string,
    password: formData.get("password") as string,
  }),
  async ({ token, password }) => {
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
);
