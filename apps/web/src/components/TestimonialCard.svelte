<script lang="ts">
  import StarRating from "./StarRating.svelte";
  import type { Rating } from "./types";

  export let rating: Rating;
  export let avatarSrc: string;
  export let name: string;
  export let from: string | undefined;
</script>

<div class="card w-[23rem] bg-base-100 shadow-xl">
  <div class="card-body gap-6">
    <blockquote class="grow italic">
      <slot />
    </blockquote>
    <StarRating {rating} />
    <footer class="flex flex-row items-center gap-4">
      <div class="avatar">
        <div class="h-12 w-12 rounded-full">
          <img class="avatar" alt="avatar" src={avatarSrc} />
        </div>
      </div>
      <span class="flex flex-col">
        <cite class="text-xl">{name}</cite>
        <p class="text-lg">{from}</p>
      </span>
    </footer>
  </div>
</div>
