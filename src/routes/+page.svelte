<script lang="ts">
  import { Spring } from "svelte/motion";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import MainInfoSection from "../components/MainInfoSection.svelte";
  import TextReveal from "../components/TextReveal.svelte";
  import TwitterTemplate from "../components/TwitterTemplate.svelte";
  import Footer from "../components/Footer.svelte";
  import type { PageLoad } from "./$types";
  import FrontBalls from "../components/FrontBalls.svelte";
  let { data }: { data: import("./$types").PageData } = $props();

  import { authClient } from "$lib/auth";

  const imgs = [
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1470&auto=format&fit=crop",
  ];

  const paras = [
    {
      title: "Why use tindorm?.",
      content: "Finding a dormmate should be easy. But it's not. So we made it easier.",
    },
    {
      title: "How it works.",
      content: "We'll help you find a dormmate by showing you profiles of other students who are looking for a dormmate.",
    },
    {
      title: "Who can use tindorm?",
      content: "Anyone who is looking for a dormmate! Including Me!",
    },
  ];

  type Profile = {
    id: string;
    name: string;
    age: number;
    bio: string;
    image: string;
  };

  const profiles = $state<Profile[]>(data.profiles as Profile[]);

  let dragging = $state(false);
  let activeId = $derived(profiles.at(-1)?.id);

  const x = new Spring(0, { stiffness: 0.15, damping: 0.4 });
  const y = new Spring(0, { stiffness: 0.15, damping: 0.4 });
  const rot = new Spring(0, { stiffness: 0.12, damping: 0.35 });

  let cardEl: HTMLDivElement[] = $state([]);
  let startX = 0;
  let startY = 0;

  function onPointerDown(e: PointerEvent) {
    if (cardEl.length === 0) return;
    dragging = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging || cardEl.length === 0) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    x.set(dx);
    y.set(dy);
    rot.set(dx / 20);
  }

  function onPointerUp() {
    if (!dragging || cardEl.length === 0) return;
    dragging = false;

    let dismissed = false;
    const currentX = x.current;
    const currentY = y.current;
    const currentRot = rot.current;

    if (Math.abs(currentX) > 120) {
      // fling off-screen
      const direction = currentX > 0 ? 1 : -1;
      x.set(direction * 800);
      y.set(y.current);
      rot.set(direction * 25);
      dismissed = true;
      setTimeout(() => nextCard(direction > 0 ? "like" : "nope"), 200);
    }

    if (!dismissed) {
      x.set(0);
      y.set(0);
      rot.set(0);
    }
  }

  function nextCard(action: "like" | "nope") {
    const removed = profiles.pop();
    if (!removed) return;
    // Optionally send action somewhere
    x.set(0);
    y.set(0);
    rot.set(0);
  }

  onMount(() => {
    // ensure springs are reset on mount
    x.set(0);
    y.set(0);
    rot.set(0);
  });

  const session = authClient.useSession();
</script>

<div class="min-h-screen">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-full rounded-t-2xl bg-gradient-to-b from-black/100 to-transparent"></div>
  <FrontBalls />
  <header class="relative z-50 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
    <div class="flex items-center gap-2">
      <button
        onpointerdown={() => goto("/chats")}
        class="rounded-full p-2 font-bold text-white underline underline-offset-2 hover:bg-white hover:text-black"
      >
        Chats
      </button>
    </div>
    <a href="/auth/login" class="rounded-full bg-white px-4 py-2 text-black shadow hover:bg-blue-700">Log in</a>
  </header>

  <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-6 px-4 pb-16">
    <div class="relative mt-4 h-[70vh] w-full max-w-xl select-none">
      {#if false}
        <!-- lock cover -->
        <div class="absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur">
          <div class="text-center text-white">
            <p class="mb-3 text-lg font-semibold">Sign in to Swipe</p>
          </div>
        </div>
      {/if}
      {#if profiles.length === 0}
        <div class="flex h-full w-full items-center justify-center rounded-2xl bg-white shadow">
          <p class="text-gray-500">No more profiles</p>
        </div>
      {:else}
        {#each profiles as profile, i (profile.id)}
          <div
            bind:this={cardEl[i]}
            class="absolute inset-0 origin-bottom rounded-2xl bg-gray-200 shadow-lg"
            style="
                    background-image: url('{profile.image}');
                    background-size: cover;
                    background-position: center;
                    transform: translate3d({i === profiles.length - 1 ? x.current : 0}px, {i === profiles.length - 1
              ? y.current
              : 0}px, 0) rotate({i === profiles.length - 1 ? rot.current : 0}deg);
                    transition: {dragging && i === profiles.length - 1 ? 'none' : 'transform 220ms cubic-bezier(.2,.7,.2,1)'};
                "
            onpointerdown={i === profiles.length - 1 ? onPointerDown : undefined}
            onpointermove={i === profiles.length - 1 ? onPointerMove : undefined}
            onpointerup={i === profiles.length - 1 ? onPointerUp : undefined}
          >
            <div class="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <div class="flex items-end justify-between">
                <div>
                  <h2 class="text-2xl font-semibold">{profile.name}, {profile.age}</h2>
                  <p class="mt-1 text-sm text-white/80">{profile.bio}</p>
                </div>
              </div>
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[14vh] rounded-b-2xl bg-gradient-to-t from-black/30 to-transparent"
            ></div>
          </div>
        {/each}
      {/if}
    </div>
  </main>

  <TextReveal text="Find your match" subtext="Swipe right on your next dormmate." />
  <TwitterTemplate />
  <MainInfoSection images={imgs} paragraphs={paras} />
  <Footer />
</div>
