import { ImageResponse } from "next/og";

/**
 * 180×180 Apple touch icon. iOS adds this to the home screen when a user
 * "Add to Home Screen"s the site. Next renders it at build time from this
 * file (App Router convention) — no static asset to maintain.
 */

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 30% 28%, #6edcff 0%, #02040a 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 92,
          fontWeight: 600,
          letterSpacing: -3,
          color: "#02040a",
          fontFamily: "serif",
        }}
      >
        W
      </div>
    ),
    { ...size },
  );
}
