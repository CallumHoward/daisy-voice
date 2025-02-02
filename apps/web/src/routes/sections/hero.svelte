<script lang="ts">
  import type { BlockContent } from "$lib/sanity/generated-types";
  import { PortableText } from "@portabletext/svelte";

  export let name: string;
  export let content: BlockContent | undefined;

  $: id = name.toLowerCase().replace(/\s/g, "-");
</script>

<section {id} class="hero aspect-square max-h-screen">
  <div class="hero-content max-w-lg text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Need a Voice Artist?</h1>
      <p class="mb-6 py-6">
        Hi, my name is Heather, and I'm available for any type of voice over;
        audio books, commercials, video games, and more.
        <PortableText components={{}} value={content} />
      </p>
      <a href="#contact" class="btn btn-primary uppercase">Contact</a>
    </div>
  </div>
  <a href="#demos" class="mt-auto">
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
