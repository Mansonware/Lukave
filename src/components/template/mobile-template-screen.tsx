import { Compass, Home, PlusSquare, User2, Video } from "lucide-react";

import {
  templatePosts,
  templateStories,
} from "@/mocks/mobile-template";
import { MobileTemplateHeader } from "@/components/template/mobile-template-header";
import { MobileTemplatePostCard } from "@/components/template/mobile-template-post-card";

const bottomTabs = [
  { label: "Home", icon: Home, active: true },
  { label: "Explore", icon: Compass, active: false },
  { label: "Create", icon: PlusSquare, active: false },
  { label: "Reels", icon: Video, active: false },
  { label: "Profile", icon: User2, active: false },
];

export function MobileTemplateScreen() {
  return (
    <div className="glass-strong mx-auto flex w-full max-w-[390px] flex-col overflow-hidden rounded-[34px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <MobileTemplateHeader />

      <div className="space-y-5 px-5 py-5">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Stories</h2>
              <p className="text-sm text-muted-foreground">
                Lives, drops e creators em destaque
              </p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              24 new
            </span>
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {templateStories.map((story) => (
              <div
                key={story.id}
                className="min-w-[88px] rounded-[24px] border border-white/10 bg-white/[0.03] p-2"
              >
                <div
                  className={`flex h-24 items-end rounded-[18px] bg-gradient-to-br p-3 ${story.accentClass}`}
                >
                  <span className="rounded-full bg-black/20 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                    {story.title}
                  </span>
                </div>
                <p className="mt-2 truncate text-sm font-medium">{story.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {templatePosts.map((post) => (
            <MobileTemplatePostCard key={post.id} post={post} />
          ))}
        </section>
      </div>

      <nav className="mt-auto flex items-center justify-between border-t border-white/10 bg-background/90 px-4 py-3">
        {bottomTabs.map((tab) => (
          <button
            key={tab.label}
            className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition-colors ${
              tab.active ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
