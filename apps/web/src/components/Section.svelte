<script lang="ts">
  export let id: string;
  export let heading: string;
</script>

<section {id} class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start">
    <div class="max-w-md text-center">
      {#if heading}
        <h2 class="text-3xl font-bold">{heading}</h2>
      {/if}
      {#if $$slots.description}
        <p class="mb-6 py-6">
          <slot name="description" />
        </p>
      {/if}
    </div>
    <slot name="main" />
  </div>
</section>
