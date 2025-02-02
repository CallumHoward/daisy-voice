<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import type { PageData } from "../$types";
  import SoundCloudTrack from "../../components/SoundCloudTrack.svelte";
  import type { BlockContent } from "$lib/sanity/generated-types";
  import { PortableText } from "@portabletext/svelte";
  import { stegaClean } from "@sanity/client/stega";
  import InlineImage from "../../components/InlineImage.svelte";

  export let name: string;
  export let heading: string = "Demos";
  export let data: PageData;
  export let content: BlockContent | undefined;

  const tracksRes = useQuery(data.tracks);

  $: ({ data: tracks } = $tracksRes);
  $: id = stegaClean(name).toLowerCase().replace(/\s/g, "-");
</script>

<section {id} class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start overflow-hidden text-center">
    <h2 class="mb-16 text-center text-3xl font-bold">{heading}</h2>
    {#if content}
      <p class="mb-6 py-6">
        <PortableText
          components={{ types: { image: InlineImage } }}
          value={content}
        />
      </p>
    {/if}
    {#if tracks?.length}
      <div class="carousel w-full gap-8 px-4">
        {#each tracks as { title, share, embed }}
          <div class="carousel-item w-[348px]">
            <SoundCloudTrack {title} {share} {embed} />
          </div>
        {/each}
      </div>
    {:else}
      No demos yet
    {/if}
  </div>
</section>
