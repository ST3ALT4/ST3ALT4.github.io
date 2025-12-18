<script lang="ts">
  import BlogCard from '$lib/components/BlogCard.svelte';
  let { data } = $props();
</script>

<div class="min-h-screen bg-[#181818] pt-32 pb-20 px-6">
  <div class="max-w-3xl mx-auto">
    <header class="mb-16">
      <h1 class="text-5xl font-bold text-white mb-4">Blogs</h1>
      <p class="text-xl text-gray-400 font-light">
        Notes on systems, graphics, and compilers.
      </p>
    </header>

    <div class="flex flex-col">
      {#each data.posts as post}
        <BlogCard {...post} />
      {/each}
    </div>
  </div>
</div>
