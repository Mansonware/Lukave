import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { getFeedPosts } from "@/server/queries";
import { PostComposer } from "@/components/feed/post-composer";
import { InfiniteFeed } from "@/components/feed/infinite-feed";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { SuggestedUsers } from "@/components/profile/suggested-users";
import type { Viewer } from "@/types/post";

export const metadata: Metadata = { title: "Início" };

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ compose?: string }>;
}) {
  const user = await requireUser();
  const { compose } = await searchParams;

  const viewer: Viewer = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
  };

  const posts = await getFeedPosts({ viewerId: user.id, take: 30 });

  return (
    <div className="flex min-w-0 gap-6">
      {/* Feed principal — edge-to-edge no mobile, card arredondado em sm+ */}
      <div className="mx-auto w-full max-w-2xl min-w-0 glass-panel border-x-0 sm:border-x border-t-0 sm:border-t rounded-none sm:rounded-3xl sm:my-4 overflow-hidden">
        <PageHeader title="Início" description="Seu feed no Núk" />
        <PostComposer viewer={viewer} autoFocus={compose === "1"} />

        {posts.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Seu feed está vazio"
            description="Faça sua primeira publicação ou siga criadores para ver conteúdo aqui."
          />
        ) : (
          <InfiniteFeed initialPosts={posts} viewer={viewer} />
        )}
      </div>

      {/* Right rail (desktop) */}
      <aside className="hidden w-80 shrink-0 py-4 xl:block">
        <div className="sticky top-20 space-y-4">
          <Suspense fallback={null}>
            <SuggestedUsers viewerId={user.id} />
          </Suspense>
        </div>
      </aside>
    </div>
  );
}
