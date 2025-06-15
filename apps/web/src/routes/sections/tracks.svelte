<script lang="ts">
  import type { PageData } from "../$types";
  import type { BlockContent } from "$lib/sanity/generated-types";
  import { useQuery } from "@sanity/svelte-loader";
  import { stegaClean } from "@sanity/client/stega";
  import { PortableText } from "@portabletext/svelte";
  import InlineImage from "../../components/InlineImage.svelte";
  import MediaButton from "../../components/MediaButton.svelte";
  import Section from "../../components/Section.svelte";

  export let name: string;
  export let heading: string = "Demos";
  export let data: PageData;
  export let content: BlockContent | undefined;

  const tracksRes = useQuery(data.audioTracks);
  $: ({ data: tracks } = $tracksRes);
  $: id = stegaClean(name).toLowerCase().replace(/\s/g, "-");

  $: filteredTracks = tracks?.filter((track) => 
    stegaClean(track.section).toLowerCase().replace(/\s/g, "-") === id
  );
</script>

<Section {id} {heading}>
  <ul
    class="list bg-base-100 rounded-box max-h-96 overflow-y-scroll shadow-md"
    slot="main"
  >
    {#if !filteredTracks?.length}
      No demos yet
    {/if}

    {#each filteredTracks as { title, subtitle, url } (url)}
      <li class="list-row">
        <div>
          <img
            class="rounded-box size-10"
            src="/avatar.avif"
            alt="Track thumbnail"
          />
        </div>
        <div>
          <div>{title}</div>
          <div class="text-xs font-semibold uppercase opacity-60">
            {subtitle}
          </div>
        </div>
        <MediaButton audioSrc={url} />
      </li>
    {/each}
  </ul>

  <PortableText
    slot="description"
    components={{
      types: { image: InlineImage },
    }}
    value={content}
  />
</Section>
