import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { PromiseClient } from '@connectrpc/connect'

import { LanguageServerService } from '$lib/api/proto/exa/language_server_pb/language_server_connect'

import { Status } from './Status'
import MonacoInlineCompletion from './InlineCompletion'
import MonacoCompletionProvider from './CompletionProvider'

export interface ICodeEditor {
  _commandService: { executeCommand(command: string): unknown }
}

export default class InlineCompletionProvider
  implements
    monaco.languages.InlineCompletionsProvider<
      monaco.languages.InlineCompletions<MonacoInlineCompletion>
    >
{
  private numCompletionsProvided: number
  private completionCount: number
  readonly completionProvider: MonacoCompletionProvider

  constructor(
    grpcClient: PromiseClient<typeof LanguageServerService>,
    completionCount: number,
    codeiumStatus: Status,
    codeiumStatusMessage: string
  ) {
    this.numCompletionsProvided = 0
    this.completionCount = completionCount
    this.completionProvider = new MonacoCompletionProvider(
      grpcClient,
      codeiumStatus,
      codeiumStatusMessage
    )
  }

  freeInlineCompletions() {
    // nothing
  }

  async provideInlineCompletions(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.InlineCompletionContext,
    token: monaco.CancellationToken
  ) {
    const completions = await this.completionProvider.provideInlineCompletions(
      model,
      position,
      token
    )

    // Only count completions provided if non-empty (i.e. exclude cancelled requests).
    if (completions) {
      this.numCompletionsProvided += 1
      this.completionCount = this.numCompletionsProvided
    }

    return completions
  }

  public acceptedLastCompletion(completionId: string) {
    this.completionProvider.acceptedLastCompletion(completionId)
  }
}
