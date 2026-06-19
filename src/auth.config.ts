import type { NextAuthConfig } from "next-auth";

/**
 * Configuração compartilhada e segura para o Edge Runtime (usada no middleware).
 * NÃO importa Prisma nem bcrypt aqui — apenas o que roda no edge.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // preenchido em src/auth.ts (runtime Node)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/feed",
        "/explore",
        "/notifications",
        "/settings",
        "/messages",
        "/bookmarks",
        "/compose",
      ];
      const isProtected = protectedPaths.some((p) =>
        nextUrl.pathname.startsWith(p),
      );

      if (isProtected && !isLoggedIn) return false;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
