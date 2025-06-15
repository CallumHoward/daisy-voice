import type {
  AudioTrack as BaseAudioTrack,
  Section,
  Testimonial,
  Track,
} from "$lib/sanity/generated-types";
import {
  audioTracksQuery,
  sectionsQuery,
  testimonialsQuery,
  tracksQuery,
} from "$lib/sanity/queries";
import type { QueryResponseInitial } from "@sanity/svelte-loader";
import type { Actions, PageServerLoad } from "./$types";
import { handleContactFromAction } from "./contact-form-action";

type AudioTrack = BaseAudioTrack & { url: string };
type QueryResponseTypes = Testimonial[] | Track[] | AudioTrack[] | Section[];
type DataEntry = {
  query: string;
  options: { initial: QueryResponseInitial<QueryResponseTypes> };
};
type Data = Record<string, DataEntry>;

export const load: PageServerLoad = async (event) => {
  const { loadQuery } = event.locals;
  const initialTestimonials = await loadQuery<Testimonial[]>(testimonialsQuery);
  const initialTracks = await loadQuery<Track[]>(tracksQuery);
  const initialAudioTracks = await loadQuery<AudioTrack[]>(audioTracksQuery);
  const initialSections = await loadQuery<Section[]>(sectionsQuery);

  // We pass the data in a format that is easy for `useQuery` to consume in the
  // corresponding `+page.svelte` file, but you can return the data in any
  // format you like.
  return {
    testimonials: {
      query: testimonialsQuery,
      options: { initial: initialTestimonials },
    },
    tracks: { query: tracksQuery, options: { initial: initialTracks } },
    audioTracks: {
      query: audioTracksQuery,
      options: { initial: initialAudioTracks },
    },
    sections: { query: sectionsQuery, options: { initial: initialSections } },
  } satisfies Data;
};

export const actions: Actions = {
  default: handleContactFromAction,
};
