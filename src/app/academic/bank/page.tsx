'use client';

import React, { useState, useMemo } from 'react';
import { useLibraries, useBankItems } from '@/hooks/useBank';
import { useBankStore } from '@/hooks/useBankStore';
import BankHeader from '@/components/Academic/Bank/BankHeader';
import BankFilters from '@/components/Academic/Bank/BankFilters';
import LibraryCard from '@/components/Academic/Bank/LibraryCard';
import BankItemRow from '@/components/Academic/Bank/BankItemRow';
import BankEmptyState from '@/components/Academic/Bank/BankEmptyState';
import BankSkeleton from '@/components/Academic/Bank/BankSkeleton';
import BankErrorState from '@/components/Academic/Bank/BankErrorState';
import CreateLibraryModal from '@/components/Academic/Bank/CreateLibraryModal';
import { Library } from '@/types/bank';

export default function ContentBankPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Zustand UI state
  const searchQuery = useBankStore((state) => state.searchQuery);
  const kindFilter = useBankStore((state) => state.kindFilter);
  const resetFilters = useBankStore((state) => state.resetFilters);

  // Queries
  const {
    data: libraries = [],
    isLoading: isLibrariesLoading,
    isError: isLibrariesError,
    refetch: refetchLibraries,
  } = useLibraries();

  const isFilterActive = Boolean(searchQuery.trim() || kindFilter !== 'all');

  const {
    data: itemsResponse,
    isLoading: isItemsLoading,
    isError: isItemsError,
    refetch: refetchItems,
  } = useBankItems(
    isFilterActive
      ? {
          q: searchQuery.trim() || undefined,
          kind: kindFilter,
          page: 1,
          limit: 100,
        }
      : undefined
  );

  const items = itemsResponse?.items || [];
  const totalResults = itemsResponse?.total ?? items.length;

  // Compute aggregated counts for the filter chips
  const counts = useMemo(() => {
    let lesson = 0;
    let video = 0;
    let question = 0;
    let total = 0;

    libraries.forEach((lib) => {
      const c = lib.itemCounts;
      if (c) {
        lesson += c.lesson || 0;
        video += c.video || 0;
        question += c.question || 0;
        total += c.total ?? (c.lesson || 0) + (c.video || 0) + (c.question || 0);
      }
    });

    return { all: total, lesson, video, question };
  }, [libraries]);

  // Fast library lookup map for item rows
  const libraryMap = useMemo(() => {
    const map = new Map<string | number, Library>();
    libraries.forEach((lib) => {
      map.set(lib.id, lib);
      map.set(String(lib.id), lib);
    });
    return map;
  }, [libraries]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <BankHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Search & Kind Filters */}
      <BankFilters counts={counts} />

      {/* Main Content Area: Mode A (Library Grid) vs Mode B (Flat Results List) */}
      {!isFilterActive ? (
        // =====================================================================
        // MODE A: Library Grid View
        // =====================================================================
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">
              <span>المكتبات</span>
              {!isLibrariesLoading && libraries.length > 0 && (
                <span className="ms-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                  {libraries.length}
                </span>
              )}
            </h2>
          </div>

          {isLibrariesLoading ? (
            <BankSkeleton mode="grid" />
          ) : isLibrariesError ? (
            <BankErrorState onRetry={() => refetchLibraries()} />
          ) : libraries.length === 0 ? (
            <BankEmptyState
              type="no-libraries"
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {libraries.map((library) => (
                <LibraryCard key={library.id} library={library} />
              ))}
            </div>
          )}
        </div>
      ) : (
        // =====================================================================
        // MODE B: Search / Kind Filter Flat Results List
        // =====================================================================
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">نتائج البحث والتصفية</h2>
              {!isItemsLoading && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  {totalResults} {totalResults === 1 ? 'عنصر' : 'عناصر'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              عرض جميع المكتبات
            </button>
          </div>

          {isItemsLoading ? (
            <BankSkeleton mode="list" />
          ) : isItemsError ? (
            <BankErrorState onRetry={() => refetchItems()} />
          ) : items.length === 0 ? (
            <BankEmptyState type="no-results" onResetFilters={resetFilters} />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <BankItemRow
                  key={item.id}
                  item={item}
                  library={libraryMap.get(item.libraryId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Library Modal */}
      <CreateLibraryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
