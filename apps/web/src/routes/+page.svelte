<script lang="ts">
  import type { PageData } from "./$types";
  import Contact from "./sections/contact.svelte";
  import Demos from "./sections/demos.svelte";
  import Hero from "./sections/hero.svelte";
  import Testimonials from "./sections/testimonials.svelte";
  import type { SvelteComponent } from "svelte";

  export let data: PageData;

  const orderedSectionKeys = [
    "hero",
    "demos",
    "testimonials",
    "contact",
  ] as const;
  type SectionKey = (typeof orderedSectionKeys)[number];

  type Props = {
    data?: PageData;
  };

  const sectionComponents: Record<SectionKey, typeof SvelteComponent<Props>> = {
    hero: Hero,
    demos: Demos,
    testimonials: Testimonials,
    contact: Contact,
  } as const;
</script>

{#each orderedSectionKeys as sectionKey}
  <svelte:component this={sectionComponents[sectionKey]} {data} />
{/each}

<style>
  :global(section) {
    padding-block: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
