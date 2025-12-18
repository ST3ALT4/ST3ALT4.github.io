<script lang="ts">
  let { data } = $props();
</script>

{#if !data}
  <p style="color: red;">Error: No data received.</p>
{:else}
  
  <div class="blog-content">
     <data.content />
  </div>

{/if}
