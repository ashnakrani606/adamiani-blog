import type { BlogLang, BlogPost } from "@/lib/sanity";
import { pickLocalized, SITE_URL, urlForImage } from "@/lib/sanity";

export const BLOG_LANGUAGES = ["en", "ru", "ka"] as const satisfies readonly BlogLang[];

const OPEN_GRAPH_LOCALES: Record<BlogLang, string> = {
  en: "en_US",
  ru: "ru_RU",
  ka: "ka_GE",
};

export function getBlogLanguage(value: string | undefined): BlogLang {
  return BLOG_LANGUAGES.includes(value as BlogLang) ? (value as BlogLang) : "en";
}

export function blogLanguageUrl(pathname: string, language: BlogLang): string {
  const url = new URL(pathname, SITE_URL);
  url.searchParams.set("lang", language);
  return url.toString();
}

export function blogLanguagePath(pathname: string, language: BlogLang): string {
  const url = new URL(blogLanguageUrl(pathname, language));
  return `${url.pathname}${url.search}`;
}

export function getBlogPostSeo(post: BlogPost, language: BlogLang) {
  const title = pickLocalized(post.seoTitle, language) || pickLocalized(post.title, language);
  const description =
    pickLocalized(post.seoDescription, language) || pickLocalized(post.excerpt, language);
  const url = blogLanguageUrl(`/blog/${post.slug}`, language);
  const image = post.featuredImage?.asset
    ? urlForImage(post.featuredImage).width(1200).height(630).url()
    : undefined;
  const imageAlt = pickLocalized(post.featuredImage?.alt, language) || title;

  return {
    title,
    description,
    url,
    image,
    imageAlt,
    locale: OPEN_GRAPH_LOCALES[language],
    alternateLocales: BLOG_LANGUAGES.filter((locale) => locale !== language).map(
      (locale) => OPEN_GRAPH_LOCALES[locale]
    ),
    languages: Object.fromEntries(
      BLOG_LANGUAGES.map((locale) => [
        locale,
        blogLanguageUrl(`/blog/${post.slug}`, locale),
      ])
    ),
  };
}
