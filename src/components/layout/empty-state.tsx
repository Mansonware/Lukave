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
    <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-3xl mx-4 my-8">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-nuk-gradient text-white shadow-lg shadow-primary/20">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-base text-muted-foreground leading-relaxed">{description}</p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
