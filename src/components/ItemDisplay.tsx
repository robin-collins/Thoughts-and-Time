import { format } from 'date-fns';
import { Item, Todo, Routine, Note } from '../types';
import { useStore } from '../store/useStore';

interface ItemDisplayProps {
  item: Item;
  depth?: number;
  showTime?: boolean;
}

function ItemDisplay({ item, depth = 0, showTime = true }: ItemDisplayProps) {
  const toggleTodoComplete = useStore((state) => state.toggleTodoComplete);
  const items = useStore((state) => state.items);

  const getSymbol = () => {
    switch (item.type) {
      case 'todo':
        const todo = item as Todo;
        return todo.completedAt ? '☑' : '□';
      case 'event':
        return '⇹';
      case 'routine':
        return '↻';
      case 'note':
        return '↝';
      default:
        return '';
    }
  };

  const getTimeDisplay = () => {
    // Only show timestamp for top-level items when showTime is true
    if (depth === 0 && showTime) {
      const time = format(new Date(item.createdAt), 'h:mm a');
      return time;
    }
    return null;
  };

  const handleToggleComplete = () => {
    if (item.type === 'todo') {
      toggleTodoComplete(item.id);
    }
  };

  const isCompleted = item.type === 'todo' && (item as Todo).completedAt;

  // Get sub-items
  const subItemIds = item.type === 'note'
    ? (item as Note).subItems
    : item.type === 'todo'
      ? (item as Todo).subtasks
      : [];

  const subItems = subItemIds
    .map(id => items.find(i => i.id === id))
    .filter(Boolean) as Item[];

  const indentPx = depth * 32;

  return (
    <div className="group">
      <div style={{ marginLeft: `${indentPx}px` }}>
        {/* Timestamp (only for top-level) */}
        {depth === 0 && (
          <div className="text-xs font-mono text-text-secondary mb-6">
            {getTimeDisplay()}
          </div>
        )}

        {/* Item Content */}
        <div className={`flex items-start gap-12 ${isCompleted ? 'opacity-40' : ''}`}>
          {/* Symbol */}
          <button
            onClick={handleToggleComplete}
            className={`text-base leading-book flex-shrink-0 ${
              item.type === 'todo' ? 'cursor-pointer hover:opacity-70' : 'cursor-default'
            }`}
            disabled={item.type !== 'todo'}
          >
            {getSymbol()}
          </button>

          {/* Content */}
          <div className="flex-1">
            <p
              className={`text-base font-serif leading-book ${
                item.type === 'note' ? 'italic' : ''
              } ${item.type === 'event' ? 'font-semibold' : ''} ${
                isCompleted ? 'line-through' : ''
              }`}
            >
              {item.content}
            </p>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="mt-6 text-sm text-text-secondary">
                {item.tags.map((tag) => (
                  <span key={tag} className="mr-12">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Additional metadata for todos */}
            {item.type === 'todo' && (
              <>
                {(item as Todo).deadline && (
                  <div className="mt-6 text-xs font-mono text-text-secondary">
                    Due: {format(new Date((item as Todo).deadline!), 'MMM d, h:mm a')}
                  </div>
                )}
              </>
            )}

            {/* Additional metadata for routines */}
            {item.type === 'routine' && (
              <div className="mt-6 text-xs font-mono text-text-secondary">
                {(item as Routine).recurrencePattern.frequency === 'daily' && 'Every day'}
                {(item as Routine).streak > 0 && ` (Streak: ${(item as Routine).streak})`}
              </div>
            )}

            {/* Embedded notes preview */}
            {(item.type === 'todo' || item.type === 'event' || item.type === 'routine') &&
             'embeddedItems' in item && item.embeddedItems.length > 0 && (
              <div className="mt-12 space-y-8">
                {item.embeddedItems.map((noteId) => {
                  const embeddedNote = items.find(i => i.id === noteId && i.type === 'note');

                  if (!embeddedNote) {
                    // Broken link - note was deleted
                    return (
                      <div key={noteId} className="border border-border-subtle rounded-sm px-12 py-8 bg-hover-bg">
                        <p className="text-sm text-text-secondary italic">
                          [Note not found: {noteId}]
                        </p>
                      </div>
                    );
                  }

                  // Display embedded note preview
                  return (
                    <div key={noteId} className="border border-border-subtle rounded-sm px-12 py-8 bg-hover-bg">
                      <div className="flex items-start gap-8">
                        <span className="text-sm text-text-secondary">↝</span>
                        <p className="text-sm font-serif italic text-text-secondary">
                          {embeddedNote.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recursively render sub-items */}
      {subItems.length > 0 && (
        <div className="mt-16">
          {subItems.map(subItem => (
            <ItemDisplay key={subItem.id} item={subItem} depth={depth + 1} showTime={showTime} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemDisplay;
