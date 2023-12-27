<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { createConnectTransport } from '@connectrpc/connect-web'
  import { createPromiseClient } from '@connectrpc/connect'
  import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'

  import { LanguageServerService } from '$lib/api/proto/exa/language_server_pb/language_server_connect'

  import { Status } from './Status'
  import { getDefaultValue } from './defaultValues'
  import InlineCompletionProvider from './InlineCompletionProvider'

  // import { CodeiumLogo } from '$lib/components/CodeiumLogo';

  export let language: string = 'python'
  export let width: string | number
  export let height: string | number
  export let onEditorMount: (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => void = () => {}

  let editor: Monaco.editor.IStandaloneCodeEditor
  let monaco: typeof Monaco
  let editorContainer: HTMLElement

  let completionCount = 0
  let codeiumStatus: Status = Status.INACTIVE
  let codeiumStatusMessage = ''

  onMount(async () => {
    monaco = (await import('./Monaco')).default

    // monaco is ready!
    const editor = monaco.editor.create(editorContainer)

    const transport = createConnectTransport({
      baseUrl: 'https://web-backend.codeium.com',
      useBinaryFormat: true
    })

    const grpcClient = createPromiseClient(LanguageServerService, transport)

    const inlineCompletionsProvider = new InlineCompletionProvider(
      grpcClient,
      completionCount,
      codeiumStatus,
      codeiumStatusMessage
    )

    monaco.languages.registerInlineCompletionsProvider(
      { pattern: '**' },
      inlineCompletionsProvider
    )

    monaco.editor.registerCommand(
      'codeium.acceptCompletion',
      (_: unknown, completionId: string, insertText: string) => {
        inlineCompletionsProvider.acceptedLastCompletion(completionId)
      }
    )

    // CORS pre-flight cache optimization.
    try {
      await grpcClient.getCompletions({})
    } catch (e) {
      // This is expected.
      console.log(e)
    }

    // Pass the editor instance to the user defined onEditorMount prop
    if (onEditorMount) {
      onEditorMount(editor, monaco)
    }

    let defaultLanguageProps: Monaco.EditorProps = {
      defaultLanguage: language,
      defaultValue: getDefaultValue(language)
    }

    const model = monaco.editor.createModel(
      "console.log('Hello from Monaco! (the editor, not the city...)')",
      'javascript'
    )
    editor.setModel(model)
  })

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.editor?.dispose())
  })
</script>

<div>
  <div class="container" bind:this={editorContainer} />
</div>

<style>
  .container {
    width: 100%;
    height: 600px;
  }
</style>
