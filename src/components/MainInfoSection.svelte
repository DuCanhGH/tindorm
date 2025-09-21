<script lang="ts">

    import { onMount } from "svelte";
    let { images = [] as string[], paragraphs = [] as {title: string, content: string}[] } = $props();

    let sectionEl: HTMLElement | null = null;
    let textEl: HTMLDivElement | null = null;
  
    // slideshow state
    let i = $state(0);
    let dragging = $state(false);
    let startX = 0;
    let dx = $state(0);
    let hovering = $state(false);
    let timer: number | null = null;
  
    function clamp(n: number, min: number, max: number) {
      return Math.max(min, Math.min(max, n));
    }
  
    function onDown(e: PointerEvent) {
      dragging = true;
      startX = e.clientX;
      (e.target as Element).setPointerCapture(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      dx = e.clientX - startX;
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      const threshold = 80;
      if (dx < -threshold && i < images.length - 1) i++;
      if (dx > threshold && i > 0) i--;
      dx = 0;
    }
  
    function next() {
      i = clamp(i + 1, 0, images.length - 1);
    }
    function prev() {
      i = clamp(i - 1, 0, images.length - 1);
    }

    function startAutoplay() {
      if (timer != null) clearInterval(timer);
      if (images.length <= 1) return;
      timer = window.setInterval(() => {
        if (!dragging && !hovering) {
          i = (i + 1) % images.length;
        }
      }, 3000);
    }
  
    // scroll-sync right panel with page scroll within this section
    function onScroll() {
      if (!sectionEl || !textEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const vh = window.innerHeight;
  
      const start = rect.top + window.scrollY - 80; // start syncing slightly before
      const end = start + Math.max(0, sectionEl.offsetHeight - vh);
      const y = window.scrollY;
      const t = clamp((y - start) / Math.max(1, end - start), 0, 1);
  
      const maxScroll = textEl.scrollHeight - textEl.clientHeight;
      textEl.scrollTop = maxScroll * t;
    }
  
    onMount(() => {
        window.addEventListener("scroll", onScroll, { passive: true });
        startAutoplay();
        return () => {
          window.removeEventListener("scroll", onScroll);
          if (timer != null) clearInterval(timer);
        };
    });
  </script>
  
  <section bind:this={sectionEl} class="mx-auto h-[70vh] my-12 w-full max-w-6xl gap-8 px-4 flex flex-row justify-between items-center">
    <!-- Left: swipe-like slideshow -->
    <div class="relative h-[70vh] w-1/2 min-h-full select-none overflow-hidden rounded-2xl bg-black/5"
         onpointerenter={() => hovering = true}
         onpointerleave={() => hovering = false}>
        <div
            class="absolute inset-0 h-full"
            style="
            transform: translateX(calc((-100% * {i}) + {dx}px));
            transition: {dragging ? 'none' : 'transform 220ms cubic-bezier(.2,.7,.2,1)'};
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: 100%;
            "
            onpointerdown={onDown}
            onpointermove={onMove}
            onpointerup={onUp}
            onpointercancel={onUp}
            onpointerleave={onUp}
        >
            {#each images as src (src)}
            <div class="relative h-full w-full">
                <img src={src} alt="" class="h-full w-full object-cover" draggable="false" />
            </div>
            {/each}
        </div>
  
      <!-- controls -->
        <div class="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {#each images as _, idx}
                <span class="h-1 w-8 rounded-full {idx === i ? 'bg-white' : 'bg-white/40'}"></span>
            {/each}
        </div>
        <div class="absolute inset-y-0 left-0 flex items-center">
            <button class="m-2 rounded-full bg-white/80 px-3 py-2 shadow hover:bg-white" onpointerdown={prev}>‹</button>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center">
            <button class="m-2 rounded-full bg-white/80 px-3 py-2 shadow hover:bg-white" onpointerdown={next}>›</button>
        </div>
    </div>
  
    <!-- Right: sticky, snap-scrolling full-height slides -->
    <div class="top-24 w-1/2">
        <div
        bind:this={textEl}
        class="h-[70vh] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow snap-y snap-mandatory"
        >
        {#each paragraphs as s}
            <div class="max-w-prose min-h-[70vh] flex flex-col justify-center text-center snap-start">
                <h3 class="mb-2 text-2xl font-semibold">{s.title}</h3>
                <p class="text-gray-700 leading-relaxed">{s.content}</p>
            </div>
        {/each}
        </div>
    </div>
</section>