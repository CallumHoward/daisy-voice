<script lang="ts">

  export let rating: number = 3;
</script>

<label class="leading-none">
  <div class="rating relative">
    {#each [1, 2, 3, 4, 5] as n}
        <p class="h-0 opacity-0 absolute">{n}</p>
        <input
          type="radio"
          name="rating"
          class="mask mask-star cursor-auto bg-orange-400"
          value={n}
          bind:group={rating}
          readonly
          disabled
        />
    {/each}
  </div>
</label>
