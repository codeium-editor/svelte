# Codeium Editor Svelte

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com/badges/main)

Codeium Editor Svelte is a free, open-source AI enabled code editor component for Svelte and SvelteKit that provides unlimited autocomplete and generative AI suggestions. No account required. Inspired by [Exafunction/codeium-react-editor](https://github.com/Exafunction/codeium-react-editor) and the brilliant work done by the team at [Codeium](https://www.codeium.com/).

![codeium demo](docs/codeium_demo.gif)

## Installation

To use Codeium Editor Svelte in a project, you can run the following commands using your preferred package manager to install the `codeium-editor-svelte` [NPM package](https://www.npmjs.com/package/novel):

### With `npm`

```bash
npm i codeium-svelte-editor
```

### With `yarn`

```bash
yarn add codeium-svelte-editor
```

### With `pnpm`

```bash
pnpm add codeium-svelte-editor
```

### With `bun`

```bash
bun add codeium-svelte-editor
```

Then, you can use it in your `Svelte` code like this:

```html
<script lang="ts">
  import { CodeiumEditor } from "codeium-svelte-editor/components";
</script>

<CodeiumEditor />
```

### Limitations for `SvelteKit`

A warning to `SvelteKit` users: `CodeiumEditor` is a client-side only `Svelte` component due to the underlying `Monaco` editor's nature. Thus, it will not work on pages or components rendered on the server.

`CodeiumEditor` will try to error out and inform you if you attempt to import it into an SSR environment

```
error: CodeiumEditor must be used in a browser environment only! Disable ssr or use dynamic imports to import the component instead.
```

But this error is not guaranteed to be thrown, and you might instead run into an internal `ReferenceError`

```
ReferenceError: Can't find variable: window
```

To resolve this issue, consider disabling SSR page-wise or layout-wise via

`+page.ts`

```ts
export const ssr = false;
```

or

`+layout.ts`

```ts
export const ssr = false;
```

However, if SSR is absolutely necessary, consider importing the component dynamically in your server-rendered page or component as shown below.

#### Using the `onMount` lifecycle hook with the `{#await}` block (recommended)

```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  let mounted = false

  onMount(() => {
    mounted = true
  })
</script>

{#if mounted}
  {#await import('codeium-svelte-editor/components')}
    <!-- If you like, add a skeleton/loader component here instead-->
    <p>Loading editor...</p>
  {:then { CodeiumEditor }}
    <svelte:component this={CodeiumEditor} />
  {/await}
{/if}
```

#### Using the `{#await}` block with the `browser` environment flag and an `async` editor constructor

```svelte
<script lang="ts">
  import { browser } from '$app/environment'

  import type { CodeiumEditorInstance } from 'codeium-svelte-editor/types'

  const EditorConstructor: Promise<CodeiumEditorInstance | null> = browser
    ? import('codeium-svelte-editor/components').then((module) => module.CodeiumEditor)
    : new Promise(() => null)
</script>

{#await EditorConstructor}
  <!-- If you like, add a skeleton/loader component here instead-->
  <p>Loading editor...</p>
{:then CodeiumEditor}
  <svelte:component this={CodeiumEditor} />
{/await}
```

#### Using the `onMount` lifecycle hook with `Promise` resolution

```html
<script lang="ts">
  import { onMount } from 'svelte'

  import type { CodeiumEditorInstance } from 'codeium-svelte-editor/types'

  let CodeiumEditor: CodeiumEditorInstance

  onMount(() => {
    import('codeium-svelte-editor/components').then((module) => CodeiumEditor = module.CodeiumEditor)
  })
</script>

{#if CodeiumEditor}
  <svelte:component this={CodeiumEditor} />
{:else}
  <!-- If you like, add a skeleton/loader component here instead-->
  <p>Loading editor...</p>
{/if}
```

#### Using the `onMount` lifecycle hook with `async/await`

```html
<script lang="ts">
  import { onMount } from 'svelte'

  import type { CodeiumEditorInstance } from 'codeium-svelte-editor/types'

  let CodeiumEditor: CodeiumEditorInstance

  onMount(async () => {
    CodeiumEditor = (await import('codeium-svelte-editor/components')).CodeiumEditor
  })
</script>

{#if CodeiumEditor}
  <svelte:component this={CodeiumEditor} />
{:else}
  <!-- If you like, add a skeleton/loader component here instead -->
  <p>Loading editor...</p>
{/if}
```

or

```html
<script lang="ts">
  import { onMount } from 'svelte'

  import type { CodeiumEditorInstance } from 'codeium-svelte-editor/types'

  let CodeiumEditor: CodeiumEditorInstance

  async function loadEditor() {
    CodeiumEditor = (await import('codeium-svelte-editor/components')).CodeiumEditor
  }

  onMount(() => {
    loadEditor();
  })
</script>

{#if CodeiumEditor}
  <svelte:component this={CodeiumEditor} />
{:else}
  <!-- If you like, add a skeleton/loader component here instead -->
  <p>Loading editor...</p>
{/if}
```

For more info on these patterns, refer to the official SvelteKit documentation: [How do I use a client-side only library that depends on document or window?](https://kit.svelte.dev/docs/faq#how-do-i-use-x-with-sveltekit-how-do-i-use-a-client-side-only-library-that-depends-on-document-or-window)

## Props

`CodeiumEditor` is a Svelte component that takes in the following props:

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Description</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>language</code></td>
      <td><code>string</code></td>
      <td>The language to use for the editor.</td>
      <td><code>python</code></td>
    </tr>
    <tr>
      <td><code>className</code></td>
      <td><code>string</code></td>
      <td>Editor container classname.</td>
      <td><code>editor</code> which is styled internally as <pre><code>.editor {
  width: 100%;
  height: 600px;
}</code></pre></td>
    </tr>
    <tr>
      <td><code>defaultValue</code></td>
      <td><code>string</code></td>
      <td>The default value to use for the editor.</td>
      <td><a href="https://github.com/bkataru/codeium-svelte-editor/blob/main/src/lib/components/CodeiumEditor/defaultValues.ts"><code>getDefaultValue(language)</code></a></td>
    </tr>
    <tr>
      <td><code>monacoEditorOptions</code></td>
      <td><code>Monaco.editor.IStandaloneEditorConstructionOptions</code></td>
      <td>Options to pass to the underling Monaco editor, in addition to the default Codeium editor options <a href="https://github.com/steven-tey/novel/blob/main/packages/core/src/ui/editor/extensions/index.tsx">default Novel extensions</a>.</td>
      <td><code>[]</code></td>
    </tr>
    <tr>
      <td><code>editorProps</code></td>
      <td><code>EditorProps</code></td>
      <td>Props to pass to the underlying Tiptap editor, in addition to the <a href="https://github.com/steven-tey/novel/blob/main/packages/core/src/ui/editor/props.ts">default Novel editor props</a>.</td>
      <td><code>{}</code></td>
    </tr>
    <tr>
      <td><code>onUpdate</code></td>
      <td><code>(editor?: Editor) => void</code></td>
      <td>A callback function that is called whenever the editor is updated.</td>
      <td><code>() => { }</code></td>
    </tr>
    <tr>
      <td><code>onDebouncedUpdate</code></td>
      <td><code>(editor?: Editor) => void</code></td>
      <td>A callback function that is called whenever the editor is updated, but only after the defined debounce duration.</td>
      <td><code>() => { }</code></td>
    </tr>
    <tr>
      <td><code>debounceDuration</code></td>
      <td><code>number</code></td>
      <td>The duration (in milliseconds) to debounce the <code>onDebouncedUpdate</code> callback.</td>
      <td><code>750</code></td>
    </tr>
    <tr>
      <td><code>storageKey</code></td>
      <td><code>string</code></td>
      <td>The key to use for storing the editor's value in local storage.</td>
      <td><code>novel__content</code></td>
    </tr>
    <tr>
      <td><code>disableLocalStorage</code></td>
      <td><code>boolean</code></td>
      <td>Enabling this option will prevent read/write content from/to local storage.</td>
      <td><code>false</code></td>
    </tr>
  </tbody>
</table>

# TODO

- Finish demo
  - Add styling
- Use Svelte 5 Runes
- Figure out how to import component without disabling csr
- Package library and publish to npm
- Publicise package on discord, twitter, reddit, and other social media

# What props do I want to have?

Do we create multiple models or just one?
