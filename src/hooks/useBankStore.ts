import { create } from 'zustand';
import { BankItemKind, Difficulty } from '@/types/bank';

export interface BankUIState {
  // Filters & Navigation State
  searchQuery: string;
  kindFilter: BankItemKind | 'all';
  selectedLibraryId: string | number | 'all';
  difficultyFilter: Difficulty | 'all';

  // Selection state for batch operations
  selectedItemIds: Set<string | number>;

  // Actions for filters
  setSearchQuery: (query: string) => void;
  setKindFilter: (kind: BankItemKind | 'all') => void;
  setSelectedLibraryId: (libraryId: string | number | 'all') => void;
  setDifficultyFilter: (difficulty: Difficulty | 'all') => void;
  resetFilters: () => void;

  // Actions for batch selection
  toggleSelectItem: (id: string | number) => void;
  selectItem: (id: string | number) => void;
  deselectItem: (id: string | number) => void;
  selectAllItems: (ids: (string | number)[]) => void;
  clearSelection: () => void;

  // Selection helpers
  isItemSelected: (id: string | number) => boolean;
}

export const useBankStore = create<BankUIState>((set, get) => ({
  searchQuery: '',
  kindFilter: 'all',
  selectedLibraryId: 'all',
  difficultyFilter: 'all',
  selectedItemIds: new Set<string | number>(),

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  setKindFilter: (kindFilter: BankItemKind | 'all') => set({ kindFilter }),

  setSelectedLibraryId: (selectedLibraryId: string | number | 'all') =>
    set({ selectedLibraryId }),

  setDifficultyFilter: (difficultyFilter: Difficulty | 'all') =>
    set({ difficultyFilter }),

  resetFilters: () =>
    set({
      searchQuery: '',
      kindFilter: 'all',
      selectedLibraryId: 'all',
      difficultyFilter: 'all',
    }),

  toggleSelectItem: (id: string | number) =>
    set((state) => {
      const next = new Set(state.selectedItemIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedItemIds: next };
    }),

  selectItem: (id: string | number) =>
    set((state) => {
      if (state.selectedItemIds.has(id)) return state;
      const next = new Set(state.selectedItemIds);
      next.add(id);
      return { selectedItemIds: next };
    }),

  deselectItem: (id: string | number) =>
    set((state) => {
      if (!state.selectedItemIds.has(id)) return state;
      const next = new Set(state.selectedItemIds);
      next.delete(id);
      return { selectedItemIds: next };
    }),

  selectAllItems: (ids: (string | number)[]) =>
    set({ selectedItemIds: new Set(ids) }),

  clearSelection: () => set({ selectedItemIds: new Set<string | number>() }),

  isItemSelected: (id: string | number) => get().selectedItemIds.has(id),
}));
