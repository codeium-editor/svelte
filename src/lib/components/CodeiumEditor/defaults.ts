import type { CodeiumEditorOptions } from '$lib/types'

export const getDefaultContent = (language: string): string => {
  switch (language) {
    case 'typescript':
    case 'tsx':
    case 'javascript':
    case 'java':
      return `// Welcome to Codeium Editor!
// Press Enter and use Tab to accept AI suggestions. Here's an example:

// fib(n) function to calculate the n-th fibonacci number
public int fib(int n) {`
    case 'python':
      return `# Welcome to Codeium Editor!
# Press Enter and use Tab to accept AI suggestions. Here's an example:

# fib(n) function to calculate the n-th fibonacci number
def fib(n):`
    case 'css':
      return `/* Welcome to Codeium Editor!
Press Enter and use Tab to accept AI suggestions. Here's an example:*/

/* .action-button class with a hover effect. */`
    default:
      return ''
  }
}

export const defaultEditorOptions: CodeiumEditorOptions = {
  language: 'python',
  className: 'editor',
  defaultContent: getDefaultContent('python'),
  monacoEditorOptions: {
    language: 'python',
    model: null,
    theme: 'vs-dark',
    scrollBeyondLastColumn: 0,
    scrollbar: {
      alwaysConsumeMouseWheel: false,
      vertical: 'hidden'
    },
    codeLens: false,
    minimap: {
      enabled: false
    },
    quickSuggestions: false,
    folding: false,
    foldingHighlight: false,
    foldingImportsByDefault: false,
    links: false,
    fontSize: 14,
    wordWrap: 'on'
  },
  onEditorMount: () => {},
  onEditorUpdate: () => {},
  storageKey: 'codeium__content',
  disableLocalStorage: false
}
