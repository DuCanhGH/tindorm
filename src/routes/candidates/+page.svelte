<script lang="ts">
    import UserHeader from "../../components/UserHeader.svelte";
    import { goto } from "$app/navigation";
  
    let { data }: { data: import("./$types").PageData } = $props();
  
    type Candidate = {
        id: string;
        name: string;
        age: number;
        location: string;
        bio: string;
        image: string;
    };
  
    let candidates = data.candidates as Candidate[];
    let rejects = data.rejects as Candidate[];
  
    let activeTab: "candidates" | "rejects" = $state("candidates");
    const list = $derived(activeTab === "candidates" ? candidates : rejects);

  
    function viewProfile(id: string) {
        goto(`/profile/${encodeURIComponent(id)}`);
    }
  </script>
  
  <UserHeader/>
  
  <main class="mx-auto w-full max-w-6xl px-4 py-8">
    <!-- Tabs -->
    <div class="mx-auto w-full max-w-3xl">
      <div class="flex items-center gap-2 rounded-xl bg-white p-1 shadow ring-1 ring-gray-100">
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition
            {activeTab === 'candidates' ? 'bg-pink-500 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}"
          onpointerdown={() => (activeTab = "candidates")}
        >
          Candidates ({candidates.length})
        </button>
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition
            {activeTab === 'rejects' ? 'bg-pink-500 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}"
          onpointerdown={() => (activeTab = "rejects")}
        >
          Rejects ({rejects.length})
        </button>
      </div>
    </div>
  
    <!-- List -->
    <div class="mx-auto mt-6 w-full max-w-3xl space-y-4">
      <h2 class="text-lg font-semibold text-center capitalize">{activeTab}</h2>
      {#if list.length === 0}
        <div class="rounded-2xl bg-white p-6 text-center text-gray-500 ring-1 ring-gray-100 shadow">
          No {activeTab} yet.
        </div>
      {:else}
        {#each list as c (c.id)}
          <article class="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow ring-1 ring-gray-100">
            <div class="flex min-w-0 items-center gap-4">
              <div class="h-10 w-10 overflow-hidden rounded-full shrink-0">
                <img
                  src={c.image}
                  alt=""
                  class="h-full w-full flex-none rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="min-w-0">
                <div class="flex items-baseline gap-2 text-gray-900">
                  <h3 class="truncate text-lg font-semibold">{c.name}</h3>
                  <span class="text-sm text-gray-500">{c.age}</span>
                </div>
                <p class="truncate text-sm text-gray-600">{c.location}</p>
                <p class="mt-1 line-clamp-2 text-sm text-gray-700">{c.bio}</p>
              </div>
            </div>
  
            <div class="flex flex-none items-center">
              <button
                class="rounded-full bg-pink-500 px-4 py-2 text-white shadow transition hover:bg-pink-600"
                onpointerdown={() => viewProfile(c.id)}
              >
                View profile
              </button>
            </div>
          </article>
        {/each}
      {/if}
 
    </div>
  </main>