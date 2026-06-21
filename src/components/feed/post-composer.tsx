"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaPreview } from "@/components/feed/media-preview";
import { VisibilitySelector, type Visibility } from "@/components/feed/visibility-selector";
import { createPost } from "@/server/actions/posts";
import { uploadImage } from "@/server/actions/upload";
import { cn, getInitials } from "@/lib/utils";
import type { Viewer } from "@/types/post";

const MAX_MEDIA = 4;
const MAX_CHARS = 2000;

export function PostComposer({
  viewer,
  autoFocus = false,
}: {
  viewer: Viewer;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handlePickFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;
      const room = MAX_MEDIA - media.length;
      if (room <= 0) {
        toast.error(`Máximo de ${MAX_MEDIA} imagens.`);
        return;
      }

      setUploading(true);
      for (const file of files.slice(0, room)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadImage("posts", fd);
        if (res.ok) setMedia((prev) => [...prev, res.url]);
        else toast.error(res.error);
      }
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    },
    [media.length],
  );

  const handleRemoveMedia = useCallback((url: string) => {
    setMedia((prev) => prev.filter((u) => u !== url));
  }, []);

  function submit() {
    if (!content.trim() && media.length === 0) {
      toast.error("Escreva algo ou adicione uma imagem.");
      return;
    }
    startTransition(async () => {
      const res = await createPost({
        content,
        mediaUrls: media,
        visibility,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setContent("");
      setMedia([]);
      setVisibility("PUBLIC");
      toast.success("Publicado!");
      router.refresh();
    });
  }

  const remaining = MAX_CHARS - content.length;

  return (
    <div className="border-b border-border px-4 py-4 sm:px-5">
      <div className="flex gap-3">
        <Avatar className="h-11 w-11 nexus-ring">
          {viewer.image && <AvatarImage src={viewer.image} alt={viewer.username} />}
          <AvatarFallback>{getInitials(viewer.name ?? viewer.username)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <Textarea
            autoFocus={autoFocus}
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder="O que está acontecendo?"
            className="min-h-[64px] border-0 bg-transparent px-0 text-lg focus-visible:ring-0"
            aria-label="Conteúdo da publicação"
          />

          <MediaPreview media={media} onRemove={handleRemoveMedia} />

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePickFiles}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || media.length >= MAX_MEDIA}
                className="text-primary"
                aria-label="Adicionar imagem"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" aria-label="Enviando imagem" />
                ) : (
                  <ImagePlus />
                )}
              </Button>

              <VisibilitySelector value={visibility} onChange={setVisibility} />
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-xs tabular-nums",
                  remaining < 0
                    ? "text-destructive"
                    : remaining < 100
                      ? "text-nexus-orange"
                      : "text-muted-foreground",
                )}
                aria-label={`${remaining} caracteres restantes`}
                aria-live="polite"
              >
                {remaining}
              </span>
              <Button
                onClick={submit}
                disabled={pending || uploading || (!content.trim() && media.length === 0)}
                size="sm"
              >
                {pending && <Loader2 className="animate-spin" />}
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
