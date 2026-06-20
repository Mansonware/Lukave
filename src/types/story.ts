export type StoryMediaType = "IMAGE" | "VIDEO";

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: StoryMediaType;
  createdAt: Date;
  expiresAt: Date;
}

export interface StoryAuthor {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
}

export interface StoryGroup {
  author: StoryAuthor;
  stories: StoryItem[];
  latestCreatedAt: Date;
  isOwn: boolean;
}
