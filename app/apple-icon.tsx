import { ImageResponse } from "next/og";

import { OgFaviconMark } from "@/components/brand/og-favicon-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const scale = 180 / 32;

export default function AppleIcon() {
  return new ImageResponse(<OgFaviconMark scale={scale} />, { ...size });
}
