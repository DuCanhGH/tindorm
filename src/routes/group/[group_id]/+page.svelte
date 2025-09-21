<!-- src/routes/group/[groupId]/+page.svelte -->
<script lang="ts">
  import { page } from "$app/stores";
  $: groupId = $page.params.group_id; // "1" when on /group/1
  // Incoming data shape (can be SSR-loaded later)
  export let data: {
    group?: { id: number; name: string; dissolved: boolean; memberCount?: number };
    members?: Array<{
      id: string;
      name: string;
      email: string;
      classNo?: number | null;
      school?: string | null;
      country?: string | null;
      image?: string | null;
    }>;
  } = {};

  // ---------- Ghost (demo) values ----------
  const GHOST_GROUP = {
    id: 1,
    name: "Wiley 3B – Room 312",
    dissolved: false,
    memberCount: 4
  };

  const GHOST_MEMBERS = [
    { id: "u1", name: "Avery Johnson", email: "avery@purdue.edu", classNo: 2028, school: "Engineering", country: "USA", image: null },
    { id: "u2", name: "Minji Park", email: "minji@purdue.edu", classNo: 2027, school: "Computer Science", country: "South Korea", image: null },
    { id: "u3", name: "Liam Patel", email: "liam@purdue.edu", classNo: 2029, school: "Mathematics", country: "India", image: null },
    { id: "u4", name: "Sofia García", email: "sofia@purdue.edu", classNo: 2026, school: "Business", country: "Spain", image: null }
  ];

  // ---------- Reactive fallbacks ----------
  $: group = data.group ?? GHOST_GROUP;
  $: members = data.members ?? GHOST_MEMBERS;

  // Derived, reactive labels
  $: statusLabel = group.dissolved ? "Dissolved" : "Active";
  $: memberCount = group.memberCount ?? members.length;

  // Style helpers (keeps markup tidy)
  const sectionCard = "rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-2xl ring-1 ring-black/10";
  const chip = "inline-flex items-center rounded-full bg-[#CFB991]/15 text-[#CFB991] px-3 py-1.5 text-sm font-medium";
</script>

<!-- Purdue gold/black background -->
<div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0e0e0f] via-[#141414] to-black text-white">
  <!-- soft gold glows -->
  <div class="pointer-events-none absolute -top-24 -left-24 h-[22rem] w-[22rem] rounded-full bg-[#CFB991]/20 blur-3xl"></div>
  <div class="pointer-events-none absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#CFB991]/10 blur-3xl"></div>

  <main class="mx-auto max-w-5xl px-6 py-12 md:py-20 text-[17px] md:text-[18px] leading-relaxed">
    <!-- Header -->
    <header class="mb-8 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4 min-w-0">
        <div class="grid place-items-center h-12 w-12 rounded-2xl bg-[#CFB991]/20 text-[#CFB991] text-2xl">👥</div>
        <div class="min-w-0">
          <h1 class="text-4xl md:text-5xl font-semibold tracking-tight truncate">{group.name}</h1>
          <p class="text-white/70 mt-1 flex flex-wrap gap-2">
            <span>Status: <span class="text-[#CFB991]">{statusLabel}</span></span>
            <span>•</span>
            <span>Members: <span class="text-[#CFB991]">{memberCount}</span></span>
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 shrink-0">
        <a href={`${groupId}/agreement`} class="px-5 py-2.5 rounded-2xl border border-white/15 hover:bg-white/10 transition">
          View Agreement
        </a>
        <a href={`${groupId}/agreement/edit`} class="px-5 py-2.5 rounded-2xl bg-[#CFB991] text-black font-semibold hover:brightness-110 transition">
          Edit Preliminary
        </a>
      </div>
    </header>

    <!-- Members -->
    <section class={sectionCard + " p-6 md:p-8"}>
      <div class="flex items-center gap-3 mb-6">
        <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
        <h2 class="text-2xl md:text-3xl font-semibold">Members</h2>
      </div>

      <div class="grid md:grid-cols-2 gap-5">
        {#each members as m (m.id)}
          <article class="rounded-2xl border border-white/10 bg-black/20 p-4 flex gap-4">
            <!-- <img
              src={m.image ?? "https://placehold.co/96x96?text=👤"}
              alt=""
              class="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover border border-white/10"
              loading="lazy"
            /> -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-xl font-medium truncate">{m.name}</h3>
                <span class="text-xs text-white/60 truncate">{m.email}</span>
              </div>

              <div class="mt-2 flex flex-wrap gap-2">
                <span class={chip}>Class of {m.classNo ?? "—"}</span>
                <span class={chip}>{m.school ?? "—"}</span>
                <span class={chip}>{m.country ?? "—"}</span>
              </div>
            </div>
          </article>
        {/each}
      </div>
    </section>
  </main>
</div>
