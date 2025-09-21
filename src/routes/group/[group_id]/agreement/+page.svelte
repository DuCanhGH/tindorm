<!-- src/routes/agreement/+page.svelte -->
<script lang="ts">
  // Keep the type, but don’t try to stuff defaults into `data` itself.
  export let data: {
    emptyState?: string;
    agreement?: { rules: any; publishedAt: string | Date | null };
    signatures?: Array<{ userId: string; name: string | null; email: string; rulesSnapshot: any; signedAt: string | Date }>;
  } = {};

  // Ghost/default rules used when no server data is provided
  const GHOST_RULES = {
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
  const GHOST_PUBLISHED_AT: Date = new Date();

  $: rules = data.agreement?.rules ?? GHOST_RULES;
  $: publishedAt = data.agreement?.publishedAt ?? GHOST_PUBLISHED_AT; 

  const fmt = (d: string | Date | null | undefined) =>
    d ? new Date(d).toLocaleString() : "—";

  // Always have something to render: server rules OR ghosts

  function handleSubmit() {
    console.log("Pretend saved:\n" + JSON.stringify(rules, null, 2));
  }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-8">
  <h1 class="text-3xl font-bold">Official Agreement</h1>

  {#if data.emptyState}
    <p class="text-gray-600">{data.emptyState}</p>
  {:else}
    <section class="border rounded-xl p-4 space-y-3">
      <p class="text-gray-500 text-sm">Published: {fmt(publishedAt)}</p>

      <div class="space-y-3">
        <div class="border rounded-lg p-3">
          <h3 class="font-medium">Quiet Hours</h3>
          <p>Start: {rules.quietHours.start}</p>
          <p>End: {rules.quietHours.end}</p>
        </div>

        <div class="border rounded-lg p-3">
          <h3 class="font-medium">Guests</h3>
          <p>Daytime: {rules.guests.daytime ? "Yes" : "No"}</p>
          <p>Overnight: {rules.guests.overnight ? "Yes" : "No"}</p>
        </div>

        <div class="border rounded-lg p-3">
          <h3 class="font-medium">Appliances & Borrowing</h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div>
              <p class="font-medium underline">NOT borrowed</p>
              <ul class="list-disc ml-5">
                {#each rules.appliances.notBorrow as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
            <div>
              <p class="font-medium underline">WITH permission</p>
              <ul class="list-disc ml-5">
                {#each rules.appliances.withPermission as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
            <div>
              <p class="font-medium underline">WITHOUT permission</p>
              <ul class="list-disc ml-5">
                {#each rules.appliances.withoutPermission as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-3">
          <h3 class="font-medium">Other Notes</h3>
          <p class="whitespace-pre-wrap">{rules.other}</p>
        </div>
      </div>
    </section>

    <section class="border rounded-xl p-4 space-y-3">
      <h2 class="text-xl font-semibold">Signatures</h2>
      {#if !data.signatures || data.signatures.length === 0}
        <p class="text-gray-600">No signatures recorded yet.</p>
      {:else}
        <div class="space-y-2">
          {#each data.signatures as s}
            <div class="flex items-center justify-between border rounded-lg p-2">
              <div>
                <p class="font-medium">{s.name ?? s.email}</p>
                <p class="text-gray-500 text-sm">Signed at {fmt(s.signedAt)}</p>
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
<button on:click|preventDefault={handleSubmit} class="btn">Save (fake)</button>
