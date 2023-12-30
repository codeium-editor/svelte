<script lang="ts">
  import { onMount } from 'svelte'

  let mounted = false

  onMount(() => {
    mounted = true
  })
</script>

<h1>Codeium in your browser! Bitch! 🔥</h1>
{#if mounted}
  {#await import('$lib/components')}
    <!-- If you like, add a skeleton/loader component here instead-->
    <p>Loading editor...</p>
  {:then { CodeiumEditor }}
    <svelte:component this={CodeiumEditor} />
  {/await}
{/if}
