import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoDemoCategory",
  title: "Video Demo Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "The tab and column title shown on the website",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      description: "Hide this category without deleting its videos",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "videoDemoCategory" }),
  ],
  preview: {
    select: {
      title: "title",
      enabled: "enabled",
    },
    prepare({ title, enabled }) {
      return {
        title,
        subtitle: enabled ? undefined : "Hidden",
      };
    },
  },
});
