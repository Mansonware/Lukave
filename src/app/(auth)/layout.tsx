import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user) redirect("/feed");

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="absolute inset-0 -z-10 ambient-bg" />
      <header className="absolute left-0 top-0 w-full">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Voltar ao início
          </Link>
        </div>
      </header>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
