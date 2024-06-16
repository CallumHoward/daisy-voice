<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import type { ActionData, PageData } from "./$types";
  import TestimonialCard from "../components/TestimonialCard.svelte";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";
  import SoundCloudTrack from "../components/SoundCloudTrack.svelte";
  import TextArea from "../components/TextArea.svelte";
  import { enhance } from "$app/forms";

  export let form: ActionData;
  export let data: PageData;

  const testimonialsRes = useQuery(data.testimonials);
  const tracksRes = useQuery(data.tracks);

  $: ({ data: testimonials } = $testimonialsRes);
  $: ({ data: tracks } = $tracksRes);
</script>

<section id="intro" class="hero aspect-square max-h-screen bg-base-200">
  <div class="hero-content max-w-lg text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Need a Voice Artist?</h1>
      <p class="mb-6 py-6">
        Hi, my name is Heather, and I'm available for any type of voice over;
        audio books, commercials, video games, and more.
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

<section id="testimonials" class="min-h-[50dvh]">
  <div class="hero-content flex-col justify-start overflow-hidden">
    <h2 class="mb-16 text-center text-3xl font-bold">Studio Specs</h2>
    <table class="table">
      <tr>
        <th>Mic</th>
        <td>RODE NT1</td>
      </tr>
      <tr>
        <th>Software</th>
        <td>Audacity</td>
      </tr>
      <tr>
        <th>Hardware</th>
        <td>Macbook pro</td>
      </tr>
      <tr>
        <th>Live Directed Session</th>
        <td>Zoom, Discord or other readily available program</td>
      </tr>
      <tr>
        <th>Booth</th>
        <td>Sound treated home studio</td>
      </tr>
    </table>
  </div>
</section>

<section id="contact" class="min-h-[50dvh] bg-base-200">
  <div class="hero-content flex-col justify-start">
    <div class="max-w-md text-center">
      <h2 class="text-3xl font-bold">Contact</h2>
      <p class="mb-6 py-6">
        {#if !form?.success}
          Make an enquiry and I'll get back to you ASAP!
        {:else}
          Thanks for reaching out! I'll get back to you soon.
        {/if}
      </p>
    </div>
    {#if !form?.success}
      <form method="POST" use:enhance class="form-control w-full gap-4">
        <span class="form-control gap-4 sm:flex-row">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            autocomplete="given-name"
            required
            class="input input-primary"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            autocomplete="family-name"
            class="input input-primary"
          />
        </span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
          maxlength="64"
          required
          class="input input-primary"
        />
        <TextArea
          name="message"
          placeholder="Message"
          required
          minRows={5}
          maxRows={10}
        />
        <button type="submit" class="btn btn-primary w-fit uppercase"
          >Send</button
        >
        {#if form?.missing}
          <div role="alert" class="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              /></svg
            >
            <span>Required fields are missing</span>
          </div>
        {:else if form && !form.success}
          <div role="alert" class="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <span>Something went wrong, please try again later.</span>
          </div>
        {/if}
      </form>
    {:else}
      <div role="alert" class="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>Your message has been sent!</span>
      </div>
    {/if}
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
