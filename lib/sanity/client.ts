import { createClient, type QueryParams } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./env";

export const isSanityConfigured = Boolean(sanityProjectId);

/** Cache tag shared by all blog queries. */
export const SANITY_BLOG_TAG = "sanity:blog";

const blogFetchOptions = {
  next: { revalidate: 60, tags: [SANITY_BLOG_TAG] },
};

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      // Do not serve just-unpublished documents from Sanity's CDN. Next.js
      // supplies the shared 60-second cache above instead.
      useCdn: false,
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  if (!sanityClient) {
    console.warn(
      "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Returning empty blog data."
    );
    return [] as T;
  }

  return sanityClient.fetch<T>(query, params, blogFetchOptions);
}

/**
 * Server-side fetch that bypasses the CDN to get the freshest data.
 * Use this for sitemap generation and revalidation-critical endpoints.
 */
export async function serverSanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  if (!isSanityConfigured) {
    console.warn(
      "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Returning empty blog data."
    );
    return [] as T;
  }

  const serverClient = createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: false,
  });

  return serverClient.fetch<T>(query, params, blogFetchOptions);
}
