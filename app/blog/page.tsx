import type { Metadata } from "next";
import { getAllCategories, getAllPosts, SITE_URL } from "@/lib/sanity";
import { BlogIndexClient } from "./components/BlogIndexClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Adamiani",
  description:
    "Insights on healthcare coordination, Health Passport, and treatment abroad from Adamiani.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Adamiani",
    description:
      "Insights on healthcare coordination, Health Passport, and treatment abroad from Adamiani.",
    url: `${SITE_URL}/blog`,
    siteName: "Adamiani",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Adamiani",
    description:
      "Insights on healthcare coordination, Health Passport, and treatment abroad from Adamiani.",
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  return <BlogIndexClient posts={posts} categories={categories} />;
}
