<script lang="ts">

    import ProfileCard from "../../../components/ProfileCard.svelte";
    import UserHeader from "../../../components/UserHeader.svelte";
    import { notify } from "$lib/store/notify";
    import type { PageLoad } from "./$types";
    import ReviewSection from "../../../components/ReviewSection.svelte";
    let { data }: { data: import("./$types").PageData } = $props();

    type Message = {
      id: string;
      name: string;
    };
    type Profile = {
      name: string;
      age: number;
      gender: string;
      race: string;
      dateOfBirth: string;
      location: string;
      bio: string;
      inbox: Message[]; 
      interests: string[];
      preferences: string;
      images: string[];
    };
  
    const profile = $state<Profile>(data as Profile);
    async function save(part: "about" | "interests" | "preferences", data: unknown) {
        try {
            await fetch("/api/profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ part, data }) });
            notify.push("Saved", "success");
        } catch {
            notify.push("Failed to save", "error");
        }
    }

    const inbox = $state<Message[]>(profile.inbox);

    let selected = $state<Set<string>>(new Set());
    function toggle(tag: string) {
        const s = new Set(selected);
        s.has(tag) ? s.delete(tag) : s.add(tag);
        selected = s; // reassign to trigger reactivity
    }
    const isSelected = (tag: string) => selected.has(tag);
    
    const tabs = ["About", "Interests", "Preferences", "Inbox"];
    let current = $state(tabs[0]);
  </script>
  
  <UserHeader />

  <div class="mx-auto my-8 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
    <!-- Left: Tinder-style profile card -->
    <ProfileCard profile={profile} />
  
    <!-- Right: Tabs + forms -->
  <div class="flex h-[70vh] flex-col rounded-2xl bg-white p-4 shadow">
    <div class="mb-3 flex gap-2">
      {#each tabs as t}
        <button
          class="rounded-full px-4 py-2 text-sm transition {current === t ? 'bg-pink-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
          onpointerdown={() => (current = t)}>
          {t}
        </button>
      {/each}
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-100 p-4">
      {#if current === "About"}
        <form class="grid grid-cols-1 gap-4" onsubmit={() => save('about', { name: profile.name, age: profile.age, location: profile.location, bio: profile.bio, gender: profile.gender, race: profile.race })}>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Name</span>
            <input class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.name} />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Gender</span>
            <input class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.gender} />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Race</span>
            <input class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.race} />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Age</span>
            <input type="number" min="18" class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.age} />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Date of Birth</span>
            <input type="date" class="rounded-md border border-gray-300 px-3 py-2" min="1970-01-01" max="2025-10-20" bind:value={profile.dateOfBirth} />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Location</span>
            <input class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.location} />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Bio</span>
            <textarea rows="4" class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.bio} />
          </label>
          <div class="flex justify-end">
            <button type="submit" class="rounded-full bg-pink-500 px-4 py-2 text-white shadow hover:bg-pink-600">Save</button>
          </div>
        </form>

      {:else if current === "Interests"}
        <form class="grid gap-4" onsubmit={() => save('interests', { interests: profile.interests })}>
          <div class="flex flex-wrap gap-2">
            {#each profile.interests as tag}
                <button
                    onpointerdown={() => toggle(tag)}
                    class={isSelected(tag)
                    ? "rounded-full px-3 py-1 text-sm bg-green-500 text-white ring-1 ring-green-600 transition"
                    : "rounded-full px-3 py-1 text-sm bg-pink-50 text-pink-600 ring-1 ring-pink-200 transition"}
                >
                    {tag}
                </button>
            {/each}
          </div>
        </form>

      {:else if current === "Preferences"}
        <form class="grid gap-4" onsubmit={() => save('preferences', { preferences: profile.preferences })}>
          <label class="grid gap-1">
            <span class="text-xs font-medium text-gray-600">Preferences</span>
            <textarea rows="4" class="rounded-md border border-gray-300 px-3 py-2" bind:value={profile.preferences} />
          </label>
          <div class="flex justify-end">
            <button type="submit" class="rounded-full bg-pink-500 px-4 py-2 text-white shadow hover:bg-pink-600">Save</button>
          </div>
        </form>
      {:else if current === "Inbox"}
        <div class="flex flex-col gap-2 ">
          {#each inbox as m}
            <div class="flex flex-row gap-2 border-t border-gray-100 pt-4 items-center justify-between">
              <div class="flex flex-col gap-2">
                <p>{m.name}</p>
                <p>Wants to chat!</p>
              </div>
              <button class="rounded-full h-1/2 bg-pink-500 px-4 py-2 text-white shadow hover:bg-pink-600">Accept</button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <ReviewSection reviews={[]} />
  </div>