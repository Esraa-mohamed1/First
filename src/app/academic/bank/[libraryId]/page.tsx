'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useLibraries,
  useBankItems,
  useDeleteBankItems,
  useDuplicateBankItems,
  useMoveBankItems,
} from '@/hooks/useBank';
import { useBankStore } from '@/hooks/useBankStore';
import { BankItemKind, QuestionType } from '@/types/bank';
import { formatItemCountArabic } from '@/constants/bank';
import LibraryHeader from '@/components/Academic/Bank/LibraryHeader';
import LibraryTabs from '@/components/Academic/Bank/LibraryTabs';
import LibrarySearch from '@/components/Academic/Bank/LibrarySearch';
import BankItemRow from '@/components/Academic/Bank/BankItemRow';
import BankEmptyState from '@/components/Academic/Bank/BankEmptyState';
import BankSkeleton from '@/components/Academic/Bank/BankSkeleton';
import BankErrorState from '@/components/Academic/Bank/BankErrorState';
import BankPagination from '@/components/Academic/Bank/BankPagination';
import AddBankItemModal from '@/components/Academic/Bank/AddBankItemModal';
import BulkActionToolbar from '@/components/Academic/Bank/BulkActionToolbar';
import DeleteConfirmModal from '@/components/Academic/Bank/DeleteConfirmModal';
import MoveLibraryModal from '@/components/Academic/Bank/MoveLibraryModal';
import BankItemDetailModal from '@/components/Academic/Bank/BankItemDetailModal';

export default function LibraryDetailsPage() {
  const params = useParams();
  const libraryId = params?.libraryId as string;

  // Local state for filters and pagination within this library
  const [activeKind, setActiveKind] = useState<BankItemKind | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    itemId?: string | number;
    mode: 'view' | 'edit' | 'create';
    createQuestionType?: QuestionType;
  }>({
    isOpen: false,
    mode: 'view',
  });

  // Zustand Store for selection state
  const selectedItemIds = useBankStore((state) => state.selectedItemIds);
  const toggleSelectItem = useBankStore((state) => state.toggleSelectItem);
  const selectAllItems = useBankStore((state) => state.selectAllItems);
  const clearSelection = useBankStore((state) => state.clearSelection);

  // Bulk mutations
  const deleteMutation = useDeleteBankItems();
  const duplicateMutation = useDuplicateBankItems();
  const moveMutation = useMoveBankItems();

  const isFirstMount = React.useRef(true);
  const prevFiltersRef = React.useRef({ activeKind, searchQuery });

  // Clear selection when entering, leaving, or switching library
  useEffect(() => {
    clearSelection();
    return () => {
      clearSelection();
    };
  }, [libraryId, clearSelection]);

  // Clear selection and reset page ONLY when kind tab or search text actually changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (
      prevFiltersRef.current.activeKind !== activeKind ||
      prevFiltersRef.current.searchQuery !== searchQuery
    ) {
      prevFiltersRef.current = { activeKind, searchQuery };
      clearSelection();
      setCurrentPage(1);
    }
  }, [activeKind, searchQuery, clearSelection]);

  // 1. Fetch library metadata
  const {
    data: libraries = [],
    isLoading: isLibrariesLoading,
    isError: isLibrariesError,
    refetch: refetchLibraries,
  } = useLibraries();

  const library = useMemo(() => {
    return libraries.find((l) => String(l.id) === String(libraryId));
  }, [libraries, libraryId]);

  // 2. Fetch paginated bank items for this library
  const {
    data: itemsResponse,
    isLoading: isItemsLoading,
    isError: isItemsError,
    refetch: refetchItems,
  } = useBankItems({
    libraryId,
    kind: activeKind,
    q: searchQuery.trim() || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const items = itemsResponse?.items || [];
  const totalItems = itemsResponse?.total || 0;
  const totalPages = itemsResponse?.totalPages || Math.ceil(totalItems / pageSize) || 1;

  const isSearchActive = Boolean(searchQuery.trim() || activeKind !== 'all');

  // Handle select all visible items on the current page
  const handleSelectAllVisible = () => {
    const visibleIds = items.map((i) => i.id);
    selectAllItems(visibleIds);
  };

  // Calculate usedCount for the selected items to show in the Delete warning dialog
  const usedCount = useMemo(() => {
    let count = 0;
    items.forEach((item) => {
      if (selectedItemIds.has(item.id) && item.usageCount > 0) {
        count += 1;
      }
    });
    return count;
  }, [items, selectedItemIds]);

  // Bulk Delete Action Handler
  const handleConfirmDelete = async () => {
    const count = selectedItemIds.size;
    const ids = Array.from(selectedItemIds);
    if (ids.length === 0) return;

    try {
      await deleteMutation.mutateAsync(ids);
      clearSelection();
      setIsDeleteModalOpen(false);
      toast.success(`تم حذف ${formatItemCountArabic(count)}`);

      // If current page becomes empty and page > 1, go to previous page
      if (items.length <= ids.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error: any) {
      console.error('Failed to delete items:', error);
      toast.error(error?.message || 'حدث خطأ أثناء حذف العناصر');
      // Keep selection and dialog open on failure
    }
  };

  // Bulk Duplicate Action Handler
  const handleDuplicate = async () => {
    const count = selectedItemIds.size;
    const ids = Array.from(selectedItemIds);
    if (ids.length === 0) return;

    try {
      await duplicateMutation.mutateAsync({ ids });
      clearSelection();
      toast.success(`تم نسخ ${formatItemCountArabic(count)}`);
    } catch (error: any) {
      console.error('Failed to duplicate items:', error);
      toast.error(error?.message || 'حدث خطأ أثناء نسخ العناصر');
      // Keep selection on failure
    }
  };

  // Bulk Move Action Handler
  const handleConfirmMove = async (
    targetLibraryId: string | number,
    targetLibraryName: string
  ) => {
    const count = selectedItemIds.size;
    const ids = Array.from(selectedItemIds);
    if (ids.length === 0) return;

    try {
      await moveMutation.mutateAsync({ ids, libraryId: targetLibraryId });
      clearSelection();
      setIsMoveModalOpen(false);
      toast.success(`تم نقل ${formatItemCountArabic(count)} إلى «${targetLibraryName}»`);

      // If current page becomes empty and page > 1, go to previous page
      if (items.length <= ids.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error: any) {
      console.error('Failed to move items:', error);
      toast.error(error?.message || 'حدث خطأ أثناء نقل العناصر');
      // Keep selection and dialog open on failure
    }
  };

  if (isLibrariesLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto py-2" dir="rtl">
        <div className="w-48 h-8 bg-gray-200 rounded-2xl animate-pulse" />
        <BankSkeleton mode="list" />
      </div>
    );
  }

  if (isLibrariesError || (!isLibrariesLoading && !library)) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto py-4" dir="rtl">
        <BankErrorState
          message="لم نتمكن من العثور على هذه المكتبة أو حدث خطأ أثناء تحميل بياناتها."
          onRetry={() => refetchLibraries()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 sm:pb-28" dir="rtl">
      {/* Header (Normal or Selection Mode) */}
      <LibraryHeader
        library={library}
        selectedCount={selectedItemIds.size}
        onClearSelection={clearSelection}
        onSelectAllVisible={handleSelectAllVisible}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Kind Filter Tabs */}
      <LibraryTabs
        library={library}
        activeKind={activeKind}
        onSelectKind={setActiveKind}
      />

      {/* In-Library Search Input */}
      <LibrarySearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="ابحث داخل المكتبة…"
      />

      {/* Selection Multi-add Hint Banner */}
      <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50/60 rounded-2xl border border-indigo-100/70 text-xs font-medium text-indigo-900 text-start">
        <Sparkles size={16} className="text-indigo-600 shrink-0" />
        <span>علّم على أكتر من عنصر علشان تضيفهم لدورة أو اختبار مرة واحدة.</span>
      </div>

      {/* Main Items Content */}
      <div className="space-y-3">
        {isItemsLoading ? (
          <BankSkeleton mode="list" />
        ) : isItemsError ? (
          <BankErrorState
            message="تعذر تحميل عناصر المكتبة."
            onRetry={() => refetchItems()}
          />
        ) : items.length === 0 ? (
          isSearchActive ? (
            <BankEmptyState
              type="no-results"
              onResetFilters={() => {
                setActiveKind('all');
                setSearchQuery('');
                clearSelection();
              }}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-gray-200 max-w-lg mx-auto my-6 space-y-4 shadow-xs animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-gray-900">المكتبة فاضية</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                  لا توجد أي دروس أو فيديوهات أو أسئلة في هذه المكتبة بعد. ابدأ بإضافة محتواك الأول.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all text-sm cursor-pointer"
                >
                  <span>إضافة محتوى</span>
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => (
              <BankItemRow
                key={item.id}
                item={item}
                library={library}
                selectable
                isSelected={selectedItemIds.has(item.id)}
                onToggleSelect={() => toggleSelectItem(item.id)}
                onPreview={() =>
                  setDetailModalState({
                    isOpen: true,
                    itemId: item.id,
                    mode: 'view',
                  })
                }
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isItemsLoading && items.length > 0 && (
          <BankPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add Content Modal */}
      <AddBankItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        libraryId={libraryId}
        onSelectQuestionType={(type) => {
          setIsAddModalOpen(false);
          setDetailModalState({
            isOpen: true,
            mode: 'create',
            createQuestionType: type,
          });
        }}
      />

      {/* Bank Item Detail Modal (View / Edit / Create) */}
      <BankItemDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() => setDetailModalState((prev) => ({ ...prev, isOpen: false }))}
        itemId={detailModalState.itemId}
        mode={detailModalState.mode}
        libraryId={libraryId}
        createQuestionType={detailModalState.createQuestionType}
      />

      {/* Floating Bulk Actions Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedItemIds.size}
        onOpenMove={() => setIsMoveModalOpen(true)}
        onDuplicate={handleDuplicate}
        onOpenDelete={() => setIsDeleteModalOpen(true)}
        isDuplicating={duplicateMutation.isPending}
        isPending={deleteMutation.isPending || moveMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedItemIds.size}
        usedCount={usedCount}
        isPending={deleteMutation.isPending}
      />

      {/* Move Library Modal */}
      <MoveLibraryModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onConfirm={handleConfirmMove}
        libraries={libraries}
        currentLibraryId={libraryId}
        selectedCount={selectedItemIds.size}
        isPending={moveMutation.isPending}
      />
    </div>
  );
}
