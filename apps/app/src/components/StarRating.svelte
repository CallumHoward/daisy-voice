<script lang="ts">
  import type { Rating } from "./types";
  export let rating: Rating = 0;
</script>

<div class="rating">
  {#each [1, 2, 3, 4, 5] as number}
    <input
      type="radio"
      name="rating"
      class="mask mask-star bg-orange-400"
      value={number}
      bind:group={rating}
    />
  {/each}
</div>
