import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "section",
  title: "Section",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      description: "This section will be hidden if disabled",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Section Type",
      type: "string",
      options: {
        list: [
          { title: "hero", value: "hero" },
          { title: "demos", value: "demos" },
          { title: "testimonials", value: "testimonials" },
          { title: "contact", value: "contact" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Text Content",
      description: "Text content for the section",
      type: "blockContent",
    }),
    orderRankField({ type: "section" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
    },
    prepare(selection) {
      return selection;
    },
  },
});
