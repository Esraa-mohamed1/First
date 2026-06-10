'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string | number;
  name: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'اختر خياراً',
  searchPlaceholder = 'ابحث هنا...',
  label,
  error,
  isLoading = false,
  className,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchPlaceholder] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.id) === String(value));
  }, [options, value]);

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchPlaceholder('');
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          handleSelect(filteredOptions[activeIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchPlaceholder('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeElement = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div className={cn('space-y-1.5 w-full', className)} ref={containerRef}>
      {label && (
        <label className="flex items-center gap-1 text-sm font-black text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${label}-label` : undefined}
          disabled={disabled}
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full p-4 bg-white border rounded-2xl outline-none transition-all text-right flex items-center justify-between group',
            isOpen ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-200 hover:border-blue-300',
            error ? 'border-red-500 bg-red-50/30' : '',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : selectedOption ? (
              <span className="font-bold text-sm text-gray-900 truncate">{selectedOption.name}</span>
            ) : (
              <span className="font-bold text-sm text-gray-400 truncate">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedOption && !disabled && !required && (
              <X
                size={16}
                className="text-gray-400 hover:text-red-500 transition-colors"
                onClick={clearSelection}
              />
            )}
            <ChevronDown
              size={18}
              className={cn(
                'text-gray-400 transition-transform duration-300',
                isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-500'
              )}
            />
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.length > 5 && (
              <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-blue-400 transition-all"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchPlaceholder(e.target.value);
                      setActiveIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            )}

            <div
              ref={listboxRef}
              role="listbox"
              className="max-h-64 overflow-y-auto overscroll-contain custom-scrollbar py-1"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = String(option.id) === String(value);
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={option.id}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'px-4 py-3 cursor-pointer transition-all flex items-center justify-between group',
                        isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50',
                        isActive ? 'bg-blue-50/50' : ''
                      )}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span className={cn('text-sm font-bold', isSelected ? 'font-black' : '')}>
                        {option.name}
                      </span>
                      {isSelected && <Check size={16} className="text-blue-600" />}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-bold text-gray-400 italic">لا توجد نتائج مطابقة</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <X size={12} className="shrink-0" />
          {error}
        </p>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
};
