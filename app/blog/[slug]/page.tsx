import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/sanity";
import { BlogPostClient } from "../components/BlogPostClient";
import { getBlogLanguage, getBlogPostSeo } from "../seo";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language = getBlogLanguage(lang);
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | Adamiani",
    };
  }

  const seo = getBlogPostSeo(post, language);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.url,
      languages: seo.languages,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: "Adamiani",
      type: "article",
      publishedTime: post.publishDate,
      locale: seo.locale,
      alternateLocale: seo.alternateLocales,
      ...(seo.image
        ? {
            images: [
              {
                url: seo.image,
                width: 1200,
                height: 630,
                alt: seo.imageAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(seo.image ? { images: [seo.image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { lang } = await searchParams;
  return <BlogPostClient post={post} initialLanguage={getBlogLanguage(lang)} />;
}
