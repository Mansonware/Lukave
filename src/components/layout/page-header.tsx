export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="sticky top-[calc(3.5rem_+_env(safe-area-inset-top))] z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-background/50 px-5 py-4 backdrop-blur-2xl lg:top-16">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
