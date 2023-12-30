import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { ComponentType, SvelteComponent } from 'svelte'

export type CodeiumEditorOptions = {
  language?: string
  className?: string
  defaultContent?: string
  monacoEditorOptions?: Monaco.editor.IStandaloneEditorConstructionOptions
  onEditorMount?: (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => void
  onEditorUpdate?: (
    e: Monaco.editor.IModelContentChangedEvent,
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => void
  storageKey?: string
  disableLocalStorage?: boolean
}

export type CodeiumEditorInstance = ComponentType<
  SvelteComponent<CodeiumEditorOptions>
>
