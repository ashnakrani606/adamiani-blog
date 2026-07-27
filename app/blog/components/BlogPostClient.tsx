"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { content } from "@/app/lang";
import {
  formatPublishDate,
  pickLocalized,
  pickLocalizedBody,
  urlForImage,
  type BlogPost,
} from "@/lib/sanity";
import { useBlogLanguage } from "../hooks/useBlogLanguage";
import { BlogHeader } from "./BlogHeader";
import { BlogPortableText } from "./BlogPortableText";

type BlogPostClientProps = {
  post: BlogPost;
};

export function BlogPostClient({ post }: BlogPostClientProps) {
  const { language, setLanguage } = useBlogLanguage();
  const t = content[language];

  const title = pickLocalized(post.title, language);
  const categoryName = post.category
    ? pickLocalized(post.category.name, language)
    : null;
  const body = pickLocalizedBody(post.body, language);
  const imageUrl = post.featuredImage?.asset
    ? urlForImage(post.featuredImage).width(1400).height(788).url()
    : null;
  const alt = pickLocalized(post.featuredImage?.alt, language) || title;

  return (
    <div className="relative min-h-screen scroll-smooth bg-cream text-ink">
      <BlogHeader language={language} setLanguage={setLanguage} />

      <main className="mx-auto w-full max-w-360 px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-dark-grayish-blue transition hover:text-accent-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.blog.backToBlog}
        </Link>

        <article className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-dark-grayish-blue">
            {categoryName && <span className="text-accent-blue">{categoryName}</span>}
            {categoryName && <span className="text-hairline">·</span>}
            <time dateTime={post.publishDate}>
              {formatPublishDate(post.publishDate, language)}
            </time>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            {title}
          </h1>

          {imageUrl && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-mist rounded-sm">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                priority
                className="object-cover rounded-sm"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          <div className="mt-10">
            <BlogPortableText value={body} />
          </div>
        </article>
      </main>
    </div>
  );
}
