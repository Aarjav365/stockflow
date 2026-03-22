/** Open Graph / Twitter preview image — must be an absolute URL reachable by crawlers. */
export const OG_PREVIEW_IMAGE_URL =
  "https://raw.githubusercontent.com/Aarjav365/stockflow/refs/heads/main/public/hero.png";

/** Canonical origin for metadata (Open Graph, canonical URLs). No trailing slash. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "http://localhost:3000";
}
