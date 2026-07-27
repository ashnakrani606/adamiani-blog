import { defineField, defineType } from "sanity";

export const tableBlock = defineType({
  name: "tableBlock",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
    }),
    defineField({
      name: "hasHeaderRow",
      title: "First row is header",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [{ type: "tableRow" }],
      validation: (Rule) =>
        Rule.min(1)
          .error("Add at least one row")
          .custom((rows) => {
            if (!Array.isArray(rows) || rows.length === 0) return true;
            const lengths = rows
              .map((row) =>
                Array.isArray((row as { cells?: string[] }).cells)
                  ? (row as { cells: string[] }).cells.length
                  : 0
              )
              .filter((count) => count > 0);
            if (lengths.length === 0) {
              return "Each row needs at least one cell";
            }
            const first = lengths[0];
            const uneven = lengths.some((count) => count !== first);
            return uneven
              ? "All rows should have the same number of cells"
              : true;
          }),
    }),
  ],
  preview: {
    select: { rows: "rows", caption: "caption" },
    prepare({ rows, caption }) {
      const count = Array.isArray(rows) ? rows.length : 0;
      return {
        title: caption || "Table",
        subtitle: `${count} row${count === 1 ? "" : "s"}`,
      };
    },
  },
});
