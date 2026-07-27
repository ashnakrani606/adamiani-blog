import { createClient, type QueryParams } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityUseCdn,
} from "./env";

export const isSanityConfigured = Boolean(sanityProjectId);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: sanityUseCdn,
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
