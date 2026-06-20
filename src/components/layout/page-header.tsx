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
    <div className="sticky top-14 z-20 flex items-center justify-between gap-3 border-b border-border-subtle bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-5 lg:top-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,hsl(258_100%_70%/0.3),transparent)]"
      />
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
