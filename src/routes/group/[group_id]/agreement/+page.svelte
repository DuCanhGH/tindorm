<script lang="ts">
  // Ghost/default values (hardcoded)
  let rules = {
    quietHours: { start: "23:00", end: "07:00"},
    guests: { daytime: true, overnight: false, overnightPerWeekMax: 1, advanceNoticeHours: 24 },
    chores: { cleanCheckDay: "Sun", rotation: [{ task: "Take out trash", frequency: "weekly" }, {task: "Vacuum the room", frequency: "weekly"}] },
    cleanliness: { level: "medium", sharedSpaces: true },
    appliances: {
      notBorrow: ["Personal meds", "Laptop"],
      withPermission: ["Headphones", "Board games"],
      withoutPermission: ["Mugs", "Spare phone charger","fridge","microwave"]
    },
    other: "No loud music during finals week."
  };

  function handleSubmit() {
    console.log("Pretend saved:\n" + JSON.stringify(rules, null, 2));
  }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-8">
  <p> <a href="./"> Return to group</a></p>
  <h1 class="text-3xl font-bold">Roommate Agreement (Demo)</h1>
  <p class="text-gray-500">These are ghost values — no backend yet.</p>

  <!-- Quiet Hours -->
  <section class="card p-4 space-y-3 border rounded-xl">
    <h2 class="font-semibold text-lg">Quiet Hours</h2>
    <div class="grid grid-cols-2 gap-4">
      <label class="flex flex-col">Start
        <input class="input" type="time" bind:value={rules.quietHours.start}/>
      </label>
      <label class="flex flex-col">End
        <input class="input" type="time" bind:value={rules.quietHours.end}/>
      </label>
    </div>
  </section>

  <!-- Guests -->
  <section class="card p-4 space-y-3 border rounded-xl">
    <h2 class="font-semibold text-lg">Guests</h2>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" bind:checked={rules.guests.daytime} />
        <span>Daytime guests allowed</span>
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" bind:checked={rules.guests.overnight} />
        <span>Overnight guests allowed</span>
      </label>
      <label class="flex flex-col">Overnights per week (max)
        <input class="input" type="number" min="0" max="7" bind:value={rules.guests.overnightPerWeekMax} />
      </label>
      <label class="flex flex-col">Advance notice (hours)
        <input class="input" type="number" min="0" max="168" bind:value={rules.guests.advanceNoticeHours} />
      </label>
  </section>

  <!-- Chores -->
  <section class="card p-4 space-y-3 border rounded-xl">
    <h2 class="font-semibold text-lg">Chores</h2>
    <label class="flex flex-col">Clean check day
      <select class="input" bind:value={rules.chores.cleanCheckDay}>
        <option>Sun</option><option>Mon</option><option>Tue</option>
        <option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option>
      </select>
    </label>
    {#each rules.chores.rotation as item, i}
      <div class="flex gap-2">
        <input class="border rounded-lg px-2 py-1 flex-1"
               placeholder="Item name"
               bind:value={rules.chores.rotation[i].task} />
        <select class="input px-3 py-1 border rounded-lg" bind:value={item.frequency}>
              <option>daily</option><option>weekly</option><option>biweekly</option><option>monthly</option>
        </select>
        <button type="button" class="px-3 py-1 border rounded-lg"
                on:click={() => rules.chores.rotation = rules.chores.rotation.filter((_, idx) => idx !== i)}>Remove</button>
      </div>
    {/each}
    <button type="button" class="px-3 py-1 border rounded-lg"
            on:click={ () => {
              rules.chores.rotation = [...rules.chores.rotation, {task: "", frequency: "weekly"}];
              rules = { ...rules };
            }}>+ Add item</button>
  </section>

  <!-- Cleanliness -->
  <section class="card p-4 space-y-3 border rounded-xl">
    <h2 class="font-semibold text-lg">Cleanliness</h2>
    <select class="input" bind:value={rules.cleanliness.level}>
      <option>low</option><option>medium</option><option>high</option>
    </select>
    <label class="inline-flex items-center gap-2">
      <input type="checkbox" bind:checked={rules.cleanliness.sharedSpaces}/>
      <span>Shared spaces responsibility</span>
    </label>
  </section>


  <!-- Not allowed -->
  <div class="space-y-2">
    <h3 class="font-medium">The following items may <span class="underline">NOT</span> be borrowed:</h3>
    {#each rules.appliances.notBorrow as item, i}
      <div class="flex gap-2">
        <input class="border rounded-lg px-2 py-1 flex-1"
               placeholder="Item name"
               bind:value={rules.appliances.notBorrow[i]} />
        <button type="button" class="px-3 py-1 border rounded-lg"
                on:click={() => rules.appliances.notBorrow = rules.appliances.notBorrow.filter((_, idx) => idx !== i)}>Remove</button>
      </div>
    {/each}
    <button type="button" class="px-3 py-1 border rounded-lg"
            on:click={ () => {
              rules.appliances.notBorrow = [...rules.appliances.notBorrow, ""];
              rules = { ...rules };
            }}>+ Add item</button>
  </div>

  <!-- With permission -->
  <div class="space-y-2">
    <h3 class="font-medium">The following items may be borrowed <span class="underline">WITH permission</span>:</h3>
    {#each rules.appliances.withPermission as item, i}
      <div class="flex gap-2">
        <input class="border rounded-lg px-2 py-1 flex-1"
               placeholder="Item name"
               bind:value={rules.appliances.withPermission[i]} />
        <button type="button" class="px-3 py-1 border rounded-lg"
                on:click={() => rules.appliances.withPermission = rules.appliances.withPermission.filter((_, idx) => idx !== i)}>Remove</button>
      </div>
    {/each}
    <button type="button" class="px-3 py-1 border rounded-lg"
            on:click={ () => {
              rules.appliances.withPermission = [...rules.appliances.withPermission, ""];
              rules = { ...rules };
            }}>+ Add item</button>
  </div>

  <!-- Without permission -->
  <div class="space-y-2">
    <h3 class="font-medium">The following items may be borrowed <span class="underline">WITHOUT permission</span>:</h3>
    {#each rules.appliances.withoutPermission as item, i}
      <div class="flex gap-2">
        <input class="border rounded-lg px-2 py-1 flex-1"
               placeholder="Item name"
               bind:value={rules.appliances.withoutPermission[i]} />
        <button type="button" class="px-3 py-1 border rounded-lg"
                on:click={() => rules.appliances.withoutPermission = rules.appliances.withoutPermission.filter((_, idx) => idx !== i)}>Remove</button>
      </div>
    {/each}
    <button type="button" class="px-3 py-1 border rounded-lg"
            on:click={ () => {
              rules.appliances.withoutPermission = [...rules.appliances.withoutPermission, ""];
              rules = { ...rules };
            }}>+ Add item</button>
  </div>

  <!-- Other -->
  <section class="card p-4 space-y-3 border rounded-xl">
    <h2 class="font-semibold text-lg">Other Notes</h2>
    <textarea class="input w-full min-h-[120px]" bind:value={rules.other}></textarea>
  </section>

  <button on:click|preventDefault={handleSubmit} class="btn">Save (fake)</button>
</div>