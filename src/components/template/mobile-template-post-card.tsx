import { Heart, MessageCircle, Play, Share2 } from "lucide-react";

import type { TemplatePost } from "@/mocks/mobile-template";

export function MobileTemplatePostCard({
  post,
}: {
  post: TemplatePost;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
      <div className={`relative h-72 bg-gradient-to-br ${post.mediaClass}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_38%),linear-gradient(180deg,transparent_32%,rgba(6,7,11,0.85)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {post.tag}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs text-white backdrop-blur">
          <Play className="h-3.5 w-3.5 fill-current" />
          00:24
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${post.author.accentClass} text-sm font-semibold text-white`}
          >
            {post.author.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-semibold text-foreground">
                {post.author.name}
              </h2>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {post.author.role}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              @{post.author.username} · {post.timeAgo}
            </p>
          </div>
        </div>

        <p className="text-sm leading-6 text-foreground/85">{post.caption}</p>

        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground" role="group" aria-label="Estatísticas da publicação">
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5" aria-label={`${post.stats.likes} curtidas`}>
            <Heart className="h-4 w-4" aria-hidden="true" />
            {post.stats.likes}
          </div>
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5" aria-label={`${post.stats.comments} comentários`}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {post.stats.comments}
          </div>
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5" aria-label={`${post.stats.shares} compartilhamentos`}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {post.stats.shares}
          </div>
        </div>
      </div>
    </article>
  );
}
