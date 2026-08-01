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
        "Used to identify this video in Studio and by assistive technology",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Audiobooks", value: "audiobooks" },
          { title: "Game", value: "game" },
          { title: "Animation", value: "animation" },
          { title: "IVR", value: "ivr" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "A short, one-line description shown below the video",
      type: "string",
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
      subtitle: "category",
      media: "poster",
    },
  },
});
