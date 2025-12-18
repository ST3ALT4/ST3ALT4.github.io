<script lang="ts">
  let { title, date, tags, slug, description } = $props();
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
</script>

<a href={`/blog/${slug}`} class="card-wrapper group">
  <div class="header-row">
    <h2 class="card-title group-hover:text-[var(--primary-color)]">
      {title}
    </h2>
    <time class="card-date">{formattedDate}</time>
  </div>

  {#if description}
    <p class="card-description">
      {description}
    </p>
  {/if}

  <div class="tags-container">
    {#each tags as tag}
      <span class="card-tag">#{tag}</span>
    {/each}
  </div>
</a>

<style>
  @reference "tailwindcss" 
  .card-wrapper {
    @apply block py-6 border-b transition-colors;
    border-color: color-mix(in srgb, var(--text-color), transparent 90%);
  }

  /* Using :global or strict selector to handle hover state defined in HTML classes or here */
  .card-wrapper:hover {
    border-color: color-mix(in srgb, var(--primary-color), transparent 50%);
  }

  .header-row {
    @apply flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2;
  }

  .card-title {
    @apply text-2xl font-bold transition-colors;
    color: var(--text-color);
  }

  .card-date {
    @apply text-sm font-mono shrink-0;
    color: color-mix(in srgb, var(--text-color), transparent 40%);
  }

  .card-description {
    @apply mb-4 font-light leading-relaxed;
    color: color-mix(in srgb, var(--text-color), transparent 20%);
  }

  .tags-container {
    @apply flex gap-3;
  }

  .card-tag {
    @apply text-xs font-mono;
    color: color-mix(in srgb, var(--primary-color), transparent 20%);
  }
</style>
