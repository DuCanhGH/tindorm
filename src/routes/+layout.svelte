<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href=lib/assets/4-removebg-preview.png />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
</svelte:head>

{@render children?.()}
