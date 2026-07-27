"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/app/lang";
import {
  formatPublishDate,
  pickLocalized,
  urlForImage,
  type BlogPostListItem,
} from "@/lib/sanity";

type BlogCardProps = {
  post: BlogPostListItem;
  language: Lang;
};

export function BlogCard({ post, language }: BlogCardProps) {
  const title = pickLocalized(post.title, language);
  const excerpt = pickLocalized(post.excerpt, language);
  const categoryName = post.category
    ? pickLocalized(post.category.name, language)
    : null;
  const imageUrl = post.featuredImage?.asset
    ? urlForImage(post.featuredImage).width(800).height(450).url()
    : null;
  const alt = pickLocalized(post.featuredImage?.alt, language) || title;

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-mist rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-dark-grayish-blue">
              Adamiani
            </div>
          )}
        </div>
        <div className="pt-5">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-dark-grayish-blue">
            {categoryName && <span className="text-accent-blue">{categoryName}</span>}
            {categoryName && <span className="text-hairline">·</span>}
            <time dateTime={post.publishDate}>
              {formatPublishDate(post.publishDate, language)}
            </time>
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent-blue sm:text-2xl">
            {title}
          </h2>
          {excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dark-grayish-blue sm:text-[15px]">
              {excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
