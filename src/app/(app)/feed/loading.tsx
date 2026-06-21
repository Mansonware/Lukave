import { FeedSkeleton } from "@/components/ui/skeletons";
import { PageHeader } from "@/components/layout/page-header";

export default function FeedLoading() {
  return (
    <div className="flex gap-6">
      <div className="mx-auto w-full max-w-2xl border-x border-border">
        <PageHeader title="Início" description="Seu feed no NEXUS" />
        <FeedSkeleton />
      </div>
    </div>
  );
}
