import { useEffect, useRef } from 'react';
import { format, subDays, addDays, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import ItemDisplay from './ItemDisplay';
import { Item, Todo, Event as EventType } from '../types';

function TimePane() {
  const items = useStore((state) => state.items);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Compute scheduled items grouped by date (recomputes when items change)
  const itemsByDate = new Map<string, Item[]>();
  items.forEach((item) => {
    let dateKey: string | null = null;

    if (item.type === 'todo') {
      const todo = item as Todo;
      if (todo.scheduledTime) {
        dateKey = format(new Date(todo.scheduledTime), 'yyyy-MM-dd');
      }
    } else if (item.type === 'event') {
      const event = item as EventType;
      dateKey = format(new Date(event.startTime), 'yyyy-MM-dd');
    }

    if (dateKey) {
      if (!itemsByDate.has(dateKey)) {
        itemsByDate.set(dateKey, []);
      }
      itemsByDate.get(dateKey)!.push(item);
    }
  });

  // Generate date range: 30 days past to 30 days future
  const today = format(new Date(), 'yyyy-MM-dd');
  const dates: string[] = [];

  for (let i = -30; i <= 30; i++) {
    const date = i === 0
      ? new Date()
      : i < 0
        ? subDays(new Date(), Math.abs(i))
        : addDays(new Date(), i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }

  // Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to middle (where today is)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight / 2;
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Pane Header */}
      <div className="h-[48px] border-b border-border-subtle flex items-center px-48">
        <h2 className="text-sm font-serif uppercase tracking-wide">Time</h2>
      </div>

      {/* Timeline - Scrollable through all days */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-48 py-32"
      >
        {dates.map((date) => {
          const items = itemsByDate.get(date) || [];
          const isToday = date === today;

          if (items.length === 0) {
            // Don't show empty days
            return null;
          }

          // Separate items with time vs without time
          const itemsWithTime: Item[] = [];
          const itemsWithoutTime: Item[] = [];

          items.forEach((item) => {
            if (item.type === 'todo') {
              const todo = item as Todo;
              if (todo.hasTime) {
                itemsWithTime.push(item);
              } else {
                itemsWithoutTime.push(item);
              }
            } else if (item.type === 'event') {
              itemsWithTime.push(item);
            }
          });

          // Group items by hour
          const itemsByHour: { [hour: string]: Item[] } = {};
          itemsWithTime.forEach((item) => {
            let timeKey = '';
            if (item.type === 'todo') {
              const todo = item as Todo;
              if (todo.scheduledTime) {
                timeKey = format(new Date(todo.scheduledTime), 'h:mm a');
              }
            } else if (item.type === 'event') {
              timeKey = format(new Date(item.startTime), 'h:mm a');
            }

            if (timeKey) {
              if (!itemsByHour[timeKey]) {
                itemsByHour[timeKey] = [];
              }
              itemsByHour[timeKey].push(item);
            }
          });

          const hours = Object.keys(itemsByHour).sort((a, b) => {
            // Convert to 24-hour for sorting
            const timeA = new Date(`1970-01-01 ${a}`);
            const timeB = new Date(`1970-01-01 ${b}`);
            return timeA.getTime() - timeB.getTime();
          });

          return (
            <div key={date} className="mb-64">
              {/* Date Header */}
              <div className={`sticky top-0 bg-background py-12 mb-24 border-b border-border-subtle ${isToday ? 'text-text-primary' : 'text-text-secondary'}`}>
                <h3 className="text-sm font-mono uppercase tracking-wide">
                  {format(parseISO(date), 'EEEE, MMM d, yyyy')}
                  {isToday && ' (Today)'}
                </h3>
              </div>

              {/* Items for this date */}
              <div className="space-y-32">
                {/* Items without specific time - at top */}
                {itemsWithoutTime.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-text-secondary mb-12 uppercase tracking-wide">
                      (No time)
                    </div>
                    <div className="space-y-24">
                      {itemsWithoutTime.map((item) => (
                        <ItemDisplay key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Items with specific times - by hour */}
                {hours.map((hour) => (
                  <div key={hour}>
                    <div className="text-xs font-mono text-text-secondary mb-12">
                      {hour}
                    </div>
                    <div className="space-y-24">
                      {itemsByHour[hour].map((item) => (
                        <ItemDisplay key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimePane;
