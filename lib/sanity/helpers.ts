import type { BlogLang, LocalizedBlockContent, LocalizedString } from "./types";

const FALLBACK_ORDER: BlogLang[] = ["en", "ru", "ka"];

/** Pick a localized string for the active language, falling back to other locales. */
export function pickLocalized(
  value: LocalizedString | undefined | null,
  lang: BlogLang
): string {
  if (!value) return "";
  if (value[lang]?.trim()) return value[lang]!.trim();
  for (const fallback of FALLBACK_ORDER) {
    if (fallback !== lang && value[fallback]?.trim()) {
      return value[fallback]!.trim();
    }
  }
  return "";
}

/** Pick localized Portable Text body for the active language. */
export function pickLocalizedBody(
  value: LocalizedBlockContent | undefined | null,
  lang: BlogLang
) {
  if (!value) return [];
  if (value[lang]?.length) return value[lang]!;
  for (const fallback of FALLBACK_ORDER) {
    if (fallback !== lang && value[fallback]?.length) {
      return value[fallback]!;
    }
  }
  return [];
}

export function formatPublishDate(date: string, lang: BlogLang): string {
  const localeMap: Record<BlogLang, string> = {
    en: "en-US",
    ru: "ru-RU",
    ka: "ka-GE",
  };

  try {
    return new Intl.DateTimeFormat(localeMap[lang], {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export const SITE_URL = "https://www.adamiani.ai";

export function blogPostUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

export function isValidBlogLang(value: string): value is BlogLang {
  return value === "en" || value === "ru" || value === "ka";
}

/** Extract a YouTube video ID from common URL formats. */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
