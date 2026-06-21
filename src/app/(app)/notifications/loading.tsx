import { NotificationsSkeleton } from "@/components/ui/skeletons";
import { PageHeader } from "@/components/layout/page-header";

export default function NotificationsLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl border-x border-border">
      <PageHeader title="Notificações" />
      <NotificationsSkeleton />
    </div>
  );
}
