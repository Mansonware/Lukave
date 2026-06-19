import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { Logo } from "@/components/brand/logo";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const unreadCount = await prisma.notification.count({
    where: { recipientId: user.id, read: false },
  });

  const safeUser = {
    name: user.name,
    username: user.username,
    image: user.image,
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl">
      <Sidebar unreadCount={unreadCount} />

      <div className="flex min-h-dvh w-full flex-col">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <Logo />
          <UserMenu user={safeUser} />
        </header>

        {/* Top bar (desktop) */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-end gap-3 border-b border-border bg-background/70 px-6 backdrop-blur-xl lg:flex">
          <UserMenu user={safeUser} />
        </header>

        <main className="flex-1 pb-24 lg:pb-10">{children}</main>
      </div>

      <MobileNav unreadCount={unreadCount} />
    </div>
  );
}
