<script lang="ts">
  export let value = "";
  export let minRows = 1;
  export let maxRows: number | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let className = "textarea textarea-primary";
  export let lineHeight = 2;

  $: minHeight = `${1 + minRows * lineHeight}em`;
  $: maxHeight = maxRows ? `${1 + maxRows * lineHeight}em` : `auto`;
</script>

<div class="container">
  <pre
    aria-hidden="true"
    class={className}
    style="min-height: {minHeight}; max-height: {maxHeight}; line-height: {lineHeight}">{value +
      "\n"}</pre>

  <textarea class={className} bind:value {placeholder}></textarea>
</div>

<style>
  .container {
    position: relative;
  }

  pre,
  textarea {
    font-family: inherit;
    font-weight: inherit;
    box-sizing: border-box;
    overflow: hidden;
  }

  textarea {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    resize: none;
  }
</style>
