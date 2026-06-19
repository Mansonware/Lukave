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
            "group glass-strong !rounded-xl !border-border !text-foreground",
          description: "!text-muted-foreground",
          actionButton: "!bg-nexus-gradient !text-white",
        },
      }}
      {...props}
    />
  );
}
