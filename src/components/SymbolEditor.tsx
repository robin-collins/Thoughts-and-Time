import { useEffect, useRef } from 'react';
import { EditorState, Prec } from '@codemirror/state';
import { EditorView, keymap, placeholder as placeholderExt } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { prefixToSymbol } from '../utils/formatting';

interface SymbolEditorProps {
  initialValue?: string;
  placeholder?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  onChangeValue?: (value: string) => void;
  autoFocus?: boolean;
  minHeight?: string;
  className?: string;
}

/**
 * CodeMirror 6-based editor with symbol support.
 * Handles Tab/Shift+Tab for indentation and symbol conversion.
 */
function SymbolEditor({
  initialValue = '',
  placeholder = '',
  onSubmit,
  onCancel,
  onChangeValue,
  autoFocus = true,
  minHeight = '24px',
  className = '',
}: SymbolEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Custom keymap for our app
    const customKeymap = keymap.of([
      // Enter without shift submits
      {
        key: 'Enter',
        run: (view) => {
          onSubmit(view.state.doc.toString());
          return true;
        },
      },
      // Shift+Enter adds new line
      {
        key: 'Shift-Enter',
        run: (view) => {
          view.dispatch(view.state.replaceSelection('\n'));
          return true;
        },
      },
      // Escape cancels
      {
        key: 'Escape',
        run: () => {
          onCancel?.();
          return true;
        },
      },
      // Tab for indentation with hierarchy enforcement
      {
        key: 'Tab',
        run: (view) => {
          const state = view.state;
          const { from } = state.selection.main;
          const line = state.doc.lineAt(from);

          // First line cannot be indented
          if (line.number === 1) {
            return true;
          }

          // Count current tabs at start of line
          let currentTabs = 0;
          const lineText = line.text;
          while (currentTabs < lineText.length && lineText[currentTabs] === '\t') {
            currentTabs++;
          }

          // Get previous line's tab count
          const prevLine = state.doc.line(line.number - 1);
          let prevTabs = 0;
          const prevText = prevLine.text;
          while (prevTabs < prevText.length && prevText[prevTabs] === '\t') {
            prevTabs++;
          }

          // Max allowed is 1 level deeper than previous (max 2)
          const maxTabs = Math.min(prevTabs + 1, 2);

          if (currentTabs < maxTabs) {
            // Add a tab at start of line
            view.dispatch({
              changes: { from: line.from, insert: '\t' },
              selection: { anchor: from + 1 },
            });
          } else {
            // Cycle back to 0 - remove all tabs
            view.dispatch({
              changes: { from: line.from, to: line.from + currentTabs, insert: '' },
              selection: { anchor: from - currentTabs },
            });
          }
          return true;
        },
      },
      // Shift+Tab removes indentation
      {
        key: 'Shift-Tab',
        run: (view) => {
          const state = view.state;
          const { from } = state.selection.main;
          const line = state.doc.lineAt(from);

          // Check if line starts with tab
          if (line.text[0] === '\t') {
            view.dispatch({
              changes: { from: line.from, to: line.from + 1, insert: '' },
              selection: { anchor: Math.max(line.from, from - 1) },
            });
          }
          return true;
        },
      },
    ]);

    // Handle prefix-to-symbol conversion on input
    const symbolConversion = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const doc = update.state.doc.toString();
        onChangeValue?.(doc);

        // Check for prefix + space pattern and convert to symbol
        for (const tr of update.transactions) {
          if (!tr.isUserEvent('input')) continue;

          tr.changes.iterChanges((_fromA, _toA, fromB, _toB, inserted) => {
            const insertedText = inserted.toString();
            if (insertedText === ' ') {
              const line = update.state.doc.lineAt(fromB);
              const lineStart = line.from;
              const posInLine = fromB - lineStart;

              // Check if we just typed a space after a prefix at line start
              // Account for tabs at start
              let tabCount = 0;
              while (tabCount < line.text.length && line.text[tabCount] === '\t') {
                tabCount++;
              }

              const charBeforeSpace = posInLine > tabCount ? line.text[posInLine - 1] : '';

              if (posInLine === tabCount + 1 && prefixToSymbol[charBeforeSpace]) {
                const symbol = prefixToSymbol[charBeforeSpace];
                // Replace prefix with symbol
                setTimeout(() => {
                  viewRef.current?.dispatch({
                    changes: {
                      from: lineStart + tabCount,
                      to: fromB + 1,
                      insert: symbol + ' ',
                    },
                  });
                }, 0);
              }
            }
          });
        }
      }
    });

    // Theme for styling - match app's exact font (Crimson Text, 18px, 1.3 line height)
    const theme = EditorView.theme({
      '&': {
        fontSize: '18px',
        fontFamily: '"Crimson Text", Lora, Georgia, "Times New Roman", serif',
        backgroundColor: 'transparent',
        lineHeight: '1.3',
      },
      '.cm-content': {
        padding: '8px',
        minHeight,
        caretColor: '#ffffff',
        fontFamily: '"Crimson Text", Lora, Georgia, "Times New Roman", serif !important',
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-line': {
        padding: '0',
        fontFamily: '"Crimson Text", Lora, Georgia, "Times New Roman", serif !important',
      },
      '.cm-cursor, .cm-cursor-primary': {
        borderLeftColor: '#ffffff',
        borderLeftWidth: '2px',
      },
      '.cm-placeholder': {
        color: 'var(--text-secondary, #888)',
        fontStyle: 'italic',
      },
    });

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        Prec.highest(customKeymap),
        keymap.of(defaultKeymap),
        symbolConversion,
        theme,
        placeholder ? placeholderExt(placeholder) : [],
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    if (autoFocus) {
      view.focus();
    }

    return () => {
      view.destroy();
    };
  }, []);

  // Update content when initialValue changes
  useEffect(() => {
    if (viewRef.current && initialValue !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: initialValue,
        },
      });
    }
  }, [initialValue]);

  return (
    <div
      ref={editorRef}
      className={`bg-hover-bg border border-border-subtle rounded-sm ${className}`}
    />
  );
}

export default SymbolEditor;
