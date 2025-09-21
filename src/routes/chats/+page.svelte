<script lang="ts">
    import UserHeader from "../../components/UserHeader.svelte";
    import { notify } from "$lib/store/notify";
  
    type ChatUser = { id: string; name: string; avatar: string; last: string; active?: boolean };
    type Message = { id: string; from: string; text: string; time: string };
    let { data }: { data: import("./$types").PageData } = $props();
    
    let users = $state(data.users as ChatUser[]);  
    let messagesByUser = $state(data.messages as Record<string, Message[]>);
    let currentId = $state("");
  
    let input = $state("");
  
    function select(id: string) {
        currentId = id;
        users.forEach((u) => (u.active = u.id === id));
    }
  
    function send() {
        const text = input.trim();
        if (!currentId) return;
        if (!text) return;
        const arr = messagesByUser[currentId] ?? (messagesByUser[currentId] = []);
        arr.push({ id: crypto.randomUUID(), from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
        input = "";
    
        fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({
                message: text
            })
        }).then(async (res) => {
            if (res.ok) {
                notify.push("Message sent", "success");
            }
        });
    }
  </script>
  
  <UserHeader />
  
  <div class="mx-auto my-6 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-[320px_1fr]">
    <aside class="rounded-2xl bg-white shadow ring-1 ring-gray-100">
        <div class="border-b border-gray-100 p-4">
            <h2 class="text-lg font-semibold">Messages</h2>
        </div>
        <ul class="max-h-[75vh] overflow-y-auto">
            {#each users as u}
            <li
                class="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-gray-50 {u.active ? 'bg-pink-50' : ''}"
                onpointerdown={() => select(u.id)}
            >
                <img src={u.avatar} alt="" class="h-10 w-10 rounded-full object-cover" />
                <div class="min-w-0">
                <p class="truncate text-sm font-medium text-gray-900">{u.name}</p>
                <!-- <p class="truncate text-xs text-gray-500">{u.last}</p> -->
                </div>
            </li>
            {/each}
        </ul>
    </aside>
  
    <section class="flex h-[75vh] flex-col overflow-hidden rounded-2xl bg-white shadow ring-1 ring-gray-100">
      {#if currentId}
        <header class="flex items-center gap-3 border-b border-gray-100 p-4">
            <img src={users.find((u) => u.id === currentId)?.avatar} alt="" class="h-10 w-10 rounded-full object-cover" />
            <div class="min-w-0">
                <h3 class="truncate text-base font-semibold text-gray-900">{users.find((u) => u.id === currentId)?.name}</h3>
                <p class="text-xs text-gray-500">Active now</p>
            </div>
        </header>
    
        <div class="flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-pink-50/40 to-white p-4">
            {#each messagesByUser[currentId] ?? [] as m}
                {#if m.from === "me"}
                <div class="flex justify-end">
                    <div class="max-w-[70%] rounded-2xl bg-pink-500 px-4 py-2 text-sm text-white shadow">
                        <p>{m.text}</p>
                    <p class="mt-1 text-[10px] text-white/80 text-right">{m.time}</p>
                    </div>
                </div>
                {:else}
                <div class="flex justify-start">
                    <div class="max-w-[70%] rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-900 shadow">
                        <p>{m.text}</p>
                    <p class="mt-1 text-[10px] text-gray-500 text-right">{m.time}</p>
                    </div>
                </div>
                {/if}
            {/each}
            </div>
        
            <div class="flex items-center gap-2 border-t border-gray-100 p-3">
            <input
                class="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                placeholder="Type a message"
                bind:value={input}
                onkeydown={(e) => e.key === 'Enter' && send()}
            />
            <button
                class="rounded-full bg-pink-500 px-4 py-2 text-white shadow transition hover:bg-pink-600"
                onpointerdown={send}
            >
            Send
          </button>
        </div>
        {:else}
            <div class="flex h-full items-center justify-center p-4 text-sm text-gray-500">
                <p>Select a conversation to start chatting</p>
            </div>
      {/if}
    </section>
</div>