<script lang="ts">
	import type { MouseEventHandler } from "svelte/elements";

  let { 
    button_name,
    onclick,
  }: { 
    button_name: string,
    onclick: MouseEventHandler<HTMLButtonElement>,
  } = $props();
</script>

<button 
  {onclick} 
  class="
    px-6 py-2
    font-[var(--font-main)] font-bold text-sm tracking-wide
    text-[var(--text-color)]
    border border-[var(--primary-color)]
    bg-transparent
    cursor-pointer
    transition-all duration-200 ease-out
    hover:bg-[var(--primary-color)] 
    hover:text-[#181818]
    hover:shadow-[0_0_15px_rgba(255,140,0,0.4)]
    active:scale-95
  "
>
  {button_name}
</button>
