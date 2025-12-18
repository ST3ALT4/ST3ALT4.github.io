<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';  
  import { ROUTES } from '$lib/routes'; 
</script>

<nav class="fixed top-0 left-0 z-50 w-full h-16 px-6 flex justify-between items-center 
            bg-[var(--bg-color)]/90 backdrop-blur-md 
            border-b border-[var(--primary-color)] shadow-lg shadow-black/20">
  
  <div class="cursor-pointer select-none group" 
       onclick={() => goto(ROUTES.home.index)} 
       onkeydown={() => goto(ROUTES.home.index)} 
       role="button" 
       tabindex="0">
    <h1 class="text-2xl font-bold font-[var(--font-main)] tracking-tight text-white transition-colors duration-300 group-hover:text-[var(--primary-color)]">
      Ani<span class="text-[var(--primary-color)]">.</span>
    </h1>
  </div>
  
  <div class="flex items-center gap-4">
    <Button onclick={() => goto(ROUTES.home.index)} button_name="Home" />
    <Button onclick={() => goto(ROUTES.home.blogList)} button_name="Blog" />
    <Button onclick={() => window.open("https://github.com/ST3ALT4", "_blank")} button_name="Projects" />
  </div>
</nav>
