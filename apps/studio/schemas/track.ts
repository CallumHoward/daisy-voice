import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "track",
  title: "Track",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "share",
      title: "SoundCloud track share URL",
      description:
        "On target track: Share. Eg. `https://soundcloud.com/heather-howard-226389958/narration-childrens-heather`...",
      type: "string",
      validation: (Rule) => Rule.required().regex(/soundcloud.com/),
    }),
    defineField({
      name: "embed",
      title: "SoundCloud track embed code",
      description:
        'On target track: Share -> Embed. Eg. `<iframe width="100%"`...',
      type: "string",
      validation: (Rule) => Rule.required().regex(/tracks\/\b\d{10}\b/),
    }),
    orderRankField({ type: "track" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "id",
    },
    prepare(selection) {
      return selection;
    },
  },
});
