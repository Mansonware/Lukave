import { describe, it, expect, expectTypeOf } from "vitest";
import type { ActionResult } from "@/server/action-result";

describe("ActionResult", () => {
  it("ok:true sem data", () => {
    const result: ActionResult = { ok: true };
    expect(result.ok).toBe(true);
  });

  it("ok:true com data tipada", () => {
    const result: ActionResult<{ id: string }> = { ok: true, data: { id: "abc-123" } };
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data?.id).toBe("abc-123");
    }
  });

  it("ok:false com mensagem de erro", () => {
    const result: ActionResult = { ok: false, error: "Operação inválida." };
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Operação inválida.");
    }
  });

  it("ok:false com fieldErrors", () => {
    const result: ActionResult = {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: { email: ["E-mail já cadastrado"], username: ["Já em uso"] },
    };
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors?.email).toEqual(["E-mail já cadastrado"]);
      expect(result.fieldErrors?.username).toEqual(["Já em uso"]);
    }
  });

  it("discriminação em tempo de execução: ok=true acessa data, ok=false acessa error", () => {
    function process(r: ActionResult<number>): string {
      return r.ok ? `valor: ${r.data}` : `erro: ${r.error}`;
    }
    expect(process({ ok: true, data: 42 })).toBe("valor: 42");
    expect(process({ ok: false, error: "falhou" })).toBe("erro: falhou");
  });

  it("tipagem: ActionResult<string> é compatível com a união esperada", () => {
    expectTypeOf<ActionResult<string>>().toMatchTypeOf<
      { ok: true; data?: string } | { ok: false; error: string }
    >();
  });
});
