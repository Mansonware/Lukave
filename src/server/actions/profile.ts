"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations";
import { authAction, noArgsAuthAction, formAction } from "@/lib/action-wrapper";
import { z } from "zod";

export const updateProfile = formAction(
  updateProfileSchema,
  async (formData) => ({
    name: formData.get("name") as string,
    username: String(formData.get("username") ?? "").toLowerCase(),
    bio: (formData.get("bio") as string) ?? "",
    location: (formData.get("location") as string) ?? "",
    websiteUrl: (formData.get("websiteUrl") as string) ?? "",
    image: (formData.get("image") as string) ?? "",
    bannerUrl: (formData.get("bannerUrl") as string) ?? "",
    social: {
      twitter: String(formData.get("twitter") ?? ""),
      instagram: String(formData.get("instagram") ?? ""),
      youtube: String(formData.get("youtube") ?? ""),
      tiktok: String(formData.get("tiktok") ?? ""),
      github: String(formData.get("github") ?? ""),
    },
  }),
  async (data, { user }) => {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio || null,
        location: data.location || null,
        websiteUrl: data.websiteUrl || null,
        image: data.image || undefined,
        bannerUrl: data.bannerUrl || undefined,
        socialLinks: data.social ?? undefined,
      },
    });

    revalidatePath("/settings");
    revalidatePath(`/${data.username}`);
    return { ok: true };
  }
);

/** Atualiza apenas a URL de avatar ou banner (após upload no Storage). */
export const setProfileImage = authAction(
  z.object({
    field: z.enum(["image", "bannerUrl"]),
    url: z.string().url()
  }),
  async ({ field, url }, { user }) => {
    await prisma.user.update({
      where: { id: user.id },
      data: { [field]: url },
    });
    revalidatePath("/settings");
    revalidatePath(`/${user.username}`);
    return { ok: true };
  }
);

export const changePassword = formAction(
  changePasswordSchema,
  async (formData) => ({
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
  }),
  async (data, { user }) => {
    if (!user.passwordHash) {
      return { ok: false, error: "Esta conta não usa senha." };
    }

    const valid = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash,
    );
    if (!valid) return { ok: false, error: "Senha atual incorreta." };

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { ok: true };
  }
);

export const deleteAccount = noArgsAuthAction(async ({ user }) => {
  await prisma.user.delete({
    where: { id: user.id },
  });
  return { ok: true };
});
