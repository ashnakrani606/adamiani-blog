import { defineField, defineType } from "sanity";
import { portableTextBlocks } from "./objects/portableTextBlocks";

const localizedStringFields = [
  defineField({
    name: "en",
    title: "English",
    type: "string",
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
];

const localizedTextFields = [
  defineField({
    name: "en",
    title: "English",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "ru",
    title: "Russian",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "ka",
    title: "Georgian",
    type: "text",
    rows: 3,
  }),
];

const portableTextField = (langTitle: string) =>
  defineField({
    name: langTitle === "English" ? "en" : langTitle === "Russian" ? "ru" : "ka",
    title: langTitle,
    type: "array",
    of: portableTextBlocks,
  });

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      group: "content",
      fields: localizedStringFields,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      group: "content",
      fields: localizedTextFields,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "object",
          fields: localizedStringFields,
        }),
      ],
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      group: "content",
      fields: [
        portableTextField("English"),
        portableTextField("Russian"),
        portableTextField("Georgian"),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "object",
      group: "seo",
      fields: localizedStringFields,
      description: "Defaults to the post title if left empty.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "object",
      group: "seo",
      fields: localizedTextFields,
      description: "Defaults to the excerpt if left empty.",
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleRu: "title.ru",
      titleKa: "title.ka",
      media: "featuredImage",
      date: "publishDate",
    },
    prepare({ titleEn, titleRu, titleKa, media, date }) {
      return {
        title: titleEn || titleRu || titleKa || "Untitled post",
        subtitle: date
          ? new Date(date).toLocaleDateString()
          : "No publish date",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Publish Date, Newest",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
  ],
});
