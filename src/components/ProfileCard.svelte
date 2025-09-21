<script lang="ts">
    let { profile } = $props();
</script>

<div class="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-black/5 shadow">
    <div
      class="absolute inset-0"
      style="
        background-image: url('{profile.images[0]}');
        background-size: cover;
        background-position: center;
      "
    ></div> 
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-3xl font-semibold">{profile.name}, {profile.age}</h1>
          <p class="mt-1 text-sm text-white/80">{profile.location}</p>
        </div>
      </div>
    </div>
  </div>