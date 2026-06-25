import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { UserMenu } from "@/components/layout/user-menu";

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
    <div className="relative mx-auto flex w-full max-w-7xl">
      {/* Background ambiente premium para envolver todas as rotas internas */}
      <div className="fixed inset-0 -z-10 ambient-bg pointer-events-none" />

      <Sidebar unreadCount={unreadCount} />

      <div className="flex min-h-dvh w-full min-w-0 flex-col">
        {/* Header mobile compacto com marca + progressão mockada */}
        <MobileHeader user={safeUser} />

        {/* Top bar (desktop) */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-end gap-3 border-b border-white/5 bg-background/50 px-8 backdrop-blur-2xl lg:flex">
          <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 border border-white/5 shadow-inner">
            <span className="text-sm font-bold text-yellow-400">🪙 120</span>
            <span className="text-xs font-semibold text-muted-foreground">Nook Coins</span>
          </div>
          <UserMenu user={safeUser} />
        </header>

        {/* pb inclui safe-area-inset-bottom para não vazar atrás da bottom nav */}
        <main className="flex-1 pb-[calc(5rem_+_env(safe-area-inset-bottom))] lg:pb-10 pt-4 lg:pt-8 px-0 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <MobileNav unreadCount={unreadCount} username={safeUser.username} />
    </div>
  );
}
