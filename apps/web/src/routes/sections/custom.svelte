<script lang="ts">
  import type { BlockContent } from "$lib/sanity/generated-types";
  import { PortableText } from "@portabletext/svelte";
  import { stegaClean } from "@sanity/client/stega";
  import Section from "../../components/Section.svelte";
  import InlineImage from "../../components/InlineImage.svelte";

  export let name: string;
  export let heading: string = "Contact";
  export let content: BlockContent | undefined;

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
</Section>
