import { ConversationListSkeleton } from "@/components/ui/skeletons";
import { PageHeader } from "@/components/layout/page-header";

export default function MessagesLoading() {
  return (
    <div className="flex gap-6">
      <div className="mx-auto w-full max-w-2xl border-x border-border min-h-screen bg-background">
        <PageHeader title="Mensagens" description="Suas conversas no NEXUS" />
        <ConversationListSkeleton />
      </div>
    </div>
  );
}
