<script lang="ts">
  import { onMount } from "svelte";
  import { PUBLIC_SANITY_STUDIO_URL } from "$env/static/public";

  onMount(() => {
    location.href = PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";
  });
</script>
