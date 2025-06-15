import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "audioTrack",
  title: "Audio Track",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      description: "Category or Album to show below the track title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      description: "MP3 audio file for this track",
      type: "file",
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "audioTrack" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare(selection) {
      return selection;
    },
  },
});
