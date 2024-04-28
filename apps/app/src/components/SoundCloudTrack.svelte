<script lang="ts">
  export let id: string;

  const params = new URLSearchParams({
    url: `https://api.soundcloud.com/tracks/${id}`,
    color: "7480ff",
    auto_play: "false",
    hide_related: "false",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    show_teaser: "false",
  });
  const soundCloudUrl = `https://w.soundcloud.com/player/?${params.toString()}`;
</script>

<iframe
  title="SoundCloud Track"
  width="100%"
  height="166"
  scrolling="no"
  frameborder="no"
  allow="autoplay"
  src={soundCloudUrl}
/>
