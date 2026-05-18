import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Dynamic Open Graph image for every page. Next renders this at build
 * time per route (per Next.js convention), so the homepage and any nested
 * route that adds its own `opengraph-image.tsx` gets a branded card with
 * no external image hosting.
 */

export const runtime = "edge";
export const alt = "What Is Fiber — honest fiber internet, decoded.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #02040a 0%, #080b15 55%, #0d1220 100%)",
          color: "#ecf1fa",
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 4,
            color: "#9ce7ff",
          }}
        >
          {site.name.toUpperCase()}
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 96,
            lineHeight: 1.02,
            fontWeight: 500,
            letterSpacing: -2,
            maxWidth: 1040,
          }}
        >
          Honest fiber internet, decoded.
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#a3b1ca",
            maxWidth: 980,
          }}
        >
          A 60-second decision quiz, end-to-end explainers, and a real provider
          finder powered by live FCC data.
        </div>

        {/* Footer rail */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 80,
            bottom: 56,
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            color: "#94a4c0",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#9ce7ff",
            }}
          />
          <span>whatisfiber.com</span>
          <span style={{ color: "#3f4866" }}>·</span>
          <span>FCC · ITU-T · Ookla · OpenVault</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
