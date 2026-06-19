import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getFeedPosts } from "@/server/queries";

const DEFAULT_TAKE = 15;
const MAX_TAKE = 30;

export async function GET(request: Request) {
  const session = await auth();
  const viewerId = session?.user?.id;

  if (!viewerId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const takeParam = Number(searchParams.get("take"));
  const take = Number.isFinite(takeParam)
    ? Math.min(Math.max(Math.trunc(takeParam), 1), MAX_TAKE)
    : DEFAULT_TAKE;

  const posts = await getFeedPosts({ viewerId, cursor, take });
  const nextCursor = posts[posts.length - 1]?.nextCursor ?? null;

  return NextResponse.json({
    posts,
    nextCursor,
  });
}
