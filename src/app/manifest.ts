import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXUS — Crie. Conecte. Monetize.",
    short_name: "NEXUS",
    description:
      "A plataforma tudo-em-um para criadores de conteúdo, comunidades e monetização.",
    start_url: "/",
    display: "standalone",
    background_color: "#06070b",
    theme_color: "#9165ff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
