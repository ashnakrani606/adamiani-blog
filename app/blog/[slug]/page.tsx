import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  blogPostUrl,
  getAllPostSlugs,
  getPostBySlug,
  pickLocalized,
  urlForImage,
} from "@/lib/sanity";
import { BlogPostClient } from "../components/BlogPostClient";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | Adamiani",
    };
  }

  const title =
    pickLocalized(post.seoTitle, "en") ||
    pickLocalized(post.title, "en") ||
    "Adamiani Blog";
  const description =
    pickLocalized(post.seoDescription, "en") ||
    pickLocalized(post.excerpt, "en") ||
    "";
  const url = blogPostUrl(post.slug);
  const ogImage = post.featuredImage?.asset
    ? urlForImage(post.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Adamiani",
      type: "article",
      publishedTime: post.publishDate,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
