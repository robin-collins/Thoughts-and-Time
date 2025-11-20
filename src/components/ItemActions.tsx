interface ItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Action buttons (edit/delete) that appear on hover for items.
 */
function ItemActions({ onEdit, onDelete }: ItemActionsProps) {
  return (
    <div className="flex gap-4 flex-shrink-0">
      <button
        onClick={onEdit}
        className="text-xs text-text-secondary hover:text-text-primary"
        title="Edit"
      >
        ✎
      </button>
      <button
        onClick={onDelete}
        className="text-xs text-text-secondary hover:text-text-primary"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

export default ItemActions;
