<script lang="ts">
  import { BROWSER } from 'esm-env'

  if (!BROWSER) {
    throw new Error(
      'CodeiumEditor must be used in a browser environment only! Disable ssr or use dynamic imports to import the component instead.'
    )
  }

  import { onMount, onDestroy } from 'svelte'
  import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'

  import { createConnectTransport } from '@connectrpc/connect-web'
  import { createPromiseClient } from '@connectrpc/connect'

  import { LanguageServerService } from '$lib/api/proto/exa/language_server_pb/language_server_connect'

  import type { CodeiumEditorOptions } from '$lib/types'

  import { Status } from './Status'
  import { defaultEditorOptions } from './defaults'
  import InlineCompletionProvider from './InlineCompletionProvider'

  // import { CodeiumLogo } from '$lib/components/CodeiumLogo';

  export let language: CodeiumEditorOptions['language'] =
    defaultEditorOptions.language

  export let className: CodeiumEditorOptions['className'] =
    defaultEditorOptions.className

  export let defaultContent: CodeiumEditorOptions['defaultContent'] =
    defaultEditorOptions.defaultContent

  export let monacoEditorOptions: CodeiumEditorOptions['monacoEditorOptions'] =
    defaultEditorOptions.monacoEditorOptions

  export let onEditorMount: CodeiumEditorOptions['onEditorMount'] =
    defaultEditorOptions.onEditorMount

  export let onEditorUpdate: CodeiumEditorOptions['onEditorUpdate'] =
    defaultEditorOptions.onEditorUpdate

  // export let storageKey: CodeiumEditorOptions['storageKey'] =
  //   defaultEditorOptions.storageKey

  // export let disableLocalStorage: CodeiumEditorOptions['disableLocalStorage'] =
  //   defaultEditorOptions.disableLocalStorage

  let completionCount: number = 0
  let codeiumStatus: Status = Status.INACTIVE
  let codeiumStatusMessage: string = ''

  let monaco: typeof Monaco
  let editor: Monaco.editor.IStandaloneCodeEditor
  let editorContainer: HTMLDivElement
  // let editorId = $state(crypto.randomUUID())

  onMount(async () => {
    monaco = (await import('./Monaco')).default

    // monaco is ready!
    editor = monaco.editor.create(editorContainer, monacoEditorOptions!)

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
      (_: unknown, completionId: string, insertText: string) => { // eslint-disable-line
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
    if (typeof onEditorMount !== 'undefined') {
      onEditorMount!(editor, monaco)
    }

    // let defaultLanguageProps: Monaco.EditorProps = {
    //   defaultLanguage: language,
    //   defaultValue: getDefaultValue(language)
    // }

    if (typeof onEditorUpdate !== 'undefined') {
      editor.getModel()?.onDidChangeContent((e) => {
        onEditorUpdate!(e, editor, monaco)
      })
    }

    const model = monaco.editor.createModel(defaultContent!, language!)

    editor.setModel(model)
  })

  onDestroy(() => {
    monaco?.editor
      .getModels()
      .forEach((model) => model.isAttachedToEditor() && model.dispose())
    editor?.dispose()
  })
</script>

<div>
  <div class={className} bind:this={editorContainer} />
</div>

<style>
  .editor {
    width: 600px;
    height: 400px;
  }
</style>
