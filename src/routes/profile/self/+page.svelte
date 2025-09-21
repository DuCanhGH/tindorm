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

<!-- Dark background gradient from dark brown to golden yellow -->
<div class="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-700 to-yellow-500">
  <UserHeader />

  <div class="mx-auto my-8 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
    <!-- Left: Tinder-style profile card -->
    <ProfileCard profile={profile} />
  
    <!-- Right: Tabs + forms with golden theme -->
    <div class="flex h-[70vh] flex-col rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-amber-900/20 border border-amber-200/50">
      <div class="mb-4 flex gap-2">
        {#each tabs as t}
          <button
            class="rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-200 {current === t 
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30 transform scale-105' 
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 hover:shadow-md border border-amber-200'}"
            onpointerdown={() => (current = t)}>
            {t}
          </button>
        {/each}
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white/50 p-5">
        {#if current === "About"}
          <form class="grid grid-cols-1 gap-5" onsubmit={() => save('about', { name: profile.name, age: profile.age, location: profile.location, bio: profile.bio, gender: profile.gender, race: profile.race })}>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Name</span>
              <input class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.name} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Gender</span>
              <input class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.gender} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Race</span>
              <input class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.race} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Date of Birth</span>
              <input type="date" class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.dateOfBirth} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Age</span>
              <input type="number" min="18" class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.age} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Location</span>
              <input class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.location} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Bio</span>
              <textarea rows="4" class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 resize-none focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.bio}></textarea>
            </label>
            <div class="flex justify-end pt-4">
              <button type="submit" class="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/40 focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-95">
                Save Changes
              </button>
            </div>
          </form>

        {:else if current === "Interests"}
          <form class="grid gap-4" onsubmit={() => save('interests', { interests: profile.interests })}>
            <div class="flex flex-wrap gap-3">
              {#each profile.interests as tag}
                <button
                  type="button"
                  onpointerdown={() => toggle(tag)}
                  class={isSelected(tag)
                  ? "rounded-2xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 transform scale-105 transition-all"
                  : "rounded-2xl px-4 py-2 text-sm font-medium bg-amber-100 text-amber-800 border-2 border-amber-200 hover:bg-amber-200 hover:border-amber-300 hover:shadow-md transition-all"}
                >
                  {tag}
                </button>
              {/each}
            </div>
            <div class="flex justify-end pt-4">
              <button type="submit" class="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/40 focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-95">
                Save Interests
              </button>
            </div>
          </form>

        {:else if current === "Preferences"}
          <form class="grid gap-4" onsubmit={() => save('preferences', { preferences: profile.preferences })}>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Preferences</span>
              <textarea rows="4" class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 resize-none focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.preferences}></textarea>
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Gender</span>
              <input class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.gender} />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-amber-800">Race</span>
              <input class="rounded-xl border-2 border-amber-200 bg-white/80 px-4 py-3 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all" bind:value={profile.race} />
            </label>
            <div class="flex justify-end pt-4">
              <button type="submit" class="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/40 focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-95">
                Save
              </button>
            </div>
          </form>
                    
        {:else if current === "Inbox"}
          <div class="flex flex-col gap-4">
            {#each inbox as m}
              <div class="flex flex-row gap-4 items-center justify-between rounded-2xl border-2 border-amber-200 bg-white/60 p-4 transition-all hover:bg-white/80 hover:shadow-md">
                <div class="flex flex-col gap-1">
                  <p class="font-semibold text-amber-900">{m.name}</p>
                  <p class="text-sm text-amber-700">Wants to chat!</p>
                </div>
                <button class="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-2 font-medium text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/40 focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-95">Accept</button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <ReviewSection reviews={[]} />
  </div>
</div>