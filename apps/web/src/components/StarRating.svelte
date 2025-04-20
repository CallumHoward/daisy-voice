<script lang="ts">
  export let rating: number = 3;
</script>

<div class="rating">
  {#each [1, 2, 3, 4, 5] as n}
    <div
      class="mask mask-star bg-orange-400"
      aria-label="{n} star"
      aria-current={n === rating ? "true" : "false"}
    />
  {/each}
</div>
