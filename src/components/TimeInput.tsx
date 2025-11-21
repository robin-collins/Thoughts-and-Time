import { useState, useRef, useEffect } from 'react';

interface TimeInputProps {
  value: string; // HH:mm format (used only for initial value)
  onChange: (value: string) => void;
  timeFormat: '12h' | '24h';
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

/**
 * Custom time input that respects the app's time format setting.
 * Displays in 12h or 24h format based on setting.
 */
function TimeInput({ onChange, timeFormat, autoFocus, onKeyDown }: TimeInputProps) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);

  // Auto-focus hours input
  useEffect(() => {
    if (autoFocus && hoursRef.current) {
      hoursRef.current.focus();
    }
  }, [autoFocus]);

  // Convert current state to HH:mm format and notify parent
  const notifyChange = (h: string, m: string, p: 'AM' | 'PM') => {
    let hours24 = parseInt(h) || 0;

    if (timeFormat === '12h') {
      if (p === 'PM' && hours24 !== 12) {
        hours24 += 12;
      } else if (p === 'AM' && hours24 === 12) {
        hours24 = 0;
      }
    }

    const mins = parseInt(m) || 0;
    const value = `${hours24.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    onChange(value);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const max = timeFormat === '12h' ? 12 : 23;

    if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= max)) {
      setHours(val);

      // Auto-advance to minutes after 2 digits
      if (val.length === 2) {
        minutesRef.current?.focus();
      }

      notifyChange(val, minutes, period);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');

    if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
      setMinutes(val);
      notifyChange(hours, val, period);
    }
  };

  const handlePeriodToggle = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    notifyChange(hours, minutes, newPeriod);
  };

  const handleHoursBlur = () => {
    if (hours && timeFormat === '24h') {
      const padded = hours.padStart(2, '0');
      setHours(padded);
    }
  };

  const handleMinutesBlur = () => {
    if (minutes) {
      const padded = minutes.padStart(2, '0');
      setMinutes(padded);
    }
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent) => {
    // Pass through to parent handler
    onKeyDown?.(e);

    // Handle backspace to go back to hours
    if (e.key === 'Backspace' && e.currentTarget === minutesRef.current && minutes === '') {
      hoursRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-hover-bg border border-border-subtle rounded-sm px-12 py-8">
        <input
          ref={hoursRef}
          type="text"
          inputMode="numeric"
          value={hours}
          onChange={handleHoursChange}
          onBlur={handleHoursBlur}
          onKeyDown={handleKeyDownInternal}
          placeholder={timeFormat === '24h' ? '00' : '12'}
          className="w-[2ch] bg-transparent font-mono text-sm text-center outline-none placeholder-text-secondary"
          maxLength={2}
        />
        <span className="font-mono text-sm text-text-secondary mx-1">:</span>
        <input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          value={minutes}
          onChange={handleMinutesChange}
          onBlur={handleMinutesBlur}
          onKeyDown={handleKeyDownInternal}
          placeholder="00"
          className="w-[2ch] bg-transparent font-mono text-sm text-center outline-none placeholder-text-secondary"
          maxLength={2}
        />
      </div>

      {timeFormat === '12h' && (
        <button
          type="button"
          onClick={handlePeriodToggle}
          className="px-8 py-8 bg-hover-bg border border-border-subtle rounded-sm font-mono text-sm hover:border-text-secondary transition-colors"
        >
          {period}
        </button>
      )}
    </div>
  );
}

export default TimeInput;
