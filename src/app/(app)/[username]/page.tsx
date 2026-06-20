import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarDays,
  LinkIcon,
  MapPin,
  Settings,
  FileText,
} from "lucide-react";

import { requireUser } from "@/lib/session";
import { getProfileByUsername, getFeedPosts } from "@/server/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/profile/follow-button";
import { StartConversationButton } from "@/components/profile/start-conversation-button";
import { PostCard } from "@/components/feed/post-card";
import { EmptyState } from "@/components/layout/empty-state";
import {
  formatCompactNumber,
  getInitials,
} from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Viewer } from "@/types/post";

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  github?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await requireUser();
  const profile = await getProfileByUsername(username, user.id);
  if (!profile) notFound();

  const viewer: Viewer = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
  };

  const posts = await getFeedPosts({
    viewerId: user.id,
    authorId: profile.id,
    take: 30,
  });

  const social = (profile.socialLinks ?? {}) as SocialLinks;
  const socialEntries = Object.entries(social).filter(([, v]) => v);

  return (
    <div className="mx-auto w-full max-w-2xl border-x border-border">
      {/* Banner */}
      <div className="relative h-40 w-full bg-gradient-to-br from-primary/30 to-accent/20 sm:h-52">
        {profile.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.bannerUrl}
            alt="Banner"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Cabeçalho */}
      <div className="px-4 pb-4 sm:px-5">
        <div className="flex items-end justify-between">
          <Avatar className="-mt-12 h-24 w-24 border-4 border-background sm:h-28 sm:w-28">
            {profile.image && (
              <AvatarImage src={profile.image} alt={profile.username} />
            )}
            <AvatarFallback className="text-2xl">
              {getInitials(profile.name ?? profile.username)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-3">
            {profile.isMe ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/settings">
                  <Settings className="h-4 w-4" /> Editar perfil
                </Link>
              </Button>
            ) : (
              <div className="flex items-center">
                <FollowButton
                  targetUserId={profile.id}
                  initialFollowing={profile.isFollowing}
                />
                <StartConversationButton targetUserId={profile.id} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold">
              {profile.name ?? profile.username}
            </h1>
            {profile.role === "CREATOR" && <Badge>Criador</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
            {profile.bio}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
          )}
          {profile.websiteUrl && (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <LinkIcon className="h-4 w-4" />
              {profile.websiteUrl.replace(/^https?:\/\//, "")}
            </a>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Entrou em{" "}
            {format(new Date(profile.createdAt), "MMM yyyy", { locale: ptBR })}
          </span>
        </div>

        {socialEntries.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {socialEntries.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="capitalize">
                {key}: {value}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-5 text-sm">
          <span>
            <strong className="text-foreground">
              {formatCompactNumber(profile.followingCount)}
            </strong>{" "}
            <span className="text-muted-foreground">seguindo</span>
          </span>
          <span>
            <strong className="text-foreground">
              {formatCompactNumber(profile.followersCount)}
            </strong>{" "}
            <span className="text-muted-foreground">seguidores</span>
          </span>
          <span>
            <strong className="text-foreground">
              {formatCompactNumber(profile.postsCount)}
            </strong>{" "}
            <span className="text-muted-foreground">publicações</span>
          </span>
        </div>
      </div>

      {/* Publicações */}
      <div className="border-t border-border">
        {posts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma publicação ainda"
            description={
              profile.isMe
                ? "Compartilhe sua primeira publicação no feed."
                : "Quando publicar, o conteúdo aparecerá aqui."
            }
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              viewer={viewer}
              post={{
                id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                likesCount: post.likesCount,
                commentsCount: post.commentsCount,
                sharesCount: post.sharesCount,
                author: post.author,
                media: post.media,
                likedByMe: post.likedByMe,
                sharedByMe: post.sharedByMe,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
