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
    
  
    function viewProfile(id: string) {
        goto(`/profile/${encodeURIComponent(id)}`);
    }
  </script>
  
  <UserHeader/>
  
  <main class="mx-auto w-full max-w-4xl flex flex-col items-center px-4 py-8">
    <!-- Middle section list -->
    <div class="max-w-[70%] w-full space-y-4 mt-4">
      {#each candidates as c (c.id)}
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
    </div>
  </main>