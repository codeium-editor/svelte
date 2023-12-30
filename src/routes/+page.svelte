<script lang="ts">
  import { onMount } from 'svelte'
  import type { CodeiumEditorInstance } from '$lib/types'

  let CodeiumEditor: CodeiumEditorInstance

  onMount(async () => {
    CodeiumEditor = (await import('$lib/components')).CodeiumEditor
  })

  // TODO: create multiple editors for the different languages (including markdown, create 6 grid)
</script>

<h1>Welcome to your library project</h1>
<p>
  Create your package using @sveltejs/package and preview/showcase your work
  with SvelteKit
</p>

{#if CodeiumEditor}
  <svelte:component this={CodeiumEditor} />
{:else}
  <p>Loading editor...</p>
{/if}
