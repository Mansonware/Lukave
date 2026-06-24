import Link from "next/link";
import { Search as SearchIcon, Users, FileText } from "lucide-react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { searchAll, getSuggestedUsers } from "@/server/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/search/search-bar";
import { PostCard } from "@/components/feed/post-card";
import { FollowButton } from "@/components/profile/follow-button";
import { EmptyState } from "@/components/layout/empty-state";
import { formatCompactNumber, getInitials } from "@/lib/utils";
import type { Viewer } from "@/types/post";

export const metadata: Metadata = { title: "Buscar" };

function UserRow({
  u,
  showFollow,
}: {
  u: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    bio?: string | null;
    followersCount: number;
    role: string;
  };
  showFollow: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.015] sm:px-5">
      <Link href={`/${u.username}`} className="shrink-0">
        <Avatar className="h-11 w-11 nuk-ring">
          {u.image && <AvatarImage src={u.image} alt={u.username} />}
          <AvatarFallback>{getInitials(u.name ?? u.username)}</AvatarFallback>
        </Avatar>
      </Link>
      <Link href={`/${u.username}`} className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold hover:underline">
            {u.name ?? u.username}
          </span>
          {u.role === "CREATOR" && (
            <Badge className="px-1.5 py-0 text-[10px]">Criador</Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          @{u.username} · {formatCompactNumber(u.followersCount)} seguidores
        </p>
        {u.bio && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{u.bio}</p>
        )}
      </Link>
      {showFollow && <FollowButton targetUserId={u.id} initialFollowing={false} />}
    </div>
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await requireUser();
  const query = (q ?? "").trim();

  const viewer: Viewer = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
  };

  const results = query ? await searchAll(query, user.id) : null;
  const suggested = query ? [] : await getSuggestedUsers(user.id, 8);

  return (
    <div className="mx-auto w-full max-w-2xl glass-panel lg:my-6 lg:rounded-3xl overflow-hidden">
      <div className="sticky top-14 z-20 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-5 lg:top-16">
        <SearchBar initialQuery={query} />
      </div>

      {!query ? (
        <div>
          <h2 className="px-4 pt-4 font-display text-sm font-semibold sm:px-5">
            Sugestões para você
          </h2>
          {suggested.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="Busque no Núk"
              description="Encontre criadores e conteúdos por nome, username ou texto."
            />
          ) : (
            suggested
              .filter((u) => u.id !== user.id)
              .map((u) => (
                <UserRow
                  key={u.id}
                  u={{ ...u, bio: null }}
                  showFollow
                />
              ))
          )}
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-3 sm:px-5">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                Tudo
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1">
                <Users className="mr-1 h-4 w-4" /> Usuários
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex-1">
                <FileText className="mr-1 h-4 w-4" /> Conteúdos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-3">
            {results!.users.length === 0 && results!.posts.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="Nenhum resultado"
                description={`Nada encontrado para "${query}".`}
              />
            ) : (
              <>
                {results!.users.slice(0, 3).map((u) => (
                  <UserRow
                    key={u.id}
                    u={u}
                    showFollow={u.id !== user.id}
                  />
                ))}
                {results!.posts.map((post) => (
                  <PostCard key={post.id} viewer={viewer} post={post} />
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-3">
            {results!.users.length === 0 ? (
              <EmptyState icon={Users} title="Nenhum usuário encontrado" />
            ) : (
              results!.users.map((u) => (
                <UserRow key={u.id} u={u} showFollow={u.id !== user.id} />
              ))
            )}
          </TabsContent>

          <TabsContent value="posts" className="mt-3">
            {results!.posts.length === 0 ? (
              <EmptyState icon={FileText} title="Nenhum conteúdo encontrado" />
            ) : (
              results!.posts.map((post) => (
                <PostCard key={post.id} viewer={viewer} post={post} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
