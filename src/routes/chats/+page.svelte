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

<!-- Vertical gradient from dark brown at top to golden brown at bottom -->
<div class="min-h-screen bg-gradient-to-b from-amber-900 to-yellow-700">
  <UserHeader />
  
  <div class="mx-auto my-6 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-[320px_1fr]">
    <!-- Sidebar with user list -->
    <aside class="rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl shadow-amber-900/20 border border-amber-200/50">
        <div class="border-b border-amber-100 p-5">
            <h2 class="text-lg font-bold text-amber-800">Messages</h2>
        </div>
        <ul class="max-h-[75vh] overflow-y-auto">
            {#each users as u}
            <li
                class="flex cursor-pointer items-center gap-3 px-4 py-4 transition-all duration-200 hover:bg-amber-50/50 {u.active ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-r-4 border-amber-400' : ''}"
                onpointerdown={() => select(u.id)}
            >
                <div class="relative">
                    <img src={u.avatar} alt="" class="h-12 w-12 rounded-full object-cover border-2 border-amber-200 shadow-md" />
                    <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
                </div>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-amber-900">{u.name}</p>
                    <p class="truncate text-xs text-amber-600">Active now</p>
                </div>
                {#if u.active}
                    <div class="h-2 w-2 rounded-full bg-amber-400"></div>
                {/if}
            </li>
            {/each}
        </ul>
    </aside>
  
    <!-- Main chat area -->
    <section class="flex h-[75vh] flex-col overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl shadow-amber-900/20 border border-amber-200/50">
      {#if currentId}
        <!-- Chat header -->
        <header class="flex items-center gap-4 border-b border-amber-100 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 p-5">
            <div class="relative">
                <img src={users.find((u) => u.id === currentId)?.avatar} alt="" class="h-12 w-12 rounded-full object-cover border-2 border-amber-300 shadow-md" />
                <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
            </div>
            <div class="min-w-0">
                <h3 class="truncate text-lg font-bold text-amber-900">{users.find((u) => u.id === currentId)?.name}</h3>
                <p class="text-sm text-amber-600">Active now</p>
            </div>
        </header>
    
        <!-- Messages area -->
        <div class="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-amber-50/30 to-white/50 p-5">
            {#each messagesByUser[currentId] ?? [] as m}
                {#if m.from === "me"}
                <div class="flex justify-end">
                    <div class="max-w-[70%] rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 text-sm text-white shadow-lg shadow-amber-500/30">
                        <p class="font-medium">{m.text}</p>
                        <p class="mt-1 text-[10px] text-white/80 text-right">{m.time}</p>
                    </div>
                </div>
                {:else}
                <div class="flex justify-start">
                    <div class="max-w-[70%] rounded-2xl bg-white border-2 border-amber-200 px-4 py-3 text-sm text-amber-900 shadow-md">
                        <p class="font-medium">{m.text}</p>
                        <p class="mt-1 text-[10px] text-amber-600 text-right">{m.time}</p>
                    </div>
                </div>
                {/if}
            {/each}
        </div>
        
        <!-- Input area -->
        <div class="flex items-center gap-3 border-t border-amber-100 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 p-4">
            <input
                class="flex-1 rounded-2xl border-2 border-amber-200 bg-white/90 px-5 py-3 text-sm text-amber-900 placeholder-amber-500 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 focus:bg-white"
                placeholder="Type your message..."
                bind:value={input}
                onkeydown={(e) => e.key === 'Enter' && send()}
            />
            <button
                class="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/40 focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-95"
                onpointerdown={send}
            >
                Send
            </button>
        </div>
        {:else}
            <!-- Empty state -->
            <div class="flex h-full items-center justify-center p-8">
                <div class="text-center">
                    <div class="text-6xl text-amber-300 mb-4">💬</div>
                    <p class="text-lg font-medium text-amber-800 mb-2">Select a conversation</p>
                    <p class="text-sm text-amber-600">Choose someone from your contacts to start chatting</p>
                </div>
            </div>
      {/if}
    </section>
  </div>
</div>