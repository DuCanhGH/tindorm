<!-- src/routes/agreement/edit/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";

  // 0) Types first
  type AgreementRules = {
    quietHours: { start: string; end: string };
    guests: { daytime: boolean; overnight: boolean; overnightPerWeekMax: number; advanceNoticeHours: number };
    chores: {
      cleanCheckDay: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
      rotation: { task: string; frequency: "daily" | "weekly" | "biweekly" | "monthly" }[];
    };
    cleanliness: { level: "low" | "medium" | "high"; sharedSpaces: boolean };
    appliances: { notBorrow: string[]; withPermission: string[]; withoutPermission: string[] };
    other: string;
  };

  // 1) Incoming props
  export let data: {
    emptyState?: string;
    groupId?: string;
    prelim?: { groupId: string; rules?: Partial<AgreementRules> | undefined };
    official?: { groupId: string; rules?: Partial<AgreementRules> | undefined };
    signatures?: Array<{ userId: string; name: string | null; email: string; rulesSnapshot: any; signedAt: string | Date }>;
    memberCount?: number;
    youSigned?: boolean;
  } = {};

  export let form:
    | { ok?: boolean; reset?: boolean; promoted?: boolean; message?: string; fieldErrors?: Record<string, string[]> }
    | undefined;

  // 2) Ghost defaults
  const GHOST_RULES: AgreementRules = {
    quietHours: { start: "23:00", end: "07:00" },
    guests: { daytime: true, overnight: false, overnightPerWeekMax: 1, advanceNoticeHours: 24 },
    chores: {
      cleanCheckDay: "Sun",
      rotation: [
        { task: "Take out trash", frequency: "weekly" },
        { task: "Vacuum the room", frequency: "weekly" }
      ]
    },
    cleanliness: { level: "medium", sharedSpaces: true },
    appliances: {
      notBorrow: ["Personal meds", "Laptop"],
      withPermission: ["Headphones", "Board games"],
      withoutPermission: ["Mugs", "Spare phone charger", "fridge", "microwave"]
    },
    other: "No loud music during finals week."
  };

  // 3) Safe init: merge server partials into ghosts
  const srv = (data.prelim?.rules ?? {}) as Partial<AgreementRules>;
  let rules: AgreementRules = {
    quietHours: {
      start: srv.quietHours?.start ?? GHOST_RULES.quietHours.start,
      end:   srv.quietHours?.end   ?? GHOST_RULES.quietHours.end
    },
    guests: {
      daytime:             srv.guests?.daytime ?? GHOST_RULES.guests.daytime,
      overnight:           srv.guests?.overnight ?? GHOST_RULES.guests.overnight,
      overnightPerWeekMax: srv.guests?.overnightPerWeekMax ?? GHOST_RULES.guests.overnightPerWeekMax,
      advanceNoticeHours:  srv.guests?.advanceNoticeHours ?? GHOST_RULES.guests.advanceNoticeHours
    },
    chores: {
      cleanCheckDay: srv.chores?.cleanCheckDay ?? GHOST_RULES.chores.cleanCheckDay,
      rotation:      srv.chores?.rotation ?? GHOST_RULES.chores.rotation
    },
    cleanliness: {
      level:        srv.cleanliness?.level ?? GHOST_RULES.cleanliness.level,
      sharedSpaces: srv.cleanliness?.sharedSpaces ?? GHOST_RULES.cleanliness.sharedSpaces
    },
    appliances: {
      notBorrow:         srv.appliances?.notBorrow ?? GHOST_RULES.appliances.notBorrow,
      withPermission:    srv.appliances?.withPermission ?? GHOST_RULES.appliances.withPermission,
      withoutPermission: srv.appliances?.withoutPermission ?? GHOST_RULES.appliances.withoutPermission
    },
    other: srv.other ?? GHOST_RULES.other
  };

  // 4) Helpers
  const err = (path: string) => form?.fieldErrors?.[path]?.[0] ?? null;
  const fmt = (d: string | Date) => new Date(d).toLocaleString();

  type ListKey = keyof AgreementRules["appliances"];
  function addItem(list: ListKey) {
    const next = [...rules.appliances[list], ""];
    rules = { ...rules, appliances: { ...rules.appliances, [list]: next } };
  }
  function removeItem(list: ListKey, i: number) {
    const next = rules.appliances[list].filter((_, idx) => idx !== i);
    rules = { ...rules, appliances: { ...rules.appliances, [list]: next } };
  }
  function updateItem(list: ListKey, i: number, v: string) {
    const next = [...rules.appliances[list]];
    next[i] = v;
    rules = { ...rules, appliances: { ...rules.appliances, [list]: next } };
  }

  // 5) Style helpers (no extra component)
  const sectionCls =
    "rounded-2xl border border-white/10 bg-black/20 hover:bg-black/10 transition-colors p-5 md:p-6";
  const sectionHead =
    "flex items-center gap-3 mb-4";
  const sectionDot =
    "h-2.5 w-2.5 rounded-full bg-[#CFB991]";
  const sectionTitle =
    "font-semibold text-xl md:text-2xl";
  const inputCls =
    "rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#CFB991] focus:border-transparent";
  const btnGold =
    "px-6 py-3 rounded-2xl bg-gradient-to-b from-[#CFB991] to-[#bda675] text-black font-semibold shadow-[0_14px_40px_-12px_rgba(207,185,145,0.65)] hover:from-[#d9c8a6] hover:to-[#c6b589] transition-all";
  const btnGhost =
    "px-6 py-3 rounded-2xl border border-white/15 hover:bg-white/10 transition-all";
</script>

<!-- Purdue gold/black background -->
<div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0e0e0f] via-[#141414] to-black text-white">
  <div class="pointer-events-none absolute -top-24 -left-24 h-[22rem] w-[22rem] rounded-full bg-[#CFB991]/20 blur-3xl"></div>
  <div class="pointer-events-none absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#CFB991]/10 blur-3xl"></div>

  <main class="mx-auto max-w-5xl px-6 py-12 md:py-20 text-[17px] md:text-[18px] leading-relaxed">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="grid place-items-center h-12 w-12 rounded-2xl bg-[#CFB991]/20 text-[#CFB991] text-2xl">📝</div>
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">Edit Preliminary Agreement</h1>
      </div>
      <span class="inline-flex items-center rounded-full bg-[#CFB991]/15 text-[#CFB991] px-3.5 py-1.5 text-sm font-medium">
        {(data.signatures?.length ?? 0)} / {(data.memberCount ?? 0)} signed
      </span>
    </div>

    {#if data.emptyState}
      <p class="text-white/80">{data.emptyState}</p>
    {:else}
      <!-- Glass card -->
      <section class="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-2xl ring-1 ring-black/10">
        <!-- Meta strip -->
        <div class="px-6 md:px-8 py-5 border-b border-white/10 text-white/80 text-base">
          Group: <span class="text-[#CFB991] font-medium">{data.groupId ?? "—"}</span>
          {#if data.youSigned}
            <span class="ml-3 inline-flex items-center rounded-full bg-[#CFB991]/15 text-[#CFB991] px-2.5 py-1 text-xs">You signed ✅</span>
          {/if}
          {#if form?.reset}<span class="ml-3 text-[#a7c0ff]">Edits saved — signatures reset.</span>{/if}
          {#if form?.promoted}<span class="ml-3 text-[#8aff9a]">All signed — promoted to Official!</span>{/if}
          {#if form?.message}<span class="ml-3 text-[#ff8a8a]">{form?.message}</span>{/if}
        </div>

        <!-- Form -->
        <form method="POST" use:enhance class="p-6 md:p-8 space-y-7">
          <input type="hidden" name="rules" value={JSON.stringify(rules)} />

          <!-- Quiet Hours -->
          <div class={sectionCls}>
            <div class={sectionHead}>
              <div class={sectionDot}></div>
              <h2 class={sectionTitle}>Quiet Hours</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label class="flex flex-col gap-1">
                <span class="text-white/75">Start</span>
                <input class={inputCls} type="time" bind:value={rules.quietHours.start} />
                {#if err("quietHours.start")}<small class="text-[#ff8a8a]">{err("quietHours.start")}</small>{/if}
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-white/75">End</span>
                <input class={inputCls} type="time" bind:value={rules.quietHours.end} />
                {#if err("quietHours.end")}<small class="text-[#ff8a8a]">{err("quietHours.end")}</small>{/if}
              </label>
            </div>
          </div>

          <!-- Guests -->
          <div class={sectionCls}>
            <div class={sectionHead}>
              <div class={sectionDot}></div>
              <h2 class={sectionTitle}>Guests</h2>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
              <label class="inline-flex items-center gap-3">
                <input type="checkbox" class="h-5 w-5 rounded border-white/30 bg-black/40 accent-[#CFB991]"
                       bind:checked={rules.guests.daytime} />
                <span>Daytime guests allowed</span>
              </label>
              <label class="inline-flex items-center gap-3">
                <input type="checkbox" class="h-5 w-5 rounded border-white/30 bg-black/40 accent-[#CFB991]"
                       bind:checked={rules.guests.overnight} />
                <span>Overnight guests allowed</span>
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-white/75">Overnights per week (max)</span>
                <input class={inputCls} type="number" min="0" max="7" bind:value={rules.guests.overnightPerWeekMax} />
                {#if err("guests.overnightPerWeekMax")}<small class="text-[#ff8a8a]">{err("guests.overnightPerWeekMax")}</small>{/if}
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-white/75">Advance notice (hours)</span>
                <input class={inputCls} type="number" min="0" max="168" bind:value={rules.guests.advanceNoticeHours} />
                {#if err("guests.advanceNoticeHours")}<small class="text-[#ff8a8a]">{err("guests.advanceNoticeHours")}</small>{/if}
              </label>
            </div>
          </div>

          <!-- Chores -->
          <div class={sectionCls}>
            <div class={sectionHead}>
              <div class={sectionDot}></div>
              <h2 class={sectionTitle}>Chores</h2>
            </div>
            <div class="flex flex-col md:flex-row gap-4 md:items-end">
              <label class="flex flex-col gap-1 max-w-xs">
                <span class="text-white/75">Clean check day</span>
                <select class={inputCls} bind:value={rules.chores.cleanCheckDay}>
                  <option>Sun</option><option>Mon</option><option>Tue</option>
                  <option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option>
                </select>
              </label>
            </div>

            <div class="mt-4 space-y-3">
              {#each rules.chores.rotation as item, i (i)}
                <div class="flex gap-3">
                  <input class={inputCls + " flex-1"} placeholder="Task" bind:value={rules.chores.rotation[i].task} />
                  <select class={inputCls} bind:value={rules.chores.rotation[i].frequency}>
                    <option>daily</option><option>weekly</option><option>biweekly</option><option>monthly</option>
                  </select>
                  <button type="button"
                          class="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition-colors"
                          on:click={() => {
                            rules.chores.rotation = rules.chores.rotation.filter((_, idx) => idx !== i);
                            rules = { ...rules };
                          }}>
                    Remove
                  </button>
                </div>
              {/each}

              <button type="button"
                      class="px-4 py-2 rounded-xl bg-[#CFB991] text-black font-medium hover:brightness-110 transition"
                      on:click={() => {
                        rules.chores.rotation = [...rules.chores.rotation, { task: "", frequency: "weekly" }];
                        rules = { ...rules };
                      }}>
                + Add task
              </button>
            </div>
          </div>

        <!-- Appliances & Borrowing -->
        <div class={sectionCls}>
        <div class={sectionHead}>
            <div class={sectionDot}></div>
            <h2 class={sectionTitle}>Appliances &amp; Borrowing</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
            <!-- NOT borrowed -->
            <div class="space-y-2">
            <p class="font-semibold underline underline-offset-4 decoration-[#CFB991]/60">
                NOT borrowed
            </p>

            {#each rules.appliances.notBorrow as _item, i (i)}
                <div class="flex items-center gap-3">
                <!-- min-w-0 lets the input shrink in a flex row -->
                <input
                    class={inputCls + " flex-1 min-w-0"}
                    placeholder="Item"
                    bind:value={rules.appliances.notBorrow[i]}
                />
                <!-- keep the button from squishing/overlapping -->
                <button
                    type="button"
                    class="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition-colors"
                    on:click={() => removeItem("notBorrow", i)}
                >
                    Remove
                </button>
                </div>
            {/each}

            <button
                type="button"
                class="px-4 py-2 rounded-xl bg-[#CFB991] text-black font-medium hover:brightness-110 transition"
                on:click={() => addItem("notBorrow")}
            >
                + Add
            </button>
            </div>

            <!-- WITH permission -->
            <div class="space-y-2">
            <p class="font-semibold underline underline-offset-4 decoration-[#CFB991]/60">
                WITH permission
            </p>

            {#each rules.appliances.withPermission as _item, i (i)}
                <div class="flex items-center gap-3">
                <input
                    class={inputCls + " flex-1 min-w-0"}
                    placeholder="Item"
                    bind:value={rules.appliances.withPermission[i]}
                />
                <button
                    type="button"
                    class="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition-colors"
                    on:click={() => removeItem("withPermission", i)}
                >
                    Remove
                </button>
                </div>
            {/each}

            <button
                type="button"
                class="px-4 py-2 rounded-xl bg-[#CFB991] text-black font-medium hover:brightness-110 transition"
                on:click={() => addItem("withPermission")}
            >
                + Add
            </button>
            </div>

            <!-- WITHOUT permission -->
            <div class="space-y-2">
            <p class="font-semibold underline underline-offset-4 decoration-[#CFB991]/60">
                WITHOUT permission
            </p>

            {#each rules.appliances.withoutPermission as _item, i (i)}
                <div class="flex items-center gap-3">
                <input
                    class={inputCls + " flex-1 min-w-0"}
                    placeholder="Item"
                    bind:value={rules.appliances.withoutPermission[i]}
                />
                <button
                    type="button"
                    class="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition-colors"
                    on:click={() => removeItem("withoutPermission", i)}
                >
                    Remove
                </button>
                </div>
            {/each}

            <button
                type="button"
                class="px-4 py-2 rounded-xl bg-[#CFB991] text-black font-medium hover:brightness-110 transition"
                on:click={() => addItem("withoutPermission")}
            >
                + Add
            </button>
            </div>
        </div>
        </div>


          <!-- Other Notes -->
          <div class={sectionCls}>
            <div class={sectionHead}>
              <div class={sectionDot}></div>
              <h2 class={sectionTitle}>Other Notes</h2>
            </div>
            <textarea class={inputCls + " w-full min-h-[140px]"} bind:value={rules.other}></textarea>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3 pt-2">
            <button class={btnGold} formaction="?/save">Save (resets signatures)</button>
            <button class={btnGhost} formaction="?/sign">Sign</button>
          </div>
        </form>
      </section>

      <!-- Signatures list -->
      <section class="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-2xl">
        <div class="px-6 md:px-8 py-5 border-b border-white/10 flex items-center gap-3">
          <div class="h-2.5 w-2.5 rounded-full bg-[#CFB991]"></div>
          <h2 class="text-2xl md:text-3xl font-semibold">Current Signatures</h2>
        </div>

        <div class="p-6 md:p-8">
          {#if !data.signatures || data.signatures.length === 0}
            <p class="text-white/80 text-base">No one has signed yet.</p>
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
    {/if}
  </main>
</div>
