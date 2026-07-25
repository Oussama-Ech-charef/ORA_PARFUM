'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

const DROPDOWN_MAX_HEIGHT = 280;
const ITEM_HEIGHT = 44;
const GAP = 4;

export default function Select({ options, value, onChange, placeholder, className = '' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pos, setPos] = useState<DropdownPosition | null>(null);
  const [openUpward, setOpenUpward] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption?.label || placeholder || '';

  const calcPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dh = Math.min(options.length * ITEM_HEIGHT + 8, DROPDOWN_MAX_HEIGHT);
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;
    const upward = spaceBelow < dh && spaceAbove > spaceBelow;

    setOpenUpward(upward);
    setPos({
      top: upward ? rect.top - dh : rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  }, [options.length]);

  const openDropdown = useCallback(() => {
    calcPosition();
    setOpen(true);
    setActiveIndex(0);
  }, [calcPosition]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setPos(null);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;
    calcPosition();

    const onScroll = () => calcPosition();
    const onResize = () => calcPosition();
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDropdown(); };
    const onClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onEsc);
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, calcPosition, closeDropdown]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          openDropdown();
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeDropdown();
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
            closeDropdown();
          }
          break;
        case 'Tab':
          closeDropdown();
          break;
      }
    },
    [open, activeIndex, options, onChange, openDropdown, closeDropdown],
  );

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    closeDropdown();
  };

  const dropdown = open && mounted && pos ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        minWidth: '160px',
        maxHeight: `${DROPDOWN_MAX_HEIGHT}px`,
        overflowY: 'auto',
      }}
      className="z-[9999] bg-white border border-cream rounded-lg shadow-lg overflow-hidden"
    >
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
    </div>,
    document.body,
  ) : null;

  return (
    <div className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeDropdown() : openDropdown())}
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

      {dropdown}
    </div>
  );
}
