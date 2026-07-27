"use client";

import type { Lang } from "@/app/lang";
import { content } from "@/app/lang";
import { pickLocalized, type Category } from "@/lib/sanity";

type CategoryFilterProps = {
  categories: Category[];
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
  language: Lang;
};

export function CategoryFilter({
  categories,
  activeSlug,
  onChange,
  language,
}: CategoryFilterProps) {
  const t = content[language];

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition rounded-sm ${
          activeSlug === null
            ? "bg-ink text-white"
            : "bg-mist text-dark-grayish-blue hover:text-ink"
        }`}
      >
        {t.blog.allCategories}
      </button>
      {categories.map((category) => {
        const name = pickLocalized(category.name, language);
        const active = activeSlug === category.slug;
        return (
          <button
            key={category._id}
            type="button"
            onClick={() => onChange(category.slug)}
            className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition rounded-sm ${
              active
                ? "bg-ink text-white"
                : "bg-mist text-dark-grayish-blue hover:text-ink"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
