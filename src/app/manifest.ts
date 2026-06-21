import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Núk — Crie. Conecte. Monetize.",
    short_name: "Núk",
    description:
      "A plataforma tudo-em-um para criadores de conteúdo, comunidades e monetização.",
    start_url: "/feed",
    id: "/?source=pwa",
    display: "standalone",
    orientation: "portrait",
    background_color: "#06070b",
    theme_color: "#9165ff",
    categories: ["social", "entertainment"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
