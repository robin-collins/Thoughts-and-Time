import { useState, useEffect } from 'react';
import { prefixToSymbol, symbolToPrefix as symbolToPrefixMap } from '../utils/formatting';

interface ItemEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

/**
 * Inline editor component for editing item content.
 * Handles symbol/prefix conversion on input.
 */
function ItemEditor({ initialContent, onSave, onCancel }: ItemEditorProps) {
  const [editContent, setEditContent] = useState(initialContent);

  useEffect(() => {
    setEditContent(initialContent);
  }, [initialContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    // Check if a space was just added
    if (newValue.length > editContent.length && newValue[cursorPos - 1] === ' ') {
      const beforeSpace = newValue.substring(0, cursorPos - 1).trim();

      // Check if it matches a prefix
      if (prefixToSymbol[beforeSpace]) {
        const symbol = prefixToSymbol[beforeSpace];
        const updatedValue = symbol + ' ' + newValue.substring(cursorPos);
        setEditContent(updatedValue);

        setTimeout(() => {
          const input = e.target;
          const newCursorPos = symbol.length + 1;
          input.selectionStart = input.selectionEnd = newCursorPos;
        }, 0);
        return;
      }
    }

    setEditContent(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave(editContent);
      return;
    } else if (e.key === 'Escape') {
      onCancel();
      return;
    }

    const input = e.currentTarget;
    const { selectionStart, selectionEnd, value } = input;

    // Backspace: check if we need to revert symbol to prefix
    if (e.key === 'Backspace' && selectionStart === selectionEnd) {
      const charBeforeCursor = value[selectionStart! - 1];
      const charBeforeThat = value[selectionStart! - 2];

      if (charBeforeCursor === ' ' && selectionStart! === 2) {
        if (charBeforeThat && symbolToPrefixMap[charBeforeThat]) {
          e.preventDefault();
          const prefix = symbolToPrefixMap[charBeforeThat];
          const newValue = prefix + value.substring(selectionStart!);
          setEditContent(newValue);

          setTimeout(() => {
            input.selectionStart = input.selectionEnd = prefix.length;
          }, 0);
          return;
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-8">
      <input
        type="text"
        value={editContent}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 px-8 py-4 bg-hover-bg border border-border-subtle rounded-sm font-serif text-base"
        autoFocus
      />
      <button
        onClick={() => onSave(editContent)}
        className="text-sm text-text-secondary hover:text-text-primary"
        title="Save (Enter)"
      >
        ✓
      </button>
      <button
        onClick={onCancel}
        className="text-sm text-text-secondary hover:text-text-primary"
        title="Cancel (Esc)"
      >
        ✕
      </button>
    </div>
  );
}

export default ItemEditor;
