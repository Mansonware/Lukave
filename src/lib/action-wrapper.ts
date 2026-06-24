import { z } from "zod";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/server/action-result";
import { Prisma } from "@prisma/client";

export type AuthActionContext = {
  user: Awaited<ReturnType<typeof requireUser>>;
};

export function authAction<TInput, TOutput = undefined>(
  schema: z.ZodType<TInput>,
  handler: (input: TInput, ctx: AuthActionContext) => Promise<ActionResult<TOutput>>
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    try {
      const user = await requireUser();
      const parsed = schema.safeParse(input);
      
      if (!parsed.success) {
        return {
          ok: false,
          error: "Campos inválidos.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        };
      }
      
      return await handler(parsed.data, { user });
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2002') {
          return { ok: false, error: "Registro já existe (duplicado)." };
        }
      }
      return { ok: false, error: error.message || "Ocorreu um erro interno." };
    }
  };
}

export function noArgsAuthAction<TOutput>(
  handler: (ctx: AuthActionContext) => Promise<ActionResult<TOutput>>
) {
  return async (): Promise<ActionResult<TOutput>> => {
    try {
      const user = await requireUser();
      return await handler({ user });
    } catch (error: any) {
      return { ok: false, error: error.message || "Ocorreu um erro interno." };
    }
  };
}

export function formAction<TInput, TOutput = undefined>(
  schema: z.ZodType<TInput>,
  parser: (formData: FormData) => TInput | Promise<TInput>,
  handler: (input: TInput, ctx: AuthActionContext) => Promise<ActionResult<TOutput>>
) {
  return async (
    _prev: ActionResult<TOutput> | undefined | null,
    formData: FormData
  ): Promise<ActionResult<TOutput>> => {
    try {
      const user = await requireUser();
      const input = await parser(formData);
      const parsed = schema.safeParse(input);
      
      if (!parsed.success) {
        return {
          ok: false,
          error: "Verifique os campos.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        };
      }
      
      return await handler(parsed.data, { user });
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2002') {
          return { ok: false, error: "Registro já existe (duplicado)." };
        }
      }
      return { ok: false, error: error.message || "Ocorreu um erro interno." };
    }
  };
}

export function publicAction<TInput, TOutput = undefined>(
  schema: z.ZodType<TInput>,
  handler: (input: TInput) => Promise<ActionResult<TOutput>>
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    try {
      const parsed = schema.safeParse(input);
      
      if (!parsed.success) {
        return {
          ok: false,
          error: "Campos inválidos.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        };
      }
      
      return await handler(parsed.data);
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2002') {
          return { ok: false, error: "Registro já existe (duplicado)." };
        }
      }
      return { ok: false, error: error.message || "Ocorreu um erro interno." };
    }
  };
}

export function publicFormAction<TInput, TOutput = undefined>(
  schema: z.ZodType<TInput>,
  parser: (formData: FormData) => TInput | Promise<TInput>,
  handler: (input: TInput) => Promise<ActionResult<TOutput>>
) {
  return async (
    _prev: ActionResult<TOutput> | undefined | null,
    formData: FormData
  ): Promise<ActionResult<TOutput>> => {
    try {
      const input = await parser(formData);
      const parsed = schema.safeParse(input);
      
      if (!parsed.success) {
        return {
          ok: false,
          error: "Verifique os campos.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        };
      }
      
      return await handler(parsed.data);
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2002') {
          return { ok: false, error: "Registro já existe (duplicado)." };
        }
      }
      return { ok: false, error: error.message || "Ocorreu um erro interno." };
    }
  };
}
