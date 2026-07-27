import { defineField, defineType } from "sanity";

export const tableRow = defineType({
  name: "tableRow",
  title: "Table Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(1).error("Add at least one cell"),
    }),
  ],
  preview: {
    select: { cells: "cells" },
    prepare({ cells }) {
      const preview = (cells as string[] | undefined)?.filter(Boolean).join(" | ");
      return {
        title: preview || "Empty row",
      };
    },
  },
});
