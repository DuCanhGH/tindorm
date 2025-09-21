<script lang="ts">
    import { onMount } from "svelte";
    import { filters, type PreferencesState, countries as COUNTRY_LIST } from "$lib/store/filters";
  
    let { open = $bindable(false) } = $props();
  
    type CatOption = { id: string; label: string };
    type Category = { id: string; name: string; options: CatOption[] };
  
    let categories = $state<Category[]>([]);
    let loadingCats = $state(true);
    
    // Local selections
    let selectedCountries = $state<string[]>([]);
    let selectedYears = $state<number[]>([]);
    let selectedByCat = $state<Record<string, Set<string>>>({});
    let ratingEnabled = $state(false);
    let ratingOp: "over" | "under" = $state("over");
    let ratingValue = $state(3);
  
    const yearNow = new Date().getFullYear();
    const minYear = yearNow - 15;
    const maxYear = yearNow + 5;
    const yearRange = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  
    const fallbackCategories: Category[] = [
      {
        id: "sleep_schedule",
        name: "Sleep schedule",
        options: [
          { id: "early_bird", label: "Early bird" },
          { id: "night_owl", label: "Night owl" },
          { id: "flexible", label: "Flexible" }
        ]
      },
      {
        id: "noise_levels",
        name: "Noise levels",
        options: [
          { id: "quiet", label: "Quiet" },
          { id: "moderate", label: "Moderate" },
          { id: "loud", label: "Loud OK" }
        ]
      },
      {
        id: "visitors",
        name: "Friends & visitors",
        options: [
          { id: "rare", label: "Rarely" },
          { id: "sometimes", label: "Sometimes" },
          { id: "often", label: "Often" }
        ]
      }
    ];
  
    onMount(() => {
        categories = fallbackCategories;
        selectedByCat = Object.fromEntries(categories.map(c => [c.id, new Set<string>()]));
        loadingCats = false;
    });
  
    function toggleSet(s: Set<string>, v: string) {
      if (s.has(v)) s.delete(v); else s.add(v);
      selectedByCat = { ...selectedByCat };
    }
  
    function apply() {
      const state: PreferencesState = {
        countries: [...selectedCountries],
        classYears: [...selectedYears],
        categories: Object.fromEntries(Object.entries(selectedByCat).map(([k, v]) => [k, Array.from(v)])),
        rating: ratingEnabled ? { op: ratingOp, value: ratingValue } : null
      };
      filters.set(state);
      open = false
    }
  
    function clearAll() {
      selectedCountries = [];
      selectedYears = [];
      selectedByCat = Object.fromEntries(categories.map(c => [c.id, new Set<string>()]));
      ratingEnabled = false;
      ratingOp = "over";
      ratingValue = 3;
    }

    function closeIfBackdrop(e: PointerEvent) {
      if ((e.target as HTMLElement)?.dataset?.backdrop === "1") open = false;
    }

</script>
  
  {#if open}
  <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" data-backdrop="1" onpointerdown={closeIfBackdrop}></div>
  
    <div class="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-neutral-900 border border-white/15 shadow-xl p-4 sm:p-6 text-white">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">Preferences</h3>
        <button class="rounded-full px-3 py-1 bg-white/10 hover:bg-white/20" aria-label="Close" onpointerdown={() => (open = false)}>✕</button>
      </div>
  
      <div class="space-y-6">
        <div class="text-xs text-white/60">School filter is applied automatically based on your profile.</div>
  
        <!-- Countries: multi -->
        <section>
          <div class="mb-2 font-medium">Countries</div>
          <div class="flex flex-wrap gap-2 mb-2">
            {#each selectedCountries as c}
              <span class="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs">
                {c}
                <button class="ml-1 rounded-full bg-white/10 px-1" onpointerdown={() => (selectedCountries = selectedCountries.filter(x => x !== c))}>×</button>
              </span>
            {/each}
          </div>
          <input
            list="countries"
            placeholder="Type to add..."
            class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 placeholder-white/40"
            onchange={(e: Event) => {
              const v = (e.target as HTMLInputElement).value.trim();
              if (v && !selectedCountries.includes(v)) selectedCountries = [...selectedCountries, v];
              (e.target as HTMLInputElement).value = "";
            }}
          />
          <datalist id="countries">
            {#each COUNTRY_LIST as c}<option value={c} />{/each}
          </datalist>
        </section>
  
        <!-- Class of: multi -->
        <section>
          <div class="mb-2 font-medium">Class of</div>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {#each yearRange as y}
              <button
                class={`px-3 py-2 rounded-lg border text-sm ${selectedYears.includes(y) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}
                onpointerdown={() => {
                  selectedYears = selectedYears.includes(y)
                    ? selectedYears.filter(a => a !== y)
                    : [...selectedYears, y];
                }}
              >
                {y}
              </button>
            {/each}
          </div>
        </section>
  
        <!-- Preferences categories -->
        <section>
          <div class="mb-2 font-medium">Categories</div>
          {#if loadingCats}
            <div class="text-sm text-white/60">Loading...</div>
          {:else}
            {#each categories as cat}
              <div class="mb-3">
                <div class="text-sm text-white/80 mb-2">{cat.name}</div>
                <div class="flex flex-wrap gap-2">
                  {#each cat.options as opt}
                    <button
                      class={`px-3 py-1.5 rounded-full text-xs border ${selectedByCat[cat.id]?.has(opt.id) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}
                      onpointerdown={() => toggleSet(selectedByCat[cat.id], opt.id)}
                    >
                      {opt.label}
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          {/if}
        </section>
  
        <!-- Rating -->
        <section>
          <div class="mb-2 font-medium">Rating</div>
          <div class="flex items-center gap-3 mb-2">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={ratingEnabled} oninput={(e) => (ratingEnabled = (e.target as HTMLInputElement).checked)} />
              Enable rating filter
            </label>
            <div class="ml-auto flex items-center gap-2 text-sm">
              <button class={`px-2 py-1 rounded ${ratingOp === 'over' ? 'bg-white text-black' : 'bg-white/10'}`} onpointerdown={() => (ratingOp = "over")}>Over</button>
              <button class={`px-2 py-1 rounded ${ratingOp === 'under' ? 'bg-white text-black' : 'bg-white/10'}`} onpointerdown={() => (ratingOp = "under")}>Under</button>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <input type="range" min="0" max="5" step="0.5" disabled={!ratingEnabled} bind:value={ratingValue} class="w-full" />
            <div class={`w-12 text-center text-sm ${ratingEnabled ? '' : 'text-white/40'}`}>{ratingValue}</div>
          </div>
          <div class="text-xs text-white/60 mt-1">Freshmen are not excluded by this setting (handled server-side).</div>
        </section>
      </div>
  
      <div class="mt-6 flex items-center justify-between">
        <button class="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20" onpointerdown={clearAll}>Clear</button>
        <div class="flex items-center gap-2">
          <button class="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20" onpointerdown={() => (open = false)}>Cancel</button>
          <button class="rounded-xl px-4 py-2 bg-white text-black hover:bg-white/90" onpointerdown={apply}>Apply</button>
        </div>
      </div>
    </div>
  </div>
{/if}