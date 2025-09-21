<!-- src/routes/agreement/+page.svelte -->
<script lang="ts">
  export let data: {
    emptyState?: string;
    agreement?: { rules: any; publishedAt: string | Date | null };
    signatures?: Array<{ userId: string; name: string | null; email: string; rulesSnapshot: any; signedAt: string | Date }>;
  } = {};

  const GHOST_RULES = {
    quietHours: { start: "23:00", end: "07:00" },
    guests: { daytime: true, overnight: false, overnightPerWeekMax: 1, advanceNoticeHours: 24 },
    chores: { cleanCheckDay: "Sun", rotation: [{ task: "Take out trash", frequency: "weekly" }, { task: "Vacuum the room", frequency: "weekly" }] },
    cleanliness: { level: "medium", sharedSpaces: true },
    appliances: {
      notBorrow: ["Personal meds", "Laptop"],
      withPermission: ["Headphones", "Board games"],
      withoutPermission: ["Mugs", "Spare phone charger", "fridge", "microwave"]
    },
    other: "No loud music during finals week."
  };
  const GHOST_PUBLISHED_AT: Date = new Date();

  $: rules = data.agreement?.rules ?? GHOST_RULES;
  $: publishedAt = data.agreement?.publishedAt ?? GHOST_PUBLISHED_AT;

  const fmt = (d: string | Date | null | undefined) => (d ? new Date(d).toLocaleString() : "—");
  function handleSubmit() { console.log("Pretend saved:\n" + JSON.stringify(rules, null, 2)); }
</script>

<div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0e0e0f] via-[#141414] to-black text-white">
  <div class="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#CFB991]/20 blur-3xl"></div>
  <div class="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[#CFB991]/10 blur-3xl"></div>

  <!-- Global type scale boost -->
  <main class="mx-auto max-w-5xl px-6 py-12 md:py-20 text-[17px] md:text-[18px] leading-relaxed">
    <!-- Header -->
    <div class="mb-8 flex items-center gap-4">
      <div class="grid place-items-center h-12 w-12 rounded-2xl bg-[#CFB991]/20 text-[#CFB991] text-2xl"><a href="./">🏠</a></div>
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">Official Agreement</h1>
    </div>

    <!-- Card -->
    <section class="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-2xl ring-1 ring-black/10">
      <!-- meta -->
      <div class="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10">
        <p class="text-base text-white/80">
          Published: <span class="text-[#CFB991] font-medium">{fmt(publishedAt)}</span>
        </p>
        <span class="inline-flex items-center rounded-full bg-[#CFB991]/15 text-[#CFB991] px-3.5 py-1.5 text-sm font-medium">
          {data.signatures?.length ?? 0} signature{(data.signatures?.length ?? 0) === 1 ? "" : "s"}
        </span>
      </div>

      <!-- content -->
      <div class="p-6 md:p-8 space-y-6 md:space-y-7">
        <!-- Quiet Hours -->
        <div class="rounded-2xl border border-white/10 bg-black/20 hover:bg-black/10 transition-colors p-5 md:p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
            <h3 class="font-semibold text-xl md:text-2xl">Quiet Hours</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p class="text-base text-white/85"><span class="text-white/60">Start:</span> {rules.quietHours.start}</p>
            <p class="text-base text-white/85"><span class="text-white/60">End:</span> {rules.quietHours.end}</p>
          </div>
        </div>

        <!-- Guests -->
        <div class="rounded-2xl border border-white/10 bg-black/20 hover:bg-black/10 transition-colors p-5 md:p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
            <h3 class="font-semibold text-xl md:text-2xl">Guests</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p class="text-base text-white/85"><span class="text-white/60">Daytime:</span> {rules.guests.daytime ? "Yes" : "No"}</p>
            <p class="text-base text-white/85"><span class="text-white/60">Overnight:</span> {rules.guests.overnight ? "Yes" : "No"}</p>
          </div>
        </div>

        <!-- Appliances -->
        <div class="rounded-2xl border border-white/10 bg-black/20 hover:bg-black/10 transition-colors p-5 md:p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
            <h3 class="font-semibold text-xl md:text-2xl">Appliances &amp; Borrowing</h3>
          </div>
          <div class="grid gap-6 md:grid-cols-3">
            <div>
              <p class="font-semibold underline underline-offset-4 decoration-[#CFB991]/60 mb-2">NOT borrowed</p>
              <ul class="ml-5 list-disc [li]:marker:text-[#CFB991] space-y-1.5">
                {#each rules.appliances.notBorrow as item}
                  <li class="text-base text-white/85">{item}</li>
                {/each}
              </ul>
            </div>
            <div>
              <p class="font-semibold underline underline-offset-4 decoration-[#CFB991]/60 mb-2">WITH permission</p>
              <ul class="ml-5 list-disc [li]:marker:text-[#CFB991] space-y-1.5">
                {#each rules.appliances.withPermission as item}
                  <li class="text-base text-white/85">{item}</li>
                {/each}
              </ul>
            </div>
            <div>
              <p class="font-semibold underline underline-offset-4 decoration-[#CFB991]/60 mb-2">WITHOUT permission</p>
              <ul class="ml-5 list-disc [li]:marker:text-[#CFB991] space-y-1.5">
                {#each rules.appliances.withoutPermission as item}
                  <li class="text-base text-white/85">{item}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

        <!-- Other Notes -->
        <div class="rounded-2xl border border-white/10 bg-black/20 hover:bg-black/10 transition-colors p-5 md:p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
            <h3 class="font-semibold text-xl md:text-2xl">Other Notes</h3>
          </div>
          <p class="text-base text-white/85 whitespace-pre-wrap">{rules.other}</p>
        </div>
      </div>
    </section>

    <!-- Signatures -->
    <section class="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-2xl">
      <div class="px-6 md:px-8 py-5 border-b border-white/10 flex items-center gap-3">
        <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
        <h2 class="text-2xl md:text-3xl font-semibold">Signatures</h2>
      </div>

      <div class="p-6 md:p-8">
        {#if !data.signatures || data.signatures.length === 0}
          <p class="text-white/80 text-base">No signatures recorded yet.</p>
        {:else}
          <div class="space-y-4">
            {#each data.signatures as s}
              <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
                <div>
                  <p class="font-medium text-lg">{s.name ?? s.email}</p>
                  <p class="text-sm text-white/60">Signed at {fmt(s.signedAt)}</p>
                </div>
                <details class="text-base">
                  <summary class="cursor-pointer text-[#CFB991]">View snapshot</summary>
                  <pre class="mt-3 bg-black/40 border border-white/10 p-3 rounded text-sm overflow-auto max-h-72">{JSON.stringify(s.rulesSnapshot, null, 2)}</pre>
                </details>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <!-- Fake Save button -->
    <div class="mt-8">
      <button
        on:click|preventDefault={handleSubmit}
        class="inline-flex items-center justify-center rounded-2xl px-6 md:px-7 py-3 md:py-3.5 text-base md:text-lg
               bg-gradient-to-b from-[#CFB991] to-[#bda675] text-black font-semibold
               shadow-[0_14px_40px_-12px_rgba(207,185,145,0.65)]
               hover:from-[#d9c8a6] hover:to-[#c6b589] transition-all">
        Save (fake)
      </button>
    </div>
  </main>
</div>
