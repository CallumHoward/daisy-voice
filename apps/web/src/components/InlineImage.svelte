<script>
  import { urlFor } from "$lib/sanity/image";
  export let portableText;
</script>

<img src={urlFor(portableText.value).url()} alt="" />
