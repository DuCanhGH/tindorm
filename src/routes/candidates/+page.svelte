<script lang="ts">
  import UserHeader from "../../components/UserHeader.svelte";
  import type { PageProps } from "./$types";
  import { resolve } from "$app/paths";
  import { notify } from "$lib/store/notify";
  import { sendMergeRequest } from "./$fn.remote";

  let activeTab = $state<"candidates" | "rejects">("candidates");

  const { data }: PageProps = $props();

  const list = $derived(activeTab === "candidates" ? data.candidates : data.rejects);
</script>

<UserHeader />

<main class="mx-auto w-full max-w-6xl px-4 py-8">
  <svelte:boundary>
    <!-- Tabs -->
    <div class="mx-auto w-full max-w-3xl">
      <div class="flex items-center gap-2 rounded-xl bg-white p-1 shadow ring-1 ring-gray-100">
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition
            {activeTab === 'candidates' ? 'bg-pink-500 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}"
          onpointerdown={() => (activeTab = "candidates")}
        >
          Candidates ({data.candidates.length})
        </button>
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition
            {activeTab === 'rejects' ? 'bg-pink-500 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}"
          onpointerdown={() => (activeTab = "rejects")}
        >
          Rejects ({data.rejects.length})
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="mx-auto mt-6 w-full max-w-3xl space-y-4">
      <h2 class="text-center text-lg font-semibold capitalize">{activeTab}</h2>
      {#if list.length === 0}
        <div class="rounded-2xl bg-white p-6 text-center text-gray-500 shadow ring-1 ring-gray-100">
          No {activeTab} yet.
        </div>
      {:else}
        {#each list as c (c.id)}
          <article class="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow ring-1 ring-gray-100">
            <div class="flex min-w-0 items-center gap-4">
              <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop"
                  alt=""
                  class="h-full w-full flex-none rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="min-w-0">
                <div class="flex items-baseline gap-2 text-gray-900">
                  <h3 class="truncate text-lg font-semibold">{c.name}</h3>
                  <span class="text-sm text-gray-500">Class of {c.profile?.classYear}</span>
                </div>
                <p class="truncate text-sm text-gray-600">{c.profile?.school?.name}</p>
                <p class="mt-1 line-clamp-2 text-sm text-gray-700">{c.profile?.bio}</p>
              </div>
            </div>

            <div class="flex flex-none items-center gap-3">
              <form
                {...sendMergeRequest.enhance(async ({ form, submit }) => {
                  try {
                    await submit();
                    form.reset();
                    notify.push("Match request sent", "success");
                  } catch {
                    notify.push("Could not send request", "error");
                  }
                })}
              >
                <input name="toUser" type="hidden" value={c.id} />
                <button type="submit" class="rounded-full bg-red-500 px-4 py-2 text-white shadow transition hover:bg-red-600"> Request match </button>
              </form>
              <a href={resolve(`/profile/${c.id}`)} class="rounded-full bg-pink-500 px-4 py-2 text-white shadow transition hover:bg-pink-600">
                View profile
              </a>
            </div>
          </article>
        {/each}
      {/if}
    </div>
    {#snippet pending()}
      Loading...
    {/snippet}
  </svelte:boundary>
</main>
