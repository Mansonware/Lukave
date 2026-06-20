import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Mínimo de 3 caracteres")
  .max(20, "Máximo de 20 caracteres")
  .regex(
    /^[a-z0-9_]+$/,
    "Use apenas letras minúsculas, números e underline",
  );

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome").max(60),
  username: usernameSchema,
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha é muito longa"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60),
  username: usernameSchema,
  bio: z.string().max(280, "A bio deve ter no máximo 280 caracteres").optional().or(z.literal("")),
  location: z.string().max(80).optional().or(z.literal("")),
  websiteUrl: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  social: z
    .object({
      twitter: z.string().max(80).optional().or(z.literal("")),
      instagram: z.string().max(80).optional().or(z.literal("")),
      youtube: z.string().max(120).optional().or(z.literal("")),
      tiktok: z.string().max(80).optional().or(z.literal("")),
      github: z.string().max(80).optional().or(z.literal("")),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Informe a senha atual"),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres").max(72),
});

export const createPostSchema = z.object({
  content: z
    .string()
    .max(2000, "A publicação deve ter no máximo 2000 caracteres")
    .default(""),
  mediaUrls: z.array(z.string().url()).max(4, "Máximo de 4 imagens").default([]),
  visibility: z.enum(["PUBLIC", "FOLLOWERS", "PRIVATE"]).default("PUBLIC"),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1, "Escreva um comentário").max(500),
});

export const createStorySchema = z.object({
  mediaUrl: z.string().url("URL inválida"),
  mediaType: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateStoryInput = z.infer<typeof createStorySchema>;
