<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import type { PageData } from "./$types";
  import TestimonialCard from "../components/TestimonialCard.svelte";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";
  import SoundCloudTrack from "../components/SoundCloudTrack.svelte";
  import TextArea from "../components/TextArea.svelte";

  export let data: PageData;
  const testimonialsRes = useQuery(data.testimonials);
  const tracksRes = useQuery(data.tracks);

  $: ({ data: testimonials } = $testimonialsRes);
  $: ({ data: tracks } = $tracksRes);
</script>

<section id="intro" class="hero aspect-square max-h-screen bg-base-200">
  <div class="hero-content max-w-lg text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Need a Vocal Artist?</h1>
      <p class="mb-6 py-6">
        Hi, my name is Heather, and I specialize in voice overs for commercials,
        video games, and more.
      </p>
      <a href="#contact" class="btn btn-primary uppercase">Contact</a>
    </div>
  </div>
</section>

<section id="demos" class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start overflow-hidden text-center">
    <h2 class="mb-16 text-center text-3xl font-bold">Demos</h2>
    {#if tracks?.length}
      <div class="carousel w-full gap-8 px-4">
        {#each tracks as { title, share, embed }}
          <div class="carousel-item w-[348px]">
            <SoundCloudTrack {title} {share} {embed} />
          </div>
        {/each}
      </div>
    {:else}
      No demos yet
    {/if}
  </div>
</section>

<section id="testimonials" class="min-h-[50dvh] bg-base-200">
  <div class="hero-content flex-col justify-start overflow-hidden">
    <h2 class="mb-16 text-center text-3xl font-bold">Testimonials</h2>
    {#if testimonials?.length}
      <div class="carousel w-full gap-8 px-4">
        {#each testimonials as testimonial}
          <div class="carousel-item">
            <TestimonialCard
              rating={5}
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

<section id="contact" class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start">
    <div class="max-w-md text-center">
      <h2 class="text-3xl font-bold">Contact</h2>
      <p class="mb-6 py-6">Make an enquiry and I'll get back to you ASAP!</p>
    </div>
    <form class="form-control w-full gap-4">
      <span class="form-control gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="First Name"
          autocomplete="given-name"
          class="input input-primary"
        />
        <input
          type="text"
          placeholder="Last Name"
          autocomplete="family-name"
          class="input input-primary"
        />
      </span>
      <input
        type="email"
        placeholder="Email"
        autocomplete="email"
        class="input input-primary"
      />
      <TextArea placeholder="Message" minRows={5} maxRows={10} />
      <button type="submit" class="btn btn-primary w-fit uppercase">Send</button
      >
    </form>
  </div>
</section>

<style>
  section {
    padding-block: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
