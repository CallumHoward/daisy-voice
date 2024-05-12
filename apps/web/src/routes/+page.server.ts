import type { Testimonial, Track } from "$lib/sanity/generated-types";
import { testimonialsQuery, tracksQuery } from "$lib/sanity/queries";
import type { QueryResponseInitial } from "@sanity/svelte-loader";
import type { Actions, PageServerLoad } from "./$types";
import { handleContactFromAction } from "./contact-form-action";

type QueryResponseTypes = Testimonial[] | Track[];
type Data = Record<
  string,
  {
    query: string;
    options: { initial: QueryResponseInitial<QueryResponseTypes> };
  }
>;

export const load: PageServerLoad = async (event) => {
  const { loadQuery } = event.locals;
  const initialTestimonials = await loadQuery<Testimonial[]>(testimonialsQuery);
  const initialTracks = await loadQuery<Track[]>(tracksQuery);

  // We pass the data in a format that is easy for `useQuery` to consume in the
  // corresponding `+page.svelte` file, but you can return the data in any
  // format you like.
  return {
    testimonials: {
      query: testimonialsQuery,
      options: { initial: initialTestimonials },
    },
    tracks: { query: tracksQuery, options: { initial: initialTracks } },
  } satisfies Data;
};

export const actions: Actions = {
  default: handleContactFromAction,
};
