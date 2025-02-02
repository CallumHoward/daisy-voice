<script lang="ts">
  import type { BlockContent } from "$lib/sanity/generated-types";
  import { PortableText } from "@portabletext/svelte";
  import { stegaClean } from "@sanity/client/stega";
  import Section from "../../components/Section.svelte";
  import InlineImage from "../../components/InlineImage.svelte";

  export let name: string;
  export let heading: string = "Studio Specs";
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
  <table class="table" slot="main">
    <tr>
      <th>Mic</th>
      <td>RODE NT</td>
    </tr>
    <tr>
      <th>Software</th>
      <td>Audacity</td>
    </tr>
    <tr>
      <th>Hardware</th>
      <td>Macbook pro</td>
    </tr>
    <tr>
      <th>Live Directed Session</th>
      <td>Zoom, Discord or other readily available program</td>
    </tr>
    <tr>
      <th>Booth</th>
      <td>Sound treated home studio</td>
    </tr>
  </table>
</Section>
