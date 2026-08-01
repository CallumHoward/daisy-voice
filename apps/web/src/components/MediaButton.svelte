<script lang="ts">
  export let audioSrc: string;

  let playing = false;
  let progress = 0;
  let audio: HTMLAudioElement;

  function handleTimeUpdate() {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
      progress = 0;
      return;
    }

    progress = Math.min(
      100,
      Math.max(0, (audio.currentTime / audio.duration) * 100),
    );
  }

  function handlePlay() {
    playing = true;
  }

  function handlePause() {
    playing = false;
  }

  function handleEnded() {
    playing = false;
    progress = 0;
  }

  function togglePlay() {
    if (audio) {
      if (playing) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  }
</script>

<audio
  hidden
  bind:this={audio}
  src={audioSrc}
  on:timeupdate={handleTimeUpdate}
  on:play={handlePlay}
  on:pause={handlePause}
  on:ended={handleEnded}
  preload="metadata"
></audio>

<button
  class="btn btn-circle btn-ghost"
  on:click={togglePlay}
  aria-label={playing ? "Pause track" : "Play track"}
>
  <span class="media-icon-stack" aria-hidden="true">
    <span class:media-icon-hidden={playing} class="media-icon">
      <svg
        class="size-[1.2em]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2"
          fill="none"
          stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g
        >
      </svg>
    </span>
    <span class:media-icon-hidden={!playing} class="media-icon">
      <span
        class="radial-progress"
        style="--value:{progress}; --size:2rem;"
        aria-valuenow={progress}
        role="progressbar"
      >
        <svg
          class="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
            ><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></g
          >
        </svg>
      </span>
    </span>
  </span>
</button>

<style>
  .media-icon-stack {
    display: grid;
    place-items: center;
  }

  .media-icon {
    filter: blur(0);
    grid-area: 1 / 1;
    opacity: 1;
    scale: 1;
    transition:
      filter 300ms cubic-bezier(0.2, 0, 0, 1),
      opacity 300ms cubic-bezier(0.2, 0, 0, 1),
      scale 300ms cubic-bezier(0.2, 0, 0, 1);
  }

  .media-icon-hidden {
    filter: blur(4px);
    opacity: 0;
    scale: 0.25;
  }

  @media (prefers-reduced-motion: reduce) {
    .media-icon {
      transition: none;
    }
  }
</style>
