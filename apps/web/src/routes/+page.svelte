<script lang="ts">
  import type { PageData } from "./$types";
  import Contact from "./sections/contact.svelte";
  import Demos from "./sections/demos.svelte";
  import Hero from "./sections/hero.svelte";
  import Testimonials from "./sections/testimonials.svelte";

  export let data: PageData;
</script>

<Hero />
<Demos {data} />
<Testimonials {data} />
<Contact />

<style>
  :global(section) {
    padding-block: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
