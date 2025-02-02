import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "section",
  title: "Section",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .lowercase()
          .regex(/^[a-z][a-z0-9-]+$/),
    }),
    orderRankField({ type: "section" }),
  ],
});
