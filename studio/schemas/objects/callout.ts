import { defineField, defineType } from "sanity";

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Note", value: "note" },
          { title: "Warning", value: "warning" },
          { title: "Tip", value: "tip" },
        ],
        layout: "radio",
      },
      initialValue: "info",
    }),
    defineField({
      name: "title",
      title: "Title (optional)",
      type: "string",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", text: "text", variant: "variant" },
    prepare({ title, text, variant }) {
      return {
        title: title || `${variant || "info"} callout`,
        subtitle: text,
      };
    },
  },
});
