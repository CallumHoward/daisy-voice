<script lang="ts">
  export let audioSrc: string;

  let playing = false;
  let progress = 0;
  let audio: HTMLAudioElement;

  function handleTimeUpdate() {
    if (audio) {
      progress = (audio.currentTime / audio.duration) * 100;
    }
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
/>

<button class="btn btn-square btn-ghost" on:click={togglePlay}>
  {#if playing}
    <div
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
          stroke="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></g
        >
      </svg>
    </div>
  {:else}
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
  {/if}
</button>
