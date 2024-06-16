import { setPreviewing } from "@sanity/visual-editing/svelte";
import type { LayoutLoad } from "./$types";
import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";

inject({ mode: dev ? "development" : "production" });

export const load: LayoutLoad = (event) => {
  // The `event.data.preview` value received here is exposed by the
  // corresponding `+layout.server.ts` file.
  const { preview } = event.data;
  // `@sanity/visual-editing/svelte` exports two helpers for setting and getting
  // preview state on the client: `setPreviewing` and `isPreviewing`.
  setPreviewing(preview);
};
