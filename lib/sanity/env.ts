/**
 * Sanity environment configuration.
 * Uses the existing Sanity project — never hardcodes a new project ID.
 */
export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
export const sanityUseCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN !== "false";
