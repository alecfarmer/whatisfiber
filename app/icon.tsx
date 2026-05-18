import { ImageResponse } from "next/og";

/**
 * 512×512 PWA/Android icon — referenced from the manifest and used by
 * Schema.org logo objects in the Organization JSON-LD.
 */

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 280,
          fontWeight: 600,
          letterSpacing: -10,
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
