"use client";

import { useEffect } from "react";
import type { BlogLang, BlogPost } from "@/lib/sanity";
import { getBlogPostSeo, blogLanguageUrl, BLOG_LANGUAGES } from "../seo";

type BlogSeoMetadataProps = {
  language: BlogLang;
  post?: BlogPost;
  title?: string;
  description?: string;
};

function upsertMeta(selector: string, attribute: "name" | "property", value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(selector: string, rel: string, href: string, hrefLang?: string) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    if (hrefLang) element.hreflang = hrefLang;
    document.head.appendChild(element);
  }
  element.href = href;
}

function replaceOpenGraphAlternateLocales(locales: string[]) {
  document.head
    .querySelectorAll('meta[property="og:locale:alternate"]')
    .forEach((element) => element.remove());

  for (const locale of locales) {
    const element = document.createElement("meta");
    element.setAttribute("property", "og:locale:alternate");
    element.content = locale;
    document.head.appendChild(element);
  }
}

export function BlogSeoMetadata({ language, post, title, description }: BlogSeoMetadataProps) {
  useEffect(() => {
    const postSeo = post ? getBlogPostSeo(post, language) : undefined;
    const localizedTitle = postSeo?.title || title || "";
    const localizedDescription = postSeo?.description || description || "";
    const pathname = post ? `/blog/${post.slug}` : "/blog";
    const url = postSeo?.url || blogLanguageUrl(pathname, language);

    document.documentElement.lang = language;
    document.title = localizedTitle;
    upsertMeta('meta[name="description"]', "name", "description", localizedDescription);
    upsertMeta('meta[property="og:title"]', "property", "og:title", localizedTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", localizedDescription);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta(
      'meta[property="og:locale"]',
      "property",
      "og:locale",
      postSeo?.locale || language
    );
    replaceOpenGraphAlternateLocales(postSeo?.alternateLocales || []);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", localizedTitle);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      localizedDescription
    );
    upsertLink('link[rel="canonical"]', "canonical", url);

    if (postSeo?.image) {
      upsertMeta('meta[property="og:image"]', "property", "og:image", postSeo.image);
      upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", postSeo.imageAlt);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", postSeo.image);
    }

    for (const locale of BLOG_LANGUAGES) {
      upsertLink(
        `link[rel="alternate"][hreflang="${locale}"]`,
        "alternate",
        blogLanguageUrl(pathname, locale),
        locale
      );
    }
  }, [description, language, post, title]);

  return null;
}
