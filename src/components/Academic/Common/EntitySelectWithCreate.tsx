'use client';

import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SearchableSelect } from './SearchableSelect';
import { cn, translateErrorToArabic } from '@/lib/utils';

// --- Reusable Hooks ---

export function useRefreshOptions<T>(
  fetchFn: () => Promise<T[]>,
  setOptions: (options: T[]) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFn();
      setOptions(data);
      return data;
    } catch (error) {
      console.error('Failed to refresh options:', error);
      toast.error('فشل تحديث الخيارات');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { refresh, isLoading };
}

export function useCreateEntity(
  createFn: (payload: any) => Promise<any>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const create = async (payload: any) => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const data = await createFn(payload);
      return data;
    } catch (error: any) {
      if (error?.errors && typeof error.errors === 'object') {
        const errObj = error.errors as Record<string, string | string[]>;
        const mapped: Record<string, string> = {};
        const getFirst = (v: string | string[]) => (Array.isArray(v) ? v[0] : v) || '';
        Object.keys(errObj).forEach((key) => {
          mapped[key] = translateErrorToArabic(getFirst(errObj[key]));
        });
        setErrors(mapped);
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { create, isSubmitting, errors, setErrors };
}

// --- Create Entity Modal Component ---

interface CreateEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const CreateEntityModal: React.FC<CreateEntityModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            {icon && (
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-gray-900">{title}</h2>
              {description && (
                <p className="text-gray-400 font-bold text-xs mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Reusable EntitySelectWithCreate Component ---

interface Option {
  id: string | number;
  name: string;
  [key: string]: any;
}

interface EntitySelectWithCreateProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  
  // Creation props
  modalTitle: string;
  modalDescription?: string;
  modalIcon?: React.ReactNode;
  
  // Functions
  fetchOptions: () => Promise<any[]>;
  createEntity: (payload: any) => Promise<any>;
  renderForm: (props: {
    errors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (payload: any) => Promise<void>;
    onClose: () => void;
  }) => React.ReactNode;
  onCreated: (newEntity: any) => void;
}

export const EntitySelectWithCreate: React.FC<EntitySelectWithCreateProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
  required = false,
  modalTitle,
  modalDescription,
  modalIcon,
  fetchOptions,
  createEntity,
  renderForm,
  onCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { create, isSubmitting, errors, setErrors } = useCreateEntity(createEntity);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpen = () => {
    if (disabled) return;
    setErrors({});
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = async (payload: any) => {
    try {
      const newEntity = await create(payload);
      
      // Refresh options
      setIsRefreshing(true);
      try {
        await fetchOptions();
      } catch (err) {
        console.error('Failed to fetch options after create:', err);
      } finally {
        setIsRefreshing(false);
      }

      // Auto-select the newly created item
      onChange(newEntity.id);
      
      // Notify parent
      onCreated(newEntity);
      
      // Close modal
      handleClose();
    } catch (error: any) {
      console.error('Failed to create inline entity:', error);
      if (error?.errors && typeof error.errors === 'object') {
        // Handled by useCreateEntity
      } else {
        toast.error(translateErrorToArabic(error?.message || 'فشل تنفيذ العملية'));
      }
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="flex items-center gap-1 text-sm font-black text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 min-w-0">
          <SearchableSelect
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            isLoading={isRefreshing}
          />
        </div>
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled || isRefreshing}
          className="h-[54px] w-[54px] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-100 flex-shrink-0"
          title="إضافة جديد"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <X size={12} className="shrink-0" />
          {error}
        </p>
      )}

      <CreateEntityModal
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        description={modalDescription}
        icon={modalIcon}
      >
        {renderForm({
          errors,
          isSubmitting,
          onSubmit: handleFormSubmit,
          onClose: handleClose,
        })}
      </CreateEntityModal>
    </div>
  );
};
