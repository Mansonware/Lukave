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
    <div className="flex items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-5 lg:sticky lg:top-16 lg:z-20 lg:border-border">
      <div>
        <h1 className="font-display text-lg font-bold">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
