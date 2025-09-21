<script lang="ts">
    let { fraction = 0, size = "1" } = $props(); // size: "1rem", "20px", etc.
    let pct = $derived(Math.max(0, Math.min(1, fraction)) * 100);
  </script>
  
  <div class="relative inline-block align-middle" style={`width:${size}rem;height:${size}rem;`}>
    <!-- bottom gray -->
    <svg viewBox="0 0 24 24" class="absolute inset-0 text-gray-300" fill="currentColor" width="100%" height="100%">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  
    <!-- top yellow (full size), cropped via clip-path -->
    <svg
      viewBox="0 0 24 24"
      class="absolute inset-0 text-yellow-400"
      fill="currentColor"
      width="100%"
      height="100%"
      style={`clip-path: inset(0 calc(100% - ${pct}%) 0 0);`}
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  </div>