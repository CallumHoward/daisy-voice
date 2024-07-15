<script lang="ts">
  import { browser } from "$app/environment";

  export let title: string;
  export let share: string;
  export let embed: string;

  $: id = embed.match(/tracks\/(\d+)\b/)?.[1];
  $: params = new URLSearchParams({
    url: `https://api.soundcloud.com/tracks/${id}`,
    color: "ef9995",
    auto_play: "false",
    hide_related: "false",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    show_teaser: "false",
  });
  $: soundCloudEmbedUrl = `https://w.soundcloud.com/player/?${params.toString()}`;
</script>

{#if browser && id}
  <iframe
    title="SoundCloud Track"
    width="100%"
    height="166"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src={soundCloudEmbedUrl}
  />
{:else}
  <a
    href={share}
    class="flex h-[166px] w-full flex-col items-center justify-center border"
  >
    <h3 class="text-2xl">{title}</h3>
  </a>
{/if}
