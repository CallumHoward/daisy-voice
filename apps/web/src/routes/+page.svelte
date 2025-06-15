<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import type { PageData } from "./$types";
  import Contact from "./sections/contact.svelte";
  import Demos from "./sections/demos.svelte";
  import Tracks from "./sections/tracks.svelte";
  import Hero from "./sections/hero.svelte";
  import Testimonials from "./sections/testimonials.svelte";
  import Specs from "./sections/specs.svelte";
  import Custom from "./sections/custom.svelte";
  import type { SvelteComponent } from "svelte";
  import type { BlockContent } from "$lib/sanity/generated-types";

  export let data: PageData;

  const sectionsRes = useQuery(data.sections);

  $: ({ data: sections } = $sectionsRes);

  type SectionProps = {
    name: string;
    heading?: string;
    content?: BlockContent;
    data?: PageData;
  };

  const sectionComponents: Record<
    string,
    typeof SvelteComponent<SectionProps>
  > = {
    hero: Hero,
    demos: Demos,
    tracks: Tracks,
    testimonials: Testimonials,
    contact: Contact,
    specs: Specs,
    custom: Custom,
  } as const;
</script>

{#each sections as { type, enabled, name, heading, content }}
  {#if type in sectionComponents && enabled}
    <svelte:component
      this={sectionComponents[type]}
      {name}
      {heading}
      {content}
      {data}
    />
  {/if}
{/each}

<style>
  :global(section) {
    padding-block: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
