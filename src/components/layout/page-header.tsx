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
    <div className="sticky top-14 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-5 lg:top-16">
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
