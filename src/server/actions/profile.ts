"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations";
import type { ActionResult } from "@/server/actions/auth";

export async function updateProfile(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const social = {
    twitter: String(formData.get("twitter") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    youtube: String(formData.get("youtube") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    github: String(formData.get("github") ?? ""),
  };

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    username: String(formData.get("username") ?? "").toLowerCase(),
    bio: formData.get("bio") ?? "",
    location: formData.get("location") ?? "",
    websiteUrl: formData.get("websiteUrl") ?? "",
    image: formData.get("image") ?? "",
    bannerUrl: formData.get("bannerUrl") ?? "",
    social,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.username !== user.username) {
    const taken = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (taken) return { ok: false, error: "Este username já está em uso." };
  }

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

/** Atualiza apenas a URL de avatar ou banner (após upload no Storage). */
export async function setProfileImage(
  field: "image" | "bannerUrl",
  url: string,
): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { [field]: url },
  });
  revalidatePath("/settings");
  revalidatePath(`/${user.username}`);
  return { ok: true };
}

export async function changePassword(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!user.passwordHash) {
    return { ok: false, error: "Esta conta não usa senha." };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!valid) return { ok: false, error: "Senha atual incorreta." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { ok: true };
}
