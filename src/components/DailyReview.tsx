import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { useStore } from '../store/useStore';
import { Todo } from '../types';
import { parseInput } from '../utils/parser';

interface DailyReviewItem {
  item: Todo;
  waitingDays: number;
}

function DailyReview() {
  const items = useStore((state) => state.items);
  const updateItem = useStore((state) => state.updateItem);
  const deleteItem = useStore((state) => state.deleteItem);
  const toggleTodoComplete = useStore((state) => state.toggleTodoComplete);
  const [showRescheduler, setShowRescheduler] = useState<string | null>(null);
  const [rescheduleInput, setRescheduleInput] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const now = new Date();

  // Generate ALL undone todos from previous days (scheduled or unscheduled)
  const reviewItems: DailyReviewItem[] = items
    .filter((item) => {
      if (item.type !== 'todo') return false;
      const todo = item as Todo;

      // ALL incomplete todos from previous days (not today)
      return (
        todo.createdDate < today &&
        !todo.completedAt &&
        !todo.cancelledAt
      );
    })
    .map((item) => {
      const todo = item as Todo;
      const createdDate = new Date(todo.createdDate);
      const waitingDays = differenceInDays(now, createdDate);

      return { item: todo, waitingDays };
    })
    .sort((a, b) => b.waitingDays - a.waitingDays); // Oldest first (highest waiting days first)

  const handleReschedule = (itemId: string) => {
    setShowRescheduler(itemId);
  };

  const confirmReschedule = (itemId: string) => {
    if (!rescheduleInput.trim()) return;

    // Parse the input using the parser - prepend "t " so parser treats it as a todo
    const parsed = parseInput('t ' + rescheduleInput);

    if (!parsed) {
      alert('Could not parse date/time. Try formats like "tomorrow 2pm", "friday at 3:30pm", "next monday 9am"');
      return;
    }

    // Update the item with the new scheduled time
    if (parsed.scheduledTime) {
      updateItem(itemId, {
        scheduledTime: parsed.scheduledTime,
        hasTime: parsed.hasTime,
      });
    } else {
      alert('Please specify a date/time for rescheduling');
      return;
    }

    setShowRescheduler(null);
    setRescheduleInput('');
  };

  const handleComplete = (itemId: string) => {
    toggleTodoComplete(itemId);
  };

  const handleCancel = (itemId: string) => {
    if (confirm('Cancel this item permanently?')) {
      deleteItem(itemId);
    }
  };

  if (reviewItems.length === 0) {
    return null;
  }

  const allHandled = false; // TODO: Track which items have been handled

  return (
    <div>
      {/* Daily Review Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-base leading-book">
            {allHandled ? '□' : '■'}
          </span>
          <h3 className="text-base font-serif font-semibold">Daily Review</h3>
        </div>
      </div>

      {/* Review Items */}
      <div className="space-y-6 pl-16">
        {reviewItems.map(({ item, waitingDays }) => (
          <div key={item.id} className="group">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-base leading-book flex-shrink-0 text-text-secondary">•</span>
              <div className="flex-1">
                <p className="text-base font-serif leading-book">
                  {item.content}
                  <span className="text-xs font-mono text-text-secondary ml-6">
                    (waiting {waitingDays} {waitingDays === 1 ? 'day' : 'days'})
                  </span>
                </p>
                {item.tags.length > 0 && (
                  <div className="mt-1 text-xs text-text-secondary">
                    {item.tags.map((tag) => (
                      <span key={tag} className="mr-6">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {showRescheduler === item.id ? (
              <div className="flex items-center gap-4 pl-16">
                <input
                  type="text"
                  value={rescheduleInput}
                  onChange={(e) => setRescheduleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      confirmReschedule(item.id);
                    } else if (e.key === 'Escape') {
                      setShowRescheduler(null);
                      setRescheduleInput('');
                    }
                  }}
                  placeholder="e.g., tomorrow 2pm, friday 9am"
                  className="bg-background border border-border-subtle px-8 py-4 font-mono text-sm outline-none focus:border-text-secondary min-w-[200px]"
                  autoFocus
                />
                <button
                  onClick={() => confirmReschedule(item.id)}
                  className="px-8 py-4 text-xs font-mono hover:opacity-70"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setShowRescheduler(null);
                    setRescheduleInput('');
                  }}
                  className="px-8 py-4 text-xs font-mono text-text-secondary hover:opacity-70"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6 pl-16">
                <button
                  onClick={() => handleReschedule(item.id)}
                  className="w-18 h-18 flex items-center justify-center hover:opacity-70 active:opacity-50"
                  title="Reschedule"
                >
                  <span className="text-sm">↷</span>
                </button>
                <button
                  onClick={() => handleComplete(item.id)}
                  className="w-18 h-18 flex items-center justify-center hover:opacity-70 active:opacity-50"
                  title="Complete"
                >
                  <span className="text-sm">✓</span>
                </button>
                <button
                  onClick={() => handleCancel(item.id)}
                  className="w-18 h-18 flex items-center justify-center hover:opacity-70 active:opacity-50 text-text-secondary"
                  title="Cancel"
                >
                  <span className="text-sm">×</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyReview;
