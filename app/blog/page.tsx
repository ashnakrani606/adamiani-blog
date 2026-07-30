import type { Metadata } from "next";
import { getAllCategories, getAllPosts } from "@/lib/sanity";
import { content } from "@/app/lang";
import { BlogIndexClient } from "./components/BlogIndexClient";
import { BLOG_LANGUAGES, blogLanguageUrl, getBlogLanguage } from "./seo";

export const revalidate = 60;

type PageProps = { searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const language = getBlogLanguage(lang);
  const title = `${content[language].blog.title} | Adamiani`;
  const description = content[language].blog.subtitle;
  const url = blogLanguageUrl("/blog", language);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        BLOG_LANGUAGES.map((locale) => [locale, blogLanguageUrl("/blog", locale)])
      ),
    },
    openGraph: { title, description, url, siteName: "Adamiani", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  return <BlogIndexClient posts={posts} categories={categories} initialLanguage={getBlogLanguage(lang)} />;
}
