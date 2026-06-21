import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div aria-label="Carregando feed" role="status">
      <span className="sr-only">Carregando publicações…</span>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-b border-border px-4 py-4 sm:px-5">
          <div className="flex gap-3">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-48 w-full rounded-2xl" />
              <div className="flex gap-4 pt-1">
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div aria-label="Carregando notificações" role="status">
      <span className="sr-only">Carregando notificações…</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5"
        >
          <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div aria-label="Carregando mensagens" role="status">
      <span className="sr-only">Carregando conversas…</span>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border p-4"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div aria-label="Carregando perfil" role="status">
      <span className="sr-only">Carregando perfil…</span>
      <Skeleton className="h-40 w-full sm:h-52" />
      <div className="px-4 pb-4 sm:px-5">
        <div className="flex items-end justify-between">
          <Skeleton className="-mt-12 h-24 w-24 rounded-full sm:h-28 sm:w-28" />
          <Skeleton className="mt-3 h-9 w-28 rounded-lg" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-14 w-full" />
        </div>
        <div className="mt-4 flex gap-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SuggestedUsersSkeleton() {
  return (
    <div className="glass rounded-2xl p-4" aria-label="Carregando sugestões" role="status">
      <Skeleton className="mb-3 h-4 w-24" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
