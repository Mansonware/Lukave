export interface TemplateStory {
  id: string;
  title: string;
  label: string;
  accentClass: string;
}

export interface TemplatePostAuthor {
  name: string;
  username: string;
  role: string;
  accentClass: string;
}

export interface TemplatePost {
  id: string;
  author: TemplatePostAuthor;
  timeAgo: string;
  caption: string;
  tag: string;
  stats: {
    likes: string;
    comments: string;
    shares: string;
  };
  mediaClass: string;
}

export const templateStories: TemplateStory[] = [
  {
    id: "1",
    title: "Live agora",
    label: "@nuklive",
    accentClass: "from-fuchsia-500 to-violet-500",
  },
  {
    id: "2",
    title: "Trends",
    label: "@beatlab",
    accentClass: "from-cyan-500 to-blue-500",
  },
  {
    id: "3",
    title: "Drops",
    label: "@creatorhub",
    accentClass: "from-emerald-500 to-teal-500",
  },
  {
    id: "4",
    title: "Studio",
    label: "@visualflow",
    accentClass: "from-orange-500 to-pink-500",
  },
];

export const templatePosts: TemplatePost[] = [
  {
    id: "post-1",
    author: {
      name: "Ayla Costa",
      username: "ayla.mov",
      role: "Creator",
      accentClass: "from-fuchsia-500 to-violet-500",
    },
    timeAgo: "2 min",
    caption:
      "Novo drop visual para creators: feed vertical, CTA fixo e cards premium para destacar lançamentos e comunidade.",
    tag: "Trending now",
    stats: {
      likes: "12.4k",
      comments: "328",
      shares: "1.2k",
    },
    mediaClass:
      "from-fuchsia-500/90 via-violet-500/80 to-sky-500/80",
  },
  {
    id: "post-2",
    author: {
      name: "Noah Martins",
      username: "noahcuts",
      role: "Community",
      accentClass: "from-cyan-500 to-blue-500",
    },
    timeAgo: "18 min",
    caption:
      "Uma experiência social para mobile precisa de descoberta, prova social e botões claros. Esse layout junta tudo em uma única tela.",
    tag: "For creators",
    stats: {
      likes: "8.9k",
      comments: "211",
      shares: "670",
    },
    mediaClass:
      "from-slate-900 via-cyan-500/70 to-emerald-500/70",
  },
];
