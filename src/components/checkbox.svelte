<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  interface CheckboxProps extends Omit<HTMLInputAttributes, "type" | "class" | "aria-invalid" | "aria-describedby"> {
    label: string;
    id: string;
    errorTextId?: string;
    errorText?: string;
  }

  const { label, id, errorTextId, errorText, ...rest }: CheckboxProps = $props();
</script>

<div class="flex flex-col gap-3">
  <div class="relative block h-5 pl-7 text-2xl select-none">
    <input {id} type="checkbox" class="peer sr-only" aria-invalid={!!errorText} aria-describedby={errorTextId} {...rest} />
    <label
      class={clsx(
        // Reading the following code is unadvised
        // Overall style for the checkbox
        "checkmark absolute top-0 left-0 size-5 rounded-[4px] border p-px text-sm transition-all duration-100 select-none",
        // The checkbox in default state
        "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-500",
        // The checkbox when not disabled
        "peer-[:not(:disabled)]:cursor-pointer",
        // The checkbox when hovered and not disabled
        "peer-[:not(:disabled):not(:checked)]:peer-hover:bg-gray-200 peer-[:not(:disabled):not(:checked)]:peer-hover:dark:bg-neutral-500/80",
        // The checkbox when checked
        "peer-checked:bg-accent-light dark:peer-checked:bg-accent-dark",
        "peer-checked:border-accent-light dark:peer-checked:border-accent-dark",
        // The checkbox when checked or disabled
        "peer-[:is(:disabled,:checked)]:border-accent-light dark:peer-[:is(:disabled,:checked)]:border-accent-dark",
        "peer-[:is(:disabled,:not(:disabled):checked:hover)]:bg-accent-light/80 dark:peer-[:is(:disabled,:not(:disabled):checked:hover)]:bg-accent-dark/80",
        "peer-[:is(:disabled,:not(:disabled):checked:hover)]:border-transparent",
        // The checkmark at the center of the checkbox
        "after:absolute after:top-1/2 after:left-1/2 after:hidden after:-translate-x-1/2 after:-translate-y-1/2 peer-checked:after:block",
        "after:text-base after:text-white after:content-[''] peer-checked:after:animate-checkbox-icon peer-checked:after:content-['✓'] after:dark:text-black"
      )}
      for={id}
    >
      <span class="absolute top-1/2 left-7 w-max -translate-y-1/2 text-black dark:text-white">{label}</span>
    </label>
  </div>
  {#if !!errorText && errorTextId}
    <p class="text-error" id={errorTextId}>{errorText}</p>
  {/if}
</div>
