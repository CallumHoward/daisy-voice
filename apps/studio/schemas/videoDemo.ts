import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoDemo",
  title: "Video Demo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        "A short, one-line title shown below the video and used to identify it in Studio",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Controls which tab and column this video appears in",
      type: "reference",
      to: [{ type: "videoDemoCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      description: "Upload an MP4 or another browser-compatible video format",
      type: "file",
      options: { accept: "video/*" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster Image",
      description: "Optional thumbnail displayed before playback begins",
      type: "image",
      options: { hotspot: true },
    }),
    orderRankField({ type: "videoDemo" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "poster",
    },
  },
});
