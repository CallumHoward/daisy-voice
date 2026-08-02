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

<section
  {id}
  class="showcase-section flex w-full flex-col px-4 py-16 lg:px-8"
  aria-label={heading ?? "Video demos"}
>
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
    <div class="flex w-full justify-center">
      <div
        class="tabs tabs-box showcase-grid"
        style:--showcase-category-count={categories.length}
        role="radiogroup"
        aria-label="Video demo categories"
      >
        {#each categories as category, index (category._id)}
          {@const categoryId = `${id}-${category._id}`}
          <input
            id={categoryId}
            class="tab showcase-category-tab max-lg:z-[1] max-lg:row-start-1 max-lg:w-full lg:hidden"
            type="radio"
            name={`${id}-category`}
            value={category._id}
            aria-label={category.title}
            aria-controls={`${categoryId}-panel`}
            checked={index === 0}
          />
          <div
            id={`${categoryId}-panel`}
            class="showcase-column col-span-full row-start-2 mt-8 block min-w-0 lg:col-auto lg:row-auto lg:mt-0"
            role="region"
            aria-labelledby={`${categoryId}-heading`}
          >
            <h3
              id={`${categoryId}-heading`}
              class="mb-4 hidden text-center text-xl font-bold lg:block"
            >
              {category.title}
            </h3>

            <div
              class="showcase-carousel-mask relative mx-auto w-[min(100%,28rem,55svh)] overflow-hidden lg:w-full"
            >
              <div
                class="carousel carousel-vertical showcase-carousel aspect-[1/1.69] h-auto max-h-[48rem] w-full snap-y snap-mandatory gap-y-4 overflow-y-auto [scrollbar-width:none]"
                use:manageVideoControls
              >
                {#each category.demos as { _id, title, url, poster } (_id)}
                  {@const posterUrl = poster?.asset
                    ? urlFor(poster).width(1200).auto("format").url()
                    : undefined}
                  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
                  <article
                    class="carousel-item showcase-card block w-full flex-none snap-center pb-4 [scroll-snap-stop:always]"
                    on:click={activateCard}
                  >
                    <div
                      class="aspect-square overflow-hidden rounded-box bg-base-300 -outline-offset-1 outline [outline-color:rgba(0,0,0,0.1)]"
                    >
                      <!-- svelte-ignore a11y-media-has-caption -->
                      <video
                        class="block h-full w-full object-cover"
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
    </div>
  {:else}
    <p class="py-8 text-center text-sm opacity-60">No video categories yet.</p>
  {/if}
</section>

<style>
  .showcase-grid {
    --showcase-enter-delay: 160ms;
    --showcase-enter-duration: 200ms;
    --showcase-exit-duration: 120ms;

    background-color: transparent;
    border-radius: 0;
    display: grid;
    grid-auto-flow: row;
    max-width: 96rem;
    padding: 0;
    position: relative;
    width: 100%;
  }

  .showcase-carousel-mask {
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      black 5rem,
      black calc(100% - 5rem),
      transparent
    );
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 5rem,
      black calc(100% - 5rem),
      transparent
    );
  }

  .showcase-carousel {
    --showcase-boundary-padding: max(
      0px,
      min(calc(20% + 1.6rem), calc((48rem - 100% - 3rem) / 2))
    );

    padding-block: var(--showcase-boundary-padding);
  }

  .showcase-carousel::-webkit-scrollbar {
    display: none;
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

    .showcase-column {
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
      min-width: 0;
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
  }

  @media (prefers-reduced-motion: reduce) {
    .showcase-section * {
      animation: none !important;
      scroll-behavior: auto;
      transition: none !important;
    }
  }
</style>
