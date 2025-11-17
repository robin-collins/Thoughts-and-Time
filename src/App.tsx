import { useState } from 'react';
import ThoughtsPane from './components/ThoughtsPane';
import TimePane from './components/TimePane';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-background text-text-primary">
      {/* Header */}
      <header className="h-[60px] border-b border-border-subtle flex items-center justify-between px-48">
        <h1 className="text-lg font-serif">Thoughts & Time</h1>
        <div className="flex items-center gap-16">
          {isSearchOpen && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) {
                  setIsSearchOpen(false);
                }
              }}
              placeholder="Search..."
              className="px-12 py-4 bg-hover-bg border border-border-subtle rounded-sm font-mono text-sm w-[240px] focus:outline-none focus:border-text-secondary"
              autoFocus
            />
          )}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) {
                setSearchQuery('');
              }
            }}
            className="text-base hover:opacity-70 transition-opacity"
            title="Search"
          >
            🔍
          </button>
        </div>
      </header>

      {/* Two-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thoughts Pane - Left */}
        <div className="w-1/2 border-r border-border-subtle">
          <ThoughtsPane searchQuery={searchQuery} />
        </div>

        {/* Time Pane - Right */}
        <div className="w-1/2">
          <TimePane searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}

export default App;
