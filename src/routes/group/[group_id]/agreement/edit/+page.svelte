<!-- src/routes/agreement/edit/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";

  export let data: {
    emptyState?: string;
    groupId?: string;
    prelim?: { groupId: string; rules?: Partial<AgreementRules> | undefined };
    official?: { groupId: string; rules?: Partial<AgreementRules> | undefined };
    signatures?: Array<{ userId: string; name: string | null; email: string; rulesSnapshot: any; signedAt: string | Date }>;
    memberCount?: number;
    youSigned?: boolean;
  } = {}; // 👈 ensure it's never undefined

  export let form:
    | { ok?: boolean; reset?: boolean; promoted?: boolean; message?: string; fieldErrors?: Record<string, string[]> }
    | undefined;

  // Mutable type for the form state
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

  // Ghost defaults
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

  // 👉 SAFE INIT: start from ghosts, then merge any server-provided partials
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
      notBorrow:        srv.appliances?.notBorrow ?? GHOST_RULES.appliances.notBorrow,
      withPermission:   srv.appliances?.withPermission ?? GHOST_RULES.appliances.withPermission,
      withoutPermission:srv.appliances?.withoutPermission ?? GHOST_RULES.appliances.withoutPermission
    },
    other: srv.other ?? GHOST_RULES.other
  };

  // Helpers (unchanged)
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
</script>

<div class="max-w-3xl mx-auto p-6 space-y-8">
  <h1 class="text-3xl font-bold">Edit Preliminary Agreement</h1>

  {#if data.emptyState}
    <p class="text-gray-600">{data.emptyState}</p>
  {:else}
    <section class="border rounded-xl p-4 space-y-2">
      <p class="text-gray-500 text-sm">
        Group: {data.groupId} • Signatures: {data.signatures?.length ?? 0}/{data.memberCount ?? 0}
        {#if data.youSigned} • You have signed ✅ {/if}
      </p>
      {#if form?.reset}<p class="text-indigo-700 text-sm">Edits saved — all signatures reset.</p>{/if}
      {#if form?.promoted}<p class="text-green-700 text-sm">All signed — promoted to Official!</p>{/if}
      {#if form?.message}<p class="text-red-600 text-sm">{form?.message}</p>{/if}
    </section>

    <form method="POST" use:enhance>
      <input type="hidden" name="rules" value={JSON.stringify(rules)} />

      <!-- Quiet Hours -->
      <section class="border rounded-xl p-4 space-y-2">
        <h2 class="font-semibold text-lg">Quiet Hours</h2>
        <div class="grid grid-cols-2 gap-4">
          <label class="flex flex-col">
            <span>Start</span>
            <input class="border rounded-lg px-2 py-1" type="time" bind:value={rules.quietHours.start} />
            {#if err("quietHours.start")}<small class="text-red-600">{err("quietHours.start")}</small>{/if}
          </label>
          <label class="flex flex-col">
            <span>End</span>
            <input class="border rounded-lg px-2 py-1" type="time" bind:value={rules.quietHours.end} />
            {#if err("quietHours.end")}<small class="text-red-600">{err("quietHours.end")}</small>{/if}
          </label>
        </div>
      </section>

      <!-- Guests -->
      <section class="border rounded-xl p-4 space-y-2">
        <h2 class="font-semibold text-lg">Guests</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" bind:checked={rules.guests.daytime} />
            <span>Daytime guests allowed</span>
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" bind:checked={rules.guests.overnight} />
            <span>Overnight guests allowed</span>
          </label>
          <label class="flex flex-col">
            <span>Overnights per week (max)</span>
            <input class="border rounded-lg px-2 py-1" type="number" min="0" max="7" bind:value={rules.guests.overnightPerWeekMax} />
            {#if err("guests.overnightPerWeekMax")}<small class="text-red-600">{err("guests.overnightPerWeekMax")}</small>{/if}
          </label>
          <label class="flex flex-col">
            <span>Advance notice (hours)</span>
            <input class="border rounded-lg px-2 py-1" type="number" min="0" max="168" bind:value={rules.guests.advanceNoticeHours} />
            {#if err("guests.advanceNoticeHours")}<small class="text-red-600">{err("guests.advanceNoticeHours")}</small>{/if}
          </label>
        </div>
      </section>

      <!-- Chores -->
      <section class="border rounded-xl p-4 space-y-3">
        <h2 class="font-semibold text-lg">Chores</h2>
        <label class="flex flex-col max-w-xs">
          <span>Clean check day</span>
          <select class="border rounded-lg px-2 py-1" bind:value={rules.chores.cleanCheckDay}>
            <option>Sun</option><option>Mon</option><option>Tue</option>
            <option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option>
          </select>
        </label>
        {#each rules.chores.rotation as item, i (i)}
          <div class="flex gap-2">
            <input class="border rounded-lg px-2 py-1 flex-1" placeholder="Task" bind:value={rules.chores.rotation[i].task} />
            <select class="border rounded-lg px-2 py-1" bind:value={rules.chores.rotation[i].frequency}>
              <option>daily</option><option>weekly</option><option>biweekly</option><option>monthly</option>
            </select>
            <button type="button" class="px-3 py-1 border rounded-lg"
              on:click={() => { rules.chores.rotation = rules.chores.rotation.filter((_: unknown, idx: number) => idx !== i); rules = { ...rules }; }}>
              Remove
            </button>
          </div>
        {/each}
        <button type="button" class="px-3 py-1 border rounded-lg"
          on:click={() => { rules.chores.rotation = [...rules.chores.rotation, { task: "", frequency: "weekly" }]; rules = { ...rules }; }}>
          + Add task
        </button>
      </section>

      <!-- Cleanliness -->
      <section class="border rounded-xl p-4 space-y-2">
        <h2 class="font-semibold text-lg">Cleanliness</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <label class="flex flex-col">
            <span>Level</span>
            <select class="border rounded-lg px-2 py-1" bind:value={rules.cleanliness.level}>
              <option>low</option><option>medium</option><option>high</option>
            </select>
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" bind:checked={rules.cleanliness.sharedSpaces} />
            <span>Shared spaces responsibility</span>
          </label>
        </div>
      </section>

      <!-- Appliances & Borrowing -->
      <section class="border rounded-xl p-4 space-y-4">
        <h2 class="font-semibold text-lg">Appliances & Borrowing</h2>

        <div class="space-y-2">
          <h3 class="font-medium">NOT borrowed</h3>
          {#each rules.appliances.notBorrow as item, i (i)}
            <div class="flex gap-2">
              <input class="border rounded-lg px-2 py-1 flex-1" placeholder="Item" value={item}
                on:input={(e) => updateItem("notBorrow", i, (e.target as HTMLInputElement).value)} />
              <button type="button" class="px-3 py-1 border rounded-lg" on:click={() => removeItem("notBorrow", i)}>Remove</button>
            </div>
          {/each}
          <button type="button" class="px-3 py-1 border rounded-lg" on:click={() => addItem("notBorrow")}>+ Add</button>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">WITH permission</h3>
          {#each rules.appliances.withPermission as item, i (i)}
            <div class="flex gap-2">
              <input class="border rounded-lg px-2 py-1 flex-1" placeholder="Item" value={item}
                on:input={(e) => updateItem("withPermission", i, (e.target as HTMLInputElement).value)} />
              <button type="button" class="px-3 py-1 border rounded-lg" on:click={() => removeItem("withPermission", i)}>Remove</button>
            </div>
          {/each}
          <button type="button" class="px-3 py-1 border rounded-lg" on:click={() => addItem("withPermission")}>+ Add</button>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">WITHOUT permission</h3>
          {#each rules.appliances.withoutPermission as item, i (i)}
            <div class="flex gap-2">
              <input class="border rounded-lg px-2 py-1 flex-1" placeholder="Item" value={item}
                on:input={(e) => updateItem("withoutPermission", i, (e.target as HTMLInputElement).value)} />
              <button type="button" class="px-3 py-1 border rounded-lg" on:click={() => removeItem("withoutPermission", i)}>Remove</button>
            </div>
          {/each}
          <button type="button" class="px-3 py-1 border rounded-lg" on:click={() => addItem("withoutPermission")}>+ Add</button>
        </div>
      </section>

      <!-- Other -->
      <section class="border rounded-xl p-4 space-y-2">
        <h2 class="font-semibold text-lg">Other Notes</h2>
        <textarea class="border rounded-lg px-2 py-1 w-full min-h-[120px]" bind:value={rules.other}></textarea>
      </section>

      <div class="mt-6 flex gap-2">
        <button class="px-3 py-2 border rounded-lg" formaction="?/save">Save (resets signatures)</button>
        <button class="px-3 py-2 border rounded-lg" formaction="?/sign">Sign</button>
      </div>
    </form>

    <section class="border rounded-xl p-4 space-y-2">
      <h2 class="text-xl font-semibold">Current Signatures</h2>
      {#if !data.signatures || data.signatures.length === 0}
        <p class="text-gray-600">No one has signed yet.</p>
      {:else}
        <div class="space-y-2">
          {#each data.signatures as s}
            <div class="flex items-center justify-between border rounded-lg p-2">
              <div>
                <p class="font-medium">{s.name ?? s.email}</p>
                <p class="text-gray-500 text-sm">Signed at {fmt(s.signedAt as any)}</p>
              </div>
              <details class="text-sm">
                <summary class="cursor-pointer">View snapshot</summary>
                <pre class="bg-gray-50 p-2 rounded overflow-auto text-xs">{JSON.stringify(s.rulesSnapshot, null, 2)}</pre>
              </details>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>
