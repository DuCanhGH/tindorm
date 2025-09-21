<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { notify } from "$lib/store/notify";
  
    // Form state
    let dob = $state("");
    let school = $state("");
    let classYear = $state<number | "">("");
    let country = $state("");
  
    // Date constraints
    const minDob = "1970-01-01";
    let maxDob = $state("2025-09-20");
    onMount(() => {
      const today = new Date();
      const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      maxDob = iso; // no future DoB
    });
  
    // Class year constraints (reasonable window)
    const year = new Date().getFullYear();
    const minYear = year - 10;
    const maxYear = year + 10;
  
    const countries = [
        "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
        "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
        "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
        "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
        "Cote d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
        "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
        "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
        "Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
        "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
        "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
        "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico",
        "Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru",
        "Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
        "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
        "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia",
        "Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa",
        "South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
        "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Türkiye","Turkmenistan",
        "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City",
        "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
    ];
        
    let submitting = $state(false);
    let errors = $state<{ dob?: string; school?: string; classYear?: string; country?: string; general?: string }>({});
  
    function validate() {
        const e: typeof errors = {};
        if (!dob) e.dob = "Required";
        else if (dob > maxDob) e.dob = "Must be in the past";
        if (!school || school.trim().length < 2) e.school = "Enter a valid school";
        if (classYear === "" || Number.isNaN(Number(classYear))) e.classYear = "Enter a year";
        else if (+classYear < minYear || +classYear > maxYear) e.classYear = `Year must be between ${minYear}-${maxYear}`;
        if (!country) e.country = "Select a country";
        errors = e;
        return Object.keys(e).length === 0;
    }
  
    async function submit(e: SubmitEvent) {
        e.preventDefault();
        if (!validate()) return;
        submitting = true;
        try {
            // TODO: POST to your API
            await fetch("/api/register", { 
                method:"POST", 
                headers:{ "content-type":"application/json" },
                body: JSON.stringify({ dob, school, classYear:+classYear, country }) 
            });
            notify.push("Profile details saved", "success");
            goto("/profile/self");
        } catch {
            errors = { general: "Could not save details. Try again." };
        } finally {
            submitting = false;
        }
    }
</script>
  
<svelte:head>
    <title>Complete your profile | Tindorm</title>
</svelte:head>
  
<div class="purdue-gradient relative min-h-screen overflow-hidden">
    <!-- Background orbs -->
    <div class="floating-orb orb-1"></div>
    <div class="floating-orb orb-2"></div>
    <div class="floating-orb orb-3"></div>
  
    <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div class="glass-effect w-full max-w-xl rounded-3xl p-8">
            <div class="mb-8">
            <div class="flex gap-4">
                <div class="logo-glow mb-4">
                <i class="fas fa-home bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-4xl text-transparent"></i>
                </div>
                <h1 class="mb-2 text-4xl font-bold text-white">Tindorm</h1>
            </div>
            <div class="purdue-gold mt-4 h-1 w-full rounded-full"></div>
            </div>
    
            <div class="mb-6">
            <h2 class="mb-2 text-2xl font-semibold text-white">Tell us about you</h2>
            <p class="text-sm text-gray-300">These details help us improve your matches.</p>
            </div>
    
            {#if errors.general}
            <div class="mb-4 rounded-lg border border-red-500 bg-red-900/30 p-3 text-sm text-red-200">
                {errors.general}
            </div>
            {/if}
    
            <form class="space-y-5" onsubmit={submit}>
            <!-- Date of Birth -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">Date of birth</label>
                <input
                type="date"
                bind:value={dob}
                min={minDob}
                max={maxDob}
                required
                class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
                />
                {#if errors.dob}<p class="mt-1 text-xs text-red-400">{errors.dob}</p>{/if}
            </div>
    
            <!-- School -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">School</label>
                <input
                type="text"
                bind:value={school}
                minlength="2"
                placeholder="Purdue University"
                class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
                />
                {#if errors.school}<p class="mt-1 text-xs text-red-400">{errors.school}</p>{/if}
            </div>
    
            <!-- Class Year -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">Class year</label>
                <input
                type="number"
                bind:value={classYear}
                min={minYear}
                max={maxYear}
                step="1"
                placeholder={String(year)}
                class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
                />
                {#if errors.classYear}<p class="mt-1 text-xs text-red-400">{errors.classYear}</p>{/if}
            </div>
    
            <!-- Birth Country -->
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-300">Birth country</label>
                <input
                list="country-list"
                bind:value={country}
                placeholder="Select or type..."
                class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
                />
                <datalist id="country-list">
                {#each countries as c}<option value={c}>{c}</option>{/each}
                </datalist>
                {#if errors.country}<p class="mt-1 text-xs text-red-400">{errors.country}</p>{/if}
            </div>
    
            <button
                type="submit"
                class="btn-hover purdue-gold relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-black transition-all disabled:cursor-not-allowed disabled:opacity-50"
                disabled={submitting}
                onpointerdown={() => { /* ensure pointerdown preferred */ }}
            >
                {#if submitting}
                <i class="fas fa-spinner fa-spin mr-2"></i> Saving...
                {:else}
                <i class="fas fa-arrow-right mr-2"></i> Continue
                {/if}
            </button>
            </form>
        </div>
    </div>
    
    <div class="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/50 to-transparent"></div>
</div>
    
<style>
    .purdue-gradient { background: linear-gradient(135deg,#000 0%,#1a1a1a 15%,#2d2419 35%,#3d3123 50%,#4a3c2a 65%,#cfb991 85%,#e6d7b3 100%); }
    .purdue-gold { background: linear-gradient(135deg,#cfb991 0%,#b1a172 50%,#8b7b47 100%); }
    .glass-effect { background: rgba(255,255,255,.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,.2); }
    .floating-orb { position: absolute; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(207,185,145,.8), rgba(207,185,145,.2)); filter: blur(1px); animation: float 6s ease-in-out infinite; }
    .orb-1 { width: 60px; height: 60px; top: 10%; left: 20%; animation-delay: 0s; }
    .orb-2 { width: 40px; height: 40px; top: 70%; right: 15%; animation-delay: 2s; }
    .orb-3 { width: 80px; height: 80px; top: 40%; right: 10%; animation-delay: 4s; }
    @keyframes float{0%,100%{transform:translateY(0) rotate(0)}33%{transform:translateY(-20px) rotate(120deg)}66%{transform:translateY(10px) rotate(240deg)}}
    .logo-glow { filter: drop-shadow(0 0 20px rgba(207,185,145,.5)); }
</style>