import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Retorna a sessão atual (ou null). Memoizado por request. */
export const getSession = cache(async () => auth());

/** Retorna o usuário do banco para a sessão atual, ou null. */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
});

/** Garante que há um usuário autenticado; caso contrário redireciona p/ login. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
