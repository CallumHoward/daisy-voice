import type { Post, Testimonial, Track } from "$lib/sanity/generated-types";
import {
  postsQuery,
  testimonialsQuery,
  tracksQuery,
} from "$lib/sanity/queries";
import type { QueryResponseInitial } from "@sanity/svelte-loader";
import type { PageServerLoad } from "./$types";

type QueryResponseTypes = Post[] | Testimonial[] | Track[];
type Data = Record<
  string,
  {
    query: string;
    options: { initial: QueryResponseInitial<QueryResponseTypes> };
  }
>;

export const load: PageServerLoad = async (event) => {
  const { loadQuery } = event.locals;
  const initialPosts = await loadQuery<Post[]>(postsQuery);
  const initialTestimonials = await loadQuery<Testimonial[]>(testimonialsQuery);
  const initialTracks = await loadQuery<Track[]>(tracksQuery);

  // We pass the data in a format that is easy for `useQuery` to consume in the
  // corresponding `+page.svelte` file, but you can return the data in any
  // format you like.
  return {
    posts: { query: postsQuery, options: { initial: initialPosts } },
    testimonials: {
      query: testimonialsQuery,
      options: { initial: initialTestimonials },
    },
    tracks: { query: tracksQuery, options: { initial: initialTracks } },
  } satisfies Data;
};
