import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ru",
          title: "Russian",
          type: "string",
        }),
        defineField({
          name: "ka",
          title: "Georgian",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name.en",
        maxLength: 64,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      titleEn: "name.en",
      titleRu: "name.ru",
      titleKa: "name.ka",
      slug: "slug.current",
    },
    prepare({ titleEn, titleRu, titleKa, slug }) {
      return {
        title: titleEn || titleRu || titleKa || "Untitled category",
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
