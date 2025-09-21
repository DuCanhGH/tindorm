<script lang="ts">
    import { onDestroy } from "svelte";
    import { notify, type Notice } from "$lib/store/notify";
    let items: Notice[] = $state([]);
    const unsub = notify.subscribe((v) => (items = v));
    onDestroy(() => unsub());
  </script>
  
  <div class="pointer-events-none fixed right-4 top-4 z-[90] space-y-2">
    {#each items as n (n.id)}
      <div class="pointer-events-auto rounded-xl px-4 py-2 shadow text-white"
           class:bg-gray-900={!n.type || n.type === 'info'}
           class:bg-green-600={n.type === 'success'}
           class:bg-rose-600={n.type === 'error'}>
        {n.text}
      </div>
    {/each}
  </div>