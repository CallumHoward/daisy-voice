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

  const tracksRes = useQuery(data.tracks);
  $: ({ data: tracks } = $tracksRes);
  $: id = stegaClean(name).toLowerCase().replace(/\s/g, "-");
</script>

<Section {id} {heading}>
  <PortableText
    slot="description"
    components={{
      types: { image: InlineImage },
    }}
    value={content}
  />

  <ul
    class="list bg-base-100 rounded-box max-h-96 overflow-scroll shadow-md"
    slot="main"
  >
    {#if !tracks?.length}
      No demos yet
    {/if}

    {#each tracks as { title }}
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
            Audio Samples
          </div>
        </div>
        <MediaButton />
      </li>
    {/each}
  </ul>
</Section>
