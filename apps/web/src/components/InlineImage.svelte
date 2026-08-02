<script>
  import { urlFor } from "$lib/sanity/image";
  export let portableText;
</script>

<img class="mx-auto" src={urlFor(portableText.value).url()} alt="" />
