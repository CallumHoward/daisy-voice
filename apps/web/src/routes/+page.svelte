<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import type { PageData } from "./$types";
  import Contact from "./sections/contact.svelte";
  import Demos from "./sections/demos.svelte";
  import Hero from "./sections/hero.svelte";
  import Testimonials from "./sections/testimonials.svelte";
  import type { SvelteComponent } from "svelte";

  export let data: PageData;

  const sectionsRes = useQuery(data.sections);

  $: ({ data: sections } = $sectionsRes);

  $: orderedSectionKeys = sections?.map((section) => section.id) ?? [];

  type Props = {
    data?: PageData;
  };

  const sectionComponents: Record<string, typeof SvelteComponent<Props>> = {
    hero: Hero,
    demos: Demos,
    testimonials: Testimonials,
    contact: Contact,
  } as const;
</script>

{#each orderedSectionKeys as sectionKey}
  {#if sectionKey in sectionComponents}
    <svelte:component this={sectionComponents[sectionKey]} {data} />
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
