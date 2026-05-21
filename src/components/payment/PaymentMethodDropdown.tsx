'use client';

import React from 'react';
import Select, { MultiValue } from 'react-select';
import { PaymentMethod } from '@/types/payment';

interface PaymentMethodDropdownProps {
  options: PaymentMethod[];
  selectedValues: string[];
  onChange: (selectedIds: string[]) => void;
  error?: string;
}

export const PaymentMethodDropdown = ({
  options,
  selectedValues,
  onChange,
  error,
}: PaymentMethodDropdownProps) => {
  const selectOptions = options.map((method) => ({
    value: method.id,
    label: method.name,
    ...method,
  }));

  const value = selectOptions.filter((option) => selectedValues.includes(option.value));

  const handleChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    onChange(newValue.map((v) => v.value));
  };

  const formatOptionLabel = (option: any) => (
    <div className="flex items-center gap-2">
      {option.logo ? (
        <img src={`https://api.darab.academy/${option.logo}`} alt={option.label} className="w-5 h-5 object-cover rounded shadow-sm" />
      ) : (
        <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      )}
      <span>{option.label}</span>
    </div>
  );

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">وسائل الدفع المقبولة</label>
      <Select
        isMulti
        options={selectOptions}
        value={value}
        onChange={handleChange}
        formatOptionLabel={formatOptionLabel}
        placeholder="اختر وسائل الدفع..."
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "لا توجد وسائل دفع متاحة"}
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: '0.75rem',
            borderColor: error ? '#ef4444' : state.isFocused ? '#4880FF' : '#e5e7eb',
            padding: '2px',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(72, 128, 255, 0.1)' : 'none',
            '&:hover': {
              borderColor: state.isFocused ? '#4880FF' : '#d1d5db',
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#374151',
            padding: '2px 8px',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#9ca3af',
            '&:hover': {
              backgroundColor: '#fee2e2',
              color: '#ef4444',
            },
          }),
        }}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
