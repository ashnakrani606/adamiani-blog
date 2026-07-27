import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

if (!projectId) {
  throw new Error(
    "[studio] Missing project ID. Add SANITY_STUDIO_PROJECT_ID=dktqsofe to studio/.env and restart."
  );
}

export default defineConfig({
  name: "adamiani-blog",
  title: "Adamiani Blog",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
