import type { Post, Testimonial } from "$lib/sanity/generated-types";
import { postsQuery, testimonialsQuery } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const { loadQuery } = event.locals;
  const initialPosts = await loadQuery<Post[]>(postsQuery);
  const initialTestimonials = await loadQuery<Testimonial[]>(testimonialsQuery);

  // We pass the data in a format that is easy for `useQuery` to consume in the
  // corresponding `+page.svelte` file, but you can return the data in any
  // format you like.
  return {
    posts: { query: postsQuery, options: { initial: initialPosts } },
    testimonials: {
      query: testimonialsQuery,
      options: { initial: initialTestimonials },
    },
  };
};
