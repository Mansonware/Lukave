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
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[100px]" />
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
