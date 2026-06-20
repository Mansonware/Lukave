import { describe, it, expect } from "vitest";
import {
  usernameSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createPostSchema,
  createCommentSchema,
} from "@/lib/validations";

describe("usernameSchema", () => {
  it("aceita usernames válidos", () => {
    expect(usernameSchema.safeParse("user_123").success).toBe(true);
    expect(usernameSchema.safeParse("abc").success).toBe(true);
    expect(usernameSchema.safeParse("a".repeat(20)).success).toBe(true);
  });

  it("rejeita username curto", () => {
    const r = usernameSchema.safeParse("ab");
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toMatch(/3/);
  });

  it("rejeita username longo", () => {
    expect(usernameSchema.safeParse("a".repeat(21)).success).toBe(false);
  });

  it("rejeita letras maiúsculas", () => {
    expect(usernameSchema.safeParse("UserName").success).toBe(false);
  });

  it("rejeita hífen e espaço", () => {
    expect(usernameSchema.safeParse("user-name").success).toBe(false);
    expect(usernameSchema.safeParse("user name").success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "João Silva",
    username: "joaosilva",
    email: "joao@exemplo.com",
    password: "senha123",
  };

  it("aceita dados válidos", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    expect(registerSchema.safeParse({ ...valid, email: "nao-email" }).success).toBe(false);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(registerSchema.safeParse({ ...valid, password: "1234567" }).success).toBe(false);
  });

  it("rejeita senha com mais de 72 caracteres", () => {
    expect(registerSchema.safeParse({ ...valid, password: "a".repeat(73) }).success).toBe(false);
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    expect(registerSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("aceita credenciais válidas", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "qualquer" }).success).toBe(true);
  });

  it("rejeita e-mail malformado", () => {
    expect(loginSchema.safeParse({ email: "invalido", password: "x" }).success).toBe(false);
  });

  it("rejeita senha vazia", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("aceita e-mail válido", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    expect(forgotPasswordSchema.safeParse({ email: "invalido" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("aceita token e senha válidos", () => {
    expect(resetPasswordSchema.safeParse({ token: "abc123", password: "novaSenha1" }).success).toBe(true);
  });

  it("rejeita token vazio", () => {
    expect(resetPasswordSchema.safeParse({ token: "", password: "novaSenha1" }).success).toBe(false);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(resetPasswordSchema.safeParse({ token: "tok", password: "curta" }).success).toBe(false);
  });

  it("rejeita senha com mais de 72 caracteres", () => {
    expect(resetPasswordSchema.safeParse({ token: "tok", password: "a".repeat(73) }).success).toBe(false);
  });
});

describe("createPostSchema", () => {
  it("aceita publicação válida", () => {
    expect(createPostSchema.safeParse({ content: "Olá mundo!" }).success).toBe(true);
  });

  it("aplica defaults: mediaUrls vazio e visibility PUBLIC", () => {
    const result = createPostSchema.parse({ content: "teste" });
    expect(result.mediaUrls).toEqual([]);
    expect(result.visibility).toBe("PUBLIC");
  });

  it("rejeita conteúdo acima de 2000 caracteres", () => {
    expect(createPostSchema.safeParse({ content: "a".repeat(2001) }).success).toBe(false);
  });

  it("rejeita mais de 4 imagens", () => {
    const urls = Array.from({ length: 5 }, (_, i) => `https://img.com/${i}.png`);
    expect(createPostSchema.safeParse({ content: "", mediaUrls: urls }).success).toBe(false);
  });

  it("rejeita visibility desconhecida", () => {
    expect(createPostSchema.safeParse({ content: "x", visibility: "INVALIDO" }).success).toBe(false);
  });

  it("aceita visibility FOLLOWERS e PRIVATE", () => {
    expect(createPostSchema.safeParse({ content: "x", visibility: "FOLLOWERS" }).success).toBe(true);
    expect(createPostSchema.safeParse({ content: "x", visibility: "PRIVATE" }).success).toBe(true);
  });
});

describe("createCommentSchema", () => {
  it("aceita comentário válido", () => {
    expect(createCommentSchema.safeParse({ postId: "id123", content: "Bom post!" }).success).toBe(true);
  });

  it("rejeita comentário vazio", () => {
    expect(createCommentSchema.safeParse({ postId: "id123", content: "" }).success).toBe(false);
  });

  it("rejeita comentário acima de 500 caracteres", () => {
    expect(createCommentSchema.safeParse({ postId: "id", content: "a".repeat(501) }).success).toBe(false);
  });

  it("rejeita postId vazio", () => {
    expect(createCommentSchema.safeParse({ postId: "", content: "ok" }).success).toBe(false);
  });
});
