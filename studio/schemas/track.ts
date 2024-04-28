import { orderRankField } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'track',
  title: 'Track',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'SoundCloud ID',
      description:
        'Number that can be found in the SoundCloud track URL, eg. 226389958',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/\d{9}/),
    }),
    orderRankField({ type: 'track' }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'id',
    },
    prepare(selection) {
      return selection
    },
  },
})
