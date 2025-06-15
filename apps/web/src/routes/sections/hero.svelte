<script lang="ts">
  import type { BlockContent } from "$lib/sanity/generated-types";
  import { PortableText } from "@portabletext/svelte";
  import { stegaClean } from "@sanity/client/stega";
  import InlineImage from "../../components/InlineImage.svelte";

  export let name: string;
  export let heading: string = "Need a Voice Artist?";
  export let content: BlockContent | undefined;

  $: id = stegaClean(name).toLowerCase().replace(/\s/g, "-");
</script>

<section {id} class="hero !grid aspect-square max-h-screen">
  <div class="hero-content max-w-lg text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">{heading}</h1>
      {#if content}
        <p class="mb-6 py-6">
          <PortableText
            components={{ types: { image: InlineImage } }}
            value={content}
          />
        </p>
      {/if}
      <a href="#contact" class="btn btn-primary uppercase">Contact</a>
    </div>
  </div>
  <a href="#tracks-audiobook" class="mt-auto">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      ></path>
    </svg>
  </a>
</section>
