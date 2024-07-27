<script lang="ts">
  let counter: number[] = Array.from({ length: 10 }, (_, i) => i);
  export let rating: number = 4.5;


</script>

<!-- <label class="leading-none"> -->
  <div class="rating relative rating-half">
    {#each counter as n}
        <!-- <p class="h-0 opacity-0 absolute">{n}</p> -->
        <input
          type="radio"
          name="rating"
          class="mask mask-star-2 mask-half-{n % 2 + 1} cursor-auto bg-orange-400"
          bind:group={rating}
          value={n+0.5}
          readonly
          disabled
        />
    {/each}
  </div>
<!-- </label> -->
 
<div class="rating rating-lg rating-half">
  <input type="radio" name="rating-10" class="rating-hidden" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
  <input
    type="radio"
    name="rating-10"
    class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
</div>