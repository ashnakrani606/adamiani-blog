"use client";

import { useMemo, useState } from "react";
import { content } from "@/app/lang";
import type { BlogPostListItem, Category } from "@/lib/sanity";
import { useBlogLanguage } from "../hooks/useBlogLanguage";
import { BlogHeader } from "./BlogHeader";
import { BlogCard } from "./BlogCard";
import { CategoryFilter } from "./CategoryFilter";

type BlogIndexClientProps = {
  posts: BlogPostListItem[];
  categories: Category[];
};

export function BlogIndexClient({ posts, categories }: BlogIndexClientProps) {
  const { language, setLanguage } = useBlogLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const t = content[language];

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((post) => post.category?.slug === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div className="relative min-h-screen scroll-smooth bg-cream text-ink">
      <BlogHeader language={language} setLanguage={setLanguage} />

      <main className="mx-auto w-full max-w-360 px-4 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-2xl">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-dark-grayish-blue">
            Adamiani
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
            {t.blog.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-dark-grayish-blue sm:text-base">
            {t.blog.subtitle}
          </p>
        </div>

        <div className="mt-10">
          <CategoryFilter
            categories={categories}
            activeSlug={activeCategory}
            onChange={setActiveCategory}
            language={language}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <p className="mt-16 text-dark-grayish-blue">{t.blog.empty}</p>
        ) : (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {filteredPosts.map((post) => (
              <BlogCard key={post._id} post={post} language={language} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
