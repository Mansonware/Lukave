import { Bell, Search } from "lucide-react";

export function MobileTemplateHeader() {
  return (
    <header className="border-b border-white/10 px-5 pb-4 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            nuk-plataforma
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold">
            Discover
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition-colors hover:bg-white/10">
            <Search className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition-colors hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 text-sm">
        <span className="rounded-full bg-white px-4 py-2 font-medium text-slate-950">
          For you
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-muted-foreground">
          Following
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-muted-foreground">
          Live
        </span>
      </div>
    </header>
  );
}
