import { type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-5 animate-float-y">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-2xl bg-nexus-gradient opacity-40 blur-xl"
        />
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-surface-raised text-primary shadow-premium">
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
