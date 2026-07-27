import { defineField, defineType } from "sanity";

function isYouTubeUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (
      host === "youtu.be" ||
      host === "youtube.com" ||
      host === "m.youtube.com"
    );
  } catch {
    return false;
  }
}

export const youtube = defineType({
  name: "youtube",
  title: "YouTube Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      description: "Paste a youtube.com or youtu.be link",
      validation: (Rule) =>
        Rule.required()
          .uri({ scheme: ["http", "https"] })
          .custom((value) => {
            if (!value || typeof value !== "string") return true;
            return isYouTubeUrl(value) || "Enter a valid YouTube URL";
          }),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { url: "url", caption: "caption" },
    prepare({ url, caption }) {
      return {
        title: caption || "YouTube Video",
        subtitle: url,
      };
    },
  },
});
