import { useState } from 'react';
import SymbolEditor from './SymbolEditor';

interface ItemEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

/**
 * Inline editor component for editing item content.
 * Uses CodeMirror 6 for proper Tab/indentation support.
 */
function ItemEditor({ initialContent, onSave, onCancel }: ItemEditorProps) {
  const [currentContent, setCurrentContent] = useState(initialContent);

  return (
    <div className="flex items-start gap-8">
      <div className="flex-1 text-base font-serif leading-book">
        <SymbolEditor
          initialValue={initialContent}
          onSubmit={onSave}
          onCancel={onCancel}
          onChangeValue={setCurrentContent}
          autoFocus={true}
          minHeight={initialContent.includes('\n') ? '72px' : '24px'}
        />
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSave(currentContent)}
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
    </div>
  );
}

export default ItemEditor;
