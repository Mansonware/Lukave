export interface PostAuthor {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  role: string;
}

export interface PostMediaData {
  id: string;
  url: string;
  type: string;
  order: number;
}

export interface PostCardData {
  id: string;
  content: string;
  createdAt: string | Date;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  author: PostAuthor;
  media: PostMediaData[];
  likedByMe: boolean;
  sharedByMe: boolean;
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: string | Date;
  author: PostAuthor;
}

export interface Viewer {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
}
