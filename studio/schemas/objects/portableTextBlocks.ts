/** Shared Portable Text block types for blog body fields. */
export const portableTextBlocks = [
  {
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 1", value: "h1" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
      { title: "Heading 4", value: "h4" },
      { title: "Heading 5", value: "h5" },
      { title: "Heading 6", value: "h6" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
        { title: "Underline", value: "underline" },
        { title: "Strikethrough", value: "strike-through" },
        { title: "Code", value: "code" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            {
              name: "href",
              type: "url",
              title: "URL",
              validation: (Rule: { uri: (opts: { allowRelative: boolean; scheme: string[] }) => unknown }) =>
                Rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            },
            {
              name: "blank",
              type: "boolean",
              title: "Open in new tab",
              initialValue: true,
            },
          ],
        },
      ],
    },
  },
  {
    type: "image",
    options: { hotspot: true },
    fields: [
      {
        name: "alt",
        type: "string",
        title: "Alt text",
        description: "Describe the image for accessibility",
      },
      {
        name: "caption",
        type: "string",
        title: "Caption",
        description: "Optional caption shown below the image",
      },
    ],
  },
  { type: "tableBlock" },
  { type: "callout" },
  { type: "youtube" },
];
