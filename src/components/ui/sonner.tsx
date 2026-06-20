"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group glass-strong !rounded-xl !border-white/10 !text-foreground !shadow-premium-xl",
          title: "!font-semibold",
          description: "!text-muted-foreground",
          actionButton: "!bg-nexus-gradient !text-white !rounded-lg",
          success: "!text-nexus-green",
          error: "!text-destructive",
          icon: "!text-primary",
        },
      }}
      {...props}
    />
  );
}
