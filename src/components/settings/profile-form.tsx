"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Camera, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/server/actions/profile";
import type { ActionResult } from "@/server/action-result";
import { uploadImage } from "@/server/actions/upload";
import { getInitials } from "@/lib/utils";

interface ProfileFormProps {
  user: {
    name: string | null;
    username: string;
    bio: string | null;
    location: string | null;
    websiteUrl: string | null;
    image: string | null;
    bannerUrl: string | null;
    social: {
      twitter?: string;
      instagram?: string;
      youtube?: string;
      tiktok?: string;
      github?: string;
    };
  };
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Salvar alterações
    </Button>
  );
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(user.image ?? "");
  const [banner, setBanner] = useState(user.bannerUrl ?? "");
  const [uploading, setUploading] = useState<"image" | "banner" | null>(null);

  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    updateProfile,
    undefined,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Perfil atualizado!");
      router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  async function upload(kind: "avatars" | "banners", file: File) {
    setUploading(kind === "avatars" ? "image" : "banner");
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(kind, fd);
    setUploading(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    if (kind === "avatars") setImage(res.url);
    else setBanner(res.url);
    toast.success("Imagem enviada. Não esqueça de salvar.");
  }

  const fe = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="bannerUrl" value={banner} />

      {/* Banner + avatar */}
      <div>
        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/30 to-accent/20">
          {banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={banner} alt="Banner" className="h-full w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => bannerRef.current?.click()}
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Alterar banner"
          >
            {uploading === "banner" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
          </button>
          <input
            ref={bannerRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && upload("banners", e.target.files[0])}
          />
        </div>

        <div className="-mt-10 ml-4 inline-block">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-background">
              {image && <AvatarImage src={image} alt={user.username} />}
              <AvatarFallback className="text-xl">
                {getInitials(user.name ?? user.username)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-full bg-nexus-gradient text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Alterar foto"
            >
              {uploading === "image" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                e.target.files?.[0] && upload("avatars", e.target.files[0])
              }
            />
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" defaultValue={user.name ?? ""} required />
          {fe?.name && <p className="text-xs text-destructive">{fe.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={user.username}
            required
          />
          {fe?.username && (
            <p className="text-xs text-destructive">{fe.username[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio ?? ""}
          maxLength={280}
          placeholder="Conte um pouco sobre você"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            name="location"
            defaultValue={user.location ?? ""}
            placeholder="Cidade, País"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={user.websiteUrl ?? ""}
            placeholder="https://seusite.com"
          />
          {fe?.websiteUrl && (
            <p className="text-xs text-destructive">{fe.websiteUrl[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Redes sociais</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["twitter", "instagram", "youtube", "tiktok", "github"] as const).map(
            (key) => (
              <Input
                key={key}
                name={key}
                defaultValue={user.social[key] ?? ""}
                placeholder={`${key} (usuário ou URL)`}
              />
            ),
          )}
        </div>
      </div>

      <SaveButton />
    </form>
  );
}
