import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * PWA web manifest. Tells Android / Chrome how to install the site to
 * the home screen, what colors to use for the app shell, and which icons
 * to render. The Apple touch icon lives at `/app/apple-icon.tsx`; the
 * 512×512 generic icon lives at `/app/icon.tsx`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Fiber",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#080b15",
    theme_color: "#05070f",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
