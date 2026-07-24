'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({ options, value, onChange, placeholder, className = '' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption?.label || placeholder || '';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setOpen(true);
          setActiveIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && options[activeIndex]) {
            onChange(options[activeIndex].value);
            setOpen(false);
          }
          break;
        case 'Tab':
          setOpen(false);
          break;
      }
    },
    [open, activeIndex, options, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-white border border-light-gray rounded-lg px-4 py-3 text-sm text-rich-black font-sans cursor-pointer transition-all duration-300 hover:border-gold-light focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selectedOption ? 'text-rich-black' : 'text-warm-gray'}`}>
          {displayText}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-warm-gray transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[160px] bg-white border border-cream rounded-lg shadow-lg overflow-hidden">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectOption(option.value)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full text-right px-4 py-2.5 text-sm transition-colors font-sans cursor-pointer ${
                option.value === value
                  ? 'text-gold font-semibold bg-ivory'
                  : index === activeIndex
                    ? 'bg-ivory text-rich-black'
                    : 'text-rich-black hover:bg-ivory'
              }`}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
