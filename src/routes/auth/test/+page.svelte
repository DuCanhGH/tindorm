<script lang="ts">
  import { authClient } from "$lib/auth";

  const session = authClient.useSession();
</script>

{#if $session.data}
  <div>
    <p>
      {$session?.data?.user.name}
    </p>
    <p>
      {$session?.data?.user.email}
    </p>
    <button
      onclick={async () => {
        await authClient.signOut();
      }}
    >
      Sign Out
    </button>
  </div>
{/if}
