"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(debounce.current);
  }, []);

  function onChange(next: string) {
    setValue(next);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const q = next.trim();
      router.replace(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
    }, 350);
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar usuários e conteúdos..."
        className="h-11 pl-10 pr-10"
        autoFocus
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          aria-label="Limpar busca"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
