import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      description: "Author of testimonial",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "from",
      title: "From (country/company)",
      description: "Prefix with flag emoji, example: 🇺🇸 United States",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatarSrc",
      title: "Avatar",
      description: "Small image 48x48 recommended.",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating 0-5",
      type: "number",
      initialValue: 5,
      validation: (Rule) => Rule.min(0).max(5).integer(),
    }),
    defineField({
      name: "content",
      description:
        "Pick out 1-2 adjectives and bold them. Surround in smart quotes, eg. “hello”",
      title: "Testimonial content",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "testimonial" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "from",
      media: "avatarSrc",
    },
    prepare(selection) {
      return selection;
    },
  },
});
