<!-- src/components/TweetTicker.svelte -->
<script lang="ts">
    type Tweet = { id: string; name: string; handle: string; avatar: string; text: string; time?: string };
    let { items = [] as Tweet[], speed = 28 } = $props();
  
    const DEFAULT: Tweet[] = [
        { id: "1", name: "Alex", handle: "@alex", avatar: "favicon.ico", text: "Found my dream roommate in a week. Wild." },
        { id: "2", name: "Sam", handle: "@sam", avatar: "favicon.ico", text: "The swipe UX is surprisingly clean." },
        { id: "3", name: "Riley", handle: "@riley", avatar: "favicon.ico", text: "Matching by habits > matching by vibes." },
        { id: "4", name: "Jordan", handle: "@jordan", avatar: "favicon.ico", text: "Filtering by quiet hours is clutch." },
        { id: "5", name: "Taylor", handle: "@taylor", avatar: "favicon.ico", text: "I sleep with my dormmate." }
    ];
  
    const list = $derived(items.length ? items : DEFAULT);
    let hovering = $state(false);
  </script>
  
  <style>
    @keyframes ticker {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .track {
      animation: ticker var(--speed, 28s) linear infinite;
      will-change: transform;
    }
</style>
  
<div class="w-full overflow-hidden py-4 relative z-10">
    <div
      class="relative mx-auto w-full max-w-5xl"
      onpointerenter={() => (hovering = true)}
      onpointerleave={() => (hovering = false)}
    >
      <div
        class="track flex gap-4"
        style={`--speed:${speed}s; animation-play-state:${hovering ? "paused" : "running"};`}
      >
        {#each [0, 1] as dup}
          {#each list as t (t.id + "-" + dup)}
            <article class="min-w-[300px] max-w-[360px] rounded-2xl bg-white/90 p-3 text-sm text-gray-900 shadow ring-1 ring-gray-100 backdrop-blur">
              <div class="mb-2 flex items-center gap-2">
                <img src={t.avatar} alt="" class="h-8 w-8 rounded-full object-cover" />
                <div class="min-w-0">
                  <p class="truncate text-[13px] font-semibold">{t.name}</p>
                  <p class="truncate text-[12px] text-gray-500">{t.handle}</p>
                </div>
              </div>
              <p class="leading-snug">{t.text}</p>
            </article>
          {/each}
        {/each}
      </div>
    </div>
  </div>