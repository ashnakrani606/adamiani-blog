import { createClient, type QueryParams } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityUseCdn,
} from "./env";

export const isSanityConfigured = Boolean(sanityProjectId);

const shouldUseCdn = process.env.NODE_ENV === "production" ? sanityUseCdn : false;

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: shouldUseCdn,
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

  return sanityClient.fetch<T>(query, params);
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

  return serverClient.fetch<T>(query, params);
}
