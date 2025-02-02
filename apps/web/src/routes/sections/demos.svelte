<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import type { PageData } from "../$types";
  import SoundCloudTrack from "../../components/SoundCloudTrack.svelte";

  export let data: PageData;

  const tracksRes = useQuery(data.tracks);

  $: ({ data: tracks } = $tracksRes);
</script>

<section id="demos" class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start overflow-hidden text-center">
    <h2 class="mb-16 text-center text-3xl font-bold">Demos</h2>
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
