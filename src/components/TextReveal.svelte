<script lang="ts">
    import { onMount, onDestroy } from "svelte";
  
    let { text = "Find your match", subtext = "Swipe right on great conversations." } = $props();
  
    let el: HTMLElement | null = null;
    let visible = $state(false);
    let io: IntersectionObserver | null = null;
  
    onMount(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible = true;
            io?.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      if (el) io.observe(el);
    });
  
    onDestroy(() => io?.disconnect());
  </script>
  
  <section class="mx-auto max-w-5xl px-4 py-12">
    <h2
      class={`text-center text-4xl md:text-6xl font-extrabold
        bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400
        bg-clip-text text-transparent
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style="filter: drop-shadow(0 0 16px rgba(236, 72, 153, 0.45));"
    >
      {text}
    </h2>
  
    <p bind:this={el} 
      class={`mt-3 text-center text-gray-600
        transition-all duration-700 ease-out delay-150
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      {subtext}
    </p>
  </section>