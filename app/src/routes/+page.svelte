<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import Card from "../components/Card.svelte";
  // import Welcome from "../components/Welcome.svelte";
  import type { PageData } from "./$types";
  import TestimonialCard from "../components/TestimonialCard.svelte";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";

  export let data: PageData;
  const postsRes = useQuery(data.posts);
  const testimonialsRes = useQuery(data.testimonials);

  $: ({ data: posts } = $postsRes);
  $: ({ data: testimonials } = $testimonialsRes);
</script>

<section id="into" class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Need a Vocal Artist?</h1>
      <p class="py-6">
        Hi, my name is Heather, and I specialize in voice overs for commercials,
        video games, and more.
      </p>
      <a href="#contact" class="btn btn-primary uppercase">Contact</a>
    </div>
  </div>
</section>

<section>
  {#if posts?.length}
    {#each posts as post}
      <Card {post} />
    {/each}
  {:else}
    No posts yet.
  {/if}
</section>

<section class="bg-base-200">
  <div class="hero-content flex-col text-center">
    <h2 class="text-3xl font-bold">Testimonials</h2>
    <p class="py-6">Hear what my clients have to say about my work.</p>
  </div>
  <div class="carousel mx-4 w-dvw gap-8 rounded-box">
    {#if testimonials?.length}
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
    {:else}
      No testimonials yet
    {/if}
  </div>
</section>

<section id="contact">
  <div class="hero-content text-center">
    <h2 class="text-3xl font-bold">Contact</h2>
    <p class="py-6">Make an enquiry and I'll get back to you ASAP!</p>
    <form class="form-control">
      <input type="text" placeholder="Name" class="input input-primary" />
      <input type="email" placeholder="Email" class="input input-primary" />
      <textarea placeholder="Message" class="textarea textarea-primary"
      ></textarea>
      <button class="btn btn-primary">Send</button>
    </form>
  </div>
</section>

<style>
  section {
    padding-block: 4rem;
  }
</style>
