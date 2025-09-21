<script lang="ts">
  import { authClient } from "$lib/auth";
  import { getSwipes } from "./functions.remote";

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
    <pre>
      {JSON.stringify(await getSwipes("left"), null, 2)}
    </pre>
    <button
      onclick={async () => {
        await authClient.signOut();
      }}
    >
      Sign Out
    </button>
  </div>
{/if}
