<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import { stegaClean } from "@sanity/client/stega";
  import { PortableText } from "@portabletext/svelte";
  import type { BlockContent } from "$lib/sanity/generated-types";
  import InlineImage from "../../components/InlineImage.svelte";
  import type { PageData } from "../$types";
  import { urlFor } from "$lib/sanity/image";

  export let name: string;
  export let heading: string | undefined;
  export let content: BlockContent | undefined;
  export let data: PageData;

  const videoDemoCategoriesRes = useQuery(data.videoDemoCategories);

  $: ({ data: categories } = $videoDemoCategoriesRes);
  $: id = stegaClean(name).toLowerCase().replace(/\s/g, "-");

  function pauseOtherVideos(event: Event) {
    const currentVideo = event.currentTarget as HTMLVideoElement;
    const showcase = currentVideo.closest(".showcase-section");

    showcase?.querySelectorAll("video").forEach((video) => {
      if (video !== currentVideo) {
        video.pause();
      }
    });
  }

  function setActiveVideo(
    carousel: HTMLElement,
    activeVideo: HTMLVideoElement,
  ) {
    carousel.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
      const isActive = video === activeVideo;

      video.controls = isActive;

      if (!isActive) {
        video.pause();
      }
    });
  }

  function activateCard(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const video = card.querySelector<HTMLVideoElement>("video");
    const carousel = card.closest<HTMLElement>(".showcase-carousel");

    if (!video || !carousel) {
      return;
    }

    const cardBounds = card.getBoundingClientRect();
    const carouselBounds = carousel.getBoundingClientRect();
    const offset =
      cardBounds.top -
      carouselBounds.top +
      carousel.scrollTop -
      (carousel.clientHeight - cardBounds.height) / 2;

    setActiveVideo(carousel, video);

    carousel.scrollTo({
      top: offset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  function manageVideoControls(carousel: HTMLElement) {
    let updateTimer: ReturnType<typeof setTimeout> | undefined;

    function updateControls() {
      updateTimer = undefined;

      const carouselBounds = carousel.getBoundingClientRect();
      const snapPosition = carouselBounds.top + carousel.clientHeight / 2;
      const cards = Array.from(
        carousel.querySelectorAll<HTMLElement>(".showcase-card"),
      );
      const activeCard = cards.reduce<HTMLElement | undefined>(
        (closest, card) => {
          const cardBounds = card.getBoundingClientRect();
          const cardCenter = cardBounds.top + cardBounds.height / 2;

          if (!closest) {
            return card;
          }

          const closestBounds = closest.getBoundingClientRect();
          const closestCenter = closestBounds.top + closestBounds.height / 2;

          return Math.abs(cardCenter - snapPosition) <
            Math.abs(closestCenter - snapPosition)
            ? card
            : closest;
        },
        undefined,
      );
      const activeVideo = activeCard?.querySelector<HTMLVideoElement>("video");

      if (activeVideo) {
        setActiveVideo(carousel, activeVideo);
      }
    }

    function scheduleUpdate() {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(updateControls, 100);
    }

    const mutationObserver = new MutationObserver(scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);

    carousel.addEventListener("scroll", scheduleUpdate, { passive: true });
    mutationObserver.observe(carousel, { childList: true, subtree: true });
    resizeObserver.observe(carousel);
    updateControls();

    return {
      destroy() {
        carousel.removeEventListener("scroll", scheduleUpdate);
        mutationObserver.disconnect();
        resizeObserver.disconnect();

        clearTimeout(updateTimer);
      },
    };
  }
</script>

<section {id} class="showcase-section" aria-label={heading ?? "Video demos"}>
  {#if heading}
    <h2 class="mb-16 text-center text-3xl font-bold">{heading}</h2>
  {/if}

  {#if content}
    <div class="mx-auto mb-8 max-w-3xl text-center">
      <PortableText
        components={{ types: { image: InlineImage } }}
        value={content}
      />
    </div>
  {/if}

  {#if categories?.length}
    <div
      class="tabs tabs-box showcase-grid"
      style={`--showcase-category-count: ${categories.length}`}
      role="radiogroup"
      aria-label="Video demo categories"
    >
      {#each categories as category, index (category._id)}
        {@const categoryId = `${id}-${category._id}`}
        <input
          id={categoryId}
          class="tab showcase-category-tab"
          type="radio"
          name={`${id}-category`}
          value={category._id}
          aria-label={category.title}
          aria-controls={`${categoryId}-panel`}
          checked={index === 0}
        />
        <div
          id={`${categoryId}-panel`}
          class="showcase-column"
          role="region"
          aria-labelledby={`${categoryId}-heading`}
        >
          <h3
            id={`${categoryId}-heading`}
            class="showcase-column-heading mb-4 text-center text-xl font-bold"
          >
            {category.title}
          </h3>

          <div class="showcase-carousel-mask">
            <div
              class="carousel carousel-vertical showcase-carousel"
              use:manageVideoControls
            >
              {#each category.demos as { _id, title, url, poster } (_id)}
                {@const posterUrl = poster?.asset
                  ? urlFor(poster).width(1200).auto("format").url()
                  : undefined}
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
                <article
                  class="carousel-item showcase-card"
                  on:click={activateCard}
                >
                  <div class="showcase-video-frame">
                    <!-- svelte-ignore a11y-media-has-caption -->
                    <video
                      class="showcase-video"
                      src={url}
                      poster={posterUrl}
                      aria-label={title}
                      controls
                      playsinline
                      preload="metadata"
                      on:play={pauseOtherVideos}
                    >
                      Your browser does not support embedded video.
                    </video>
                  </div>
                  <button
                    type="button"
                    class="block w-full cursor-pointer truncate px-1 pt-3 text-left text-sm font-medium"
                  >
                    {title}
                  </button>
                </article>
              {:else}
                <p class="py-8 text-sm opacity-60">No videos yet.</p>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="py-8 text-center text-sm opacity-60">No video categories yet.</p>
  {/if}
</section>

<style>
  .showcase-section {
    display: flex;
    flex-direction: column;
    padding: 4rem 1rem;
    width: 100%;
  }

  .showcase-grid {
    --showcase-enter-delay: 160ms;
    --showcase-enter-duration: 200ms;
    --showcase-exit-duration: 120ms;

    background-color: transparent;
    border-radius: 0;
    display: grid;
    grid-auto-flow: row;
    margin-inline: auto;
    max-width: 96rem;
    padding: 0;
    position: relative;
    width: 100%;
  }

  .showcase-column {
    min-width: 0;
  }

  .showcase-column-heading {
    display: none;
  }

  .showcase-carousel-mask {
    inline-size: min(100%, 28rem, 55svh);
    margin-inline: auto;
    overflow: hidden;
    position: relative;
  }

  .showcase-carousel-mask::before,
  .showcase-carousel-mask::after {
    content: "";
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    z-index: 1;
  }

  .showcase-carousel-mask::before {
    background: linear-gradient(to bottom, var(--color-base-100), transparent);
    height: 5rem;
    top: 0;
  }

  .showcase-carousel-mask::after {
    background: linear-gradient(to bottom, transparent, var(--color-base-100));
    bottom: 0;
    height: 5rem;
  }

  .showcase-carousel {
    --showcase-boundary-padding: max(
      0px,
      min(calc(20% + 1.6rem), calc((48rem - 100% - 3rem) / 2))
    );

    aspect-ratio: 1 / 1.69;
    block-size: auto;
    inline-size: 100%;
    max-block-size: 48rem;
    overflow-y: auto;
    padding-block: var(--showcase-boundary-padding);
    row-gap: 1rem;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
  }

  .showcase-carousel::-webkit-scrollbar {
    display: none;
  }

  .showcase-card {
    display: block;
    flex: none;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    width: 100%;
    padding-bottom: 1rem;
  }

  .showcase-video-frame {
    aspect-ratio: 1 / 1;
    background: var(--color-base-300);
    border-radius: var(--radius-box);
    outline: 1px solid rgba(0, 0, 0, 0.1);
    outline-offset: -1px;
    overflow: hidden;
  }

  .showcase-video {
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  @media (max-width: 63.999rem) {
    .showcase-grid {
      grid-template-columns: repeat(
        var(--showcase-category-count),
        minmax(0, 1fr)
      );
      max-width: 28rem;
      overflow: hidden;
    }

    .showcase-grid::before {
      background-color: var(--color-base-200);
      border-radius: var(--radius-field);
      block-size: 2.5rem;
      content: "";
      inset: 0 0 auto;
      position: absolute;
    }

    .showcase-category-tab {
      grid-row: 1;
      min-width: 0;
      width: 100%;
      z-index: 1;
    }

    .showcase-column {
      display: block;
      grid-column: 1 / -1;
      grid-row: 2;
      margin-top: 2rem;
      opacity: 0;
      pointer-events: none;
      transform: translateX(0.75rem);
      transition:
        opacity var(--showcase-exit-duration) ease-in,
        transform var(--showcase-exit-duration) ease-in,
        visibility 0s linear var(--showcase-exit-duration);
      visibility: hidden;
    }

    .showcase-category-tab {
      transition:
        background-color 150ms cubic-bezier(0.2, 0, 0, 1),
        color 150ms cubic-bezier(0.2, 0, 0, 1),
        scale 150ms cubic-bezier(0.2, 0, 0, 1);
    }

    .showcase-category-tab:active {
      scale: 0.96;
    }

    .showcase-column:has(~ .showcase-category-tab:checked) {
      transform: translateX(-0.75rem);
    }

    .showcase-category-tab:checked + .showcase-column {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(0);
      transition:
        opacity var(--showcase-enter-duration) cubic-bezier(0.2, 0, 0, 1)
          var(--showcase-enter-delay),
        transform var(--showcase-enter-duration) cubic-bezier(0.2, 0, 0, 1)
          var(--showcase-enter-delay),
        visibility 0s linear var(--showcase-enter-delay);
      visibility: visible;
      z-index: 1;
    }
  }

  @media (min-width: 64rem) {
    .showcase-section {
      padding-inline: 2rem;
    }

    .showcase-category-tab,
    .showcase-grid::before {
      display: none;
    }

    .showcase-grid {
      column-gap: 1.5rem;
      grid-template-columns: repeat(
        var(--showcase-category-count),
        minmax(0, 1fr)
      );
    }

    .showcase-column {
      display: block;
      grid-area: auto;
      margin-top: 0;
    }

    .showcase-column-heading {
      display: block;
    }

    .showcase-carousel-mask {
      inline-size: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .showcase-section * {
      animation: none !important;
      scroll-behavior: auto;
      transition: none !important;
    }
  }
</style>
