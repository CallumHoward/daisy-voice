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
      description:
        "A name for this section, for reference only (not shown on page)",
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
          { title: "specs", value: "specs" },
          { title: "custom", value: "custom" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Text Heading (optional)",
      description:
        "Text to appear as a heading for the section. Leave blank for no heading.",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Text Content (optional)",
      description: "Text content for the section",
      type: "blockContent",
    }),
    orderRankField({ type: "section" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
      enabled: "enabled",
    },
    prepare({ title, subtitle, enabled }) {
      return {
        title,
        subtitle: `${subtitle} ${enabled ? "" : "(hidden)"}`,
      };
    },
  },
});
