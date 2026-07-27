import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "./env";

const builder = createImageUrlBuilder({
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset,
});

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
