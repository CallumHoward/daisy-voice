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

  const categories = [
    { id: "audiobooks", title: "Audiobooks" },
    { id: "game", title: "Game" },
    { id: "animation", title: "Animation" },
    { id: "ivr", title: "IVR" },
  ] as const;

  const videoDemosRes = useQuery(data.videoDemos);

  $: ({ data: videoDemos } = $videoDemosRes);
  $: id = stegaClean(name).toLowerCase().replace(/\s/g, "-");

  type ViewTransitionDocument = Document & {
    startViewTransition?: (update: () => void) => {
      finished: Promise<void>;
    };
  };

  function demosFor(category: (typeof categories)[number]["id"]) {
    return (
      videoDemos?.filter((demo) => stegaClean(demo.category) === category) ?? []
    );
  }

  function enhanceCategoryChange(event: MouseEvent) {
    const input = event.currentTarget as HTMLInputElement;
    const viewTransitionDocument = document as ViewTransitionDocument;
    const startViewTransition =
      viewTransitionDocument.startViewTransition?.bind(document);

    if (
      input.checked ||
      !startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    event.preventDefault();

    const tabs = Array.from(
      input.parentElement?.querySelectorAll<HTMLInputElement>(
        'input[type="radio"]',
      ) ?? [],
    );
    const currentIndex = tabs.findIndex((tab) => tab.checked);
    const nextIndex = tabs.indexOf(input);
    const root = document.documentElement;
    const forwards = nextIndex > currentIndex;

    root.style.setProperty(
      "--showcase-enter-offset",
      forwards ? "1rem" : "-1rem",
    );
    root.style.setProperty(
      "--showcase-exit-offset",
      forwards ? "-1rem" : "1rem",
    );

    const transition = startViewTransition(() => {
      input.checked = true;
    });

    void transition.finished.finally(() => {
      root.style.removeProperty("--showcase-enter-offset");
      root.style.removeProperty("--showcase-exit-offset");
    });
  }

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

  <div
    class="tabs tabs-box showcase-tabs"
    role="tablist"
    aria-label="Video demo categories"
  >
    {#each categories as category, index (category.id)}
      <input
        id={`${id}-${category.id}`}
        class="tab"
        type="radio"
        name={`${id}-category`}
        value={category.id}
        aria-label={category.title}
        checked={index === 0}
        on:click={enhanceCategoryChange}
      />
    {/each}
  </div>

  <div class="showcase-grid">
    {#each categories as category (category.id)}
      <div
        class={`showcase-column showcase-column--${category.id}`}
        role="region"
        aria-labelledby={`${id}-${category.id}-heading`}
      >
        <h3
          id={`${id}-${category.id}-heading`}
          class="showcase-column-heading mb-4 text-center text-xl font-bold"
        >
          {category.title}
        </h3>

        <div class="showcase-carousel-mask">
          <div
            class="carousel carousel-vertical showcase-carousel"
            use:manageVideoControls
          >
            {#each demosFor(category.id) as { _id, title, url, poster } (_id)}
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
</section>

<style>
  .showcase-section {
    display: flex;
    flex-direction: column;
    padding: 4rem 1rem;
    width: 100%;
  }

  .showcase-tabs {
    align-self: center;
    margin-bottom: 2rem;
  }

  .showcase-grid {
    display: grid;
    margin-inline: auto;
    max-width: 96rem;
    width: 100%;
  }

  .showcase-column {
    display: none;
    grid-area: 1 / 1;
    min-width: 0;
  }

  .showcase-section:has(input[value="audiobooks"]:checked)
    .showcase-column--audiobooks,
  .showcase-section:has(input[value="game"]:checked) .showcase-column--game,
  .showcase-section:has(input[value="animation"]:checked)
    .showcase-column--animation,
  .showcase-section:has(input[value="ivr"]:checked) .showcase-column--ivr {
    animation: reveal-category 240ms ease-out;
    display: block;
    view-transition-name: showcase-category;
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
    overflow: hidden;
  }

  .showcase-video {
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  @keyframes reveal-category {
    from {
      opacity: 0;
      transform: translateX(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-category-out {
    to {
      opacity: 0;
      transform: translateX(var(--showcase-exit-offset, -1rem));
    }
  }

  @keyframes slide-category-in {
    from {
      opacity: 0;
      transform: translateX(var(--showcase-enter-offset, 1rem));
    }
  }

  :global(::view-transition-old(showcase-category)) {
    animation: slide-category-out 240ms ease-in both;
  }

  :global(::view-transition-new(showcase-category)) {
    animation: slide-category-in 240ms ease-out both;
  }

  @media (min-width: 64rem) {
    .showcase-section {
      padding-inline: 2rem;
    }

    .showcase-tabs {
      display: none;
    }

    .showcase-grid {
      column-gap: 1.5rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .showcase-column {
      display: block;
      grid-area: auto;
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
    }
  }
</style>
