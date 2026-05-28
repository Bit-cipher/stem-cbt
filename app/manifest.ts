import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "STEM CBT",
    short_name: "STEM CBT",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0284c7",
    icons: [{ src: "/icon.svg", sizes: "192x192", type: "image/svg+xml" }],
  };
}
