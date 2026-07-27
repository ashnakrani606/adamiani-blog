import type { MetadataRoute } from "next";
import { getAllPostSlugs, SITE_URL } from "@/lib/sanity";

const baseUrl = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const posts = await getAllPostSlugs();
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishDate),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticPages, ...blogPages];
  } catch (error) {
    console.error("[sitemap] Failed to fetch blog posts:", error);
    return staticPages;
  }
}
