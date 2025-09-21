<script lang="ts">
    import { goto } from "$app/navigation";
  
    let links = [
        { label: "Home", href: "/" },
        { label: "Profile", href: "/profile/self" },
        { label: "Chats", href: "/chats" },
        { label: "Logout", href: "/auth/logout" },
        { label: "Candidates", href: "/candidates" }
    ];
    let open = $state(false);
  
    function nav(path: string) {
      goto(path);
      open = false;
    }
  </script>
  
  <header class="sticky top-0 z-[60] bg-white/70 backdrop-blur border-b border-gray-200">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
      <button
        aria-label="Open menu"
        class="rounded-full p-2 text-gray-800 hover:bg-gray-100"
        onpointerdown={() => (open = true)}
      >
        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
  
      <div class="text-sm font-semibold text-gray-900">tindorm</div>
  
      <div class="w-6" />
    </div>
  </header>
  
  {#if open}
    <!-- overlay -->
    <div
        class="fixed inset-0 z-[70] bg-black/40 transition-opacity duration-200"
        class:opacity-0={!open}
        class:pointer-events-none={!open}
        onpointerdown={() => (open = false)}
    />

  
    <!-- drawer -->
    <aside
        class="fixed left-0 top-0 z-[75] h-full w-72 bg-white shadow-xl transition-transform duration-200 will-change-transform"
        style={`transform: translateX(${open ? '0' : '-100%'});`}
    >
      <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div class="text-base font-semibold">tindorm</div>
        <button
          aria-label="Close menu"
          class="rounded-full p-2 text-gray-700 hover:bg-gray-100"
          onpointerdown={() => (open = false)}
        >
          ✕
        </button>
      </div>
  
      <nav class="px-2 py-2">
        {#each links as l}
          <button
            class="w-full rounded-lg px-3 py-2 text-left text-gray-800 hover:bg-gray-100"
            onpointerdown={() => nav(l.href)}
          >
            {l.label}
          </button>
        {/each}
      </nav>
    </aside>
  {/if}