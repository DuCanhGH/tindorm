<script lang="ts">
    import StarFraction from "./Star.svelte";

    let { reviews } = $props();

</script>

<section class="mx-auto w-full max-w-6xl px-4 py-8">
    <h2 class="mb-4 text-xl font-semibold text-gray-900">Reviews</h2>
    <div class="flex items-center gap-0.5 justify-center">
      {#each Array(4) as _, i}
        <StarFraction size="6" fraction={1} />
      {/each} 
      <StarFraction size="6" fraction={0.34} />
      <div class="text-center ml-2 text-4xl font-medium text-gray-900">4/5</div>
    </div>
    <ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each reviews as r}
        <li class="rounded-2xl bg-white p-4 shadow ring-1 ring-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex items-center gap-0.5">
              {#each Array(5) as _, i}
                <StarFraction fraction={1} />
              {/each} 
            </div>
            <p class="text-sm font-medium text-gray-900">{r.user}</p>
          </div>
          <p class="mt-2 text-sm text-gray-700">{r.text}</p>
        </li>
      {/each}
    </ul>
</section>