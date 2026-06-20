import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXUS — Crie. Conecte. Monetize.",
    short_name: "NEXUS",
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
    screenshots: [
      {
        src: "/screenshots/screenshot-1.png",
        sizes: "1080x2400",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/screenshot-2.png",
        sizes: "1080x2400",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
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
