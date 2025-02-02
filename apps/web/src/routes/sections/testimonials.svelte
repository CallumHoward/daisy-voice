<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import TestimonialCard from "../../components/TestimonialCard.svelte";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";
  import type { PageData } from "../$types";

  export let name: string;
  export let data: PageData;

  const testimonialsRes = useQuery(data.testimonials);

  $: ({ data: testimonials } = $testimonialsRes);
  $: id = name.toLowerCase().replace(/\s/g, "-");
</script>

<section {id} class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start overflow-hidden">
    <h2 class="mb-16 text-center text-3xl font-bold">Testimonials</h2>
    {#if testimonials?.length}
      <div class="carousel w-full gap-8 px-4">
        {#each testimonials as testimonial}
          <div class="carousel-item">
            <TestimonialCard
              rating={testimonial.rating}
              avatarSrc={testimonial.avatarSrc
                ? urlFor(testimonial.avatarSrc).url()
                : ""}
              name={testimonial.name}
              from={testimonial.from}
            >
              <PortableText components={{}} value={testimonial.content} />
            </TestimonialCard>
          </div>
        {/each}
      </div>
    {:else}
      No testimonials yet
    {/if}
  </div>
</section>
