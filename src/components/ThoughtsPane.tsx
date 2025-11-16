import { useState, useEffect, useRef } from 'react';
import { format, subDays, addDays, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import ItemDisplay from './ItemDisplay';

function ThoughtsPane() {
  const [input, setInput] = useState('');
  const addItem = useStore((state) => state.addItem);
  const getItemsByDate = useStore((state) => state.getItemsByDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const itemsByDate = getItemsByDate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addItem(input);
      setInput('');

      // Scroll to bottom after adding item
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Auto-scroll to bottom on mount (to show today)
  useEffect(() => {
    if (scrollRef.current && isAtBottom) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(atBottom);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Pane Header */}
      <div className="h-[48px] border-b border-border-subtle flex items-center px-48">
        <h2 className="text-sm font-serif uppercase tracking-wide">Thoughts</h2>
      </div>

      {/* Items Area - Scrollable through all days */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-48 py-32"
      >
        {dates.map((date) => {
          const items = itemsByDate.get(date) || [];
          const isToday = date === today;

          if (items.length === 0 && !isToday) {
            // Don't show empty days (except today)
            return null;
          }

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
              {items.length === 0 ? (
                <div className="text-center text-text-secondary text-sm py-24">
                  <p>Nothing captured yet</p>
                </div>
              ) : (
                <div className="space-y-32">
                  {items.map((item) => (
                    <ItemDisplay key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Field - Fixed at Bottom */}
      <form onSubmit={handleSubmit} className="border-t border-border-subtle">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          className="w-full h-[56px] px-24 bg-transparent border-none outline-none font-serif text-base placeholder-text-secondary"
          autoFocus
        />
      </form>
    </div>
  );
}

export default ThoughtsPane;
