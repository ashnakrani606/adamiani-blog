import { isSanityConfigured, sanityFetch } from "./client";
import type { BlogPost, BlogPostListItem, Category } from "./types";

const categoryProjection = `
  _id,
  name,
  "slug": slug.current
`;

const listProjection = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishDate,
  featuredImage,
  category->{
    ${categoryProjection}
  }
`;

const portableTextBlockProjection = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      ...,
      href,
      blank
    }
  },
  _type == "image" => {
    ...,
    asset->
  }
`;

const bodyProjection = `
  body {
    en[]{ ${portableTextBlockProjection} },
    ru[]{ ${portableTextBlockProjection} },
    ka[]{ ${portableTextBlockProjection} }
  }
`;

const postProjection = `
  ${listProjection},
  ${bodyProjection},
  seoTitle,
  seoDescription
`;

/** All published posts, newest first. */
export const allPostsQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishDate) && !(_id in path("drafts.**"))] | order(publishDate desc) {
  ${listProjection}
}`;

/** Single post by slug. */
export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  ${postProjection}
}`;

/** All categories. */
export const allCategoriesQuery = `*[_type == "category" && defined(slug.current)] | order(name.en asc) {
  ${categoryProjection}
}`;

/** Slugs for static generation / sitemap. */
export const allPostSlugsQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishDate) && !(_id in path("drafts.**"))] {
  "slug": slug.current,
  publishDate,
  _updatedAt
}`;

export async function getAllPosts(): Promise<BlogPostListItem[]> {
  if (!isSanityConfigured) return [];
  // Use server-side fetch to avoid CDN staleness for critical content.
  return (await import("./client")).serverSanityFetch<BlogPostListItem[]>(
    allPostsQuery
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured) return null;
  return sanityFetch<BlogPost | null>(postBySlugQuery, { slug });
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return [];
  return sanityFetch<Category[]>(allCategoriesQuery);
}

export async function getAllPostSlugs(): Promise<
  { slug: string; publishDate: string; _updatedAt: string }[]
> {
  if (!isSanityConfigured) return [];
  // Use server-side fetch to ensure we don't pick up stale or cached published docs.
  return (await import("./client")).serverSanityFetch(allPostSlugsQuery);
}
