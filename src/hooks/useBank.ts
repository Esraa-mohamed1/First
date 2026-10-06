import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLibraries,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getBankItems,
  getBankItemById,
  createBankItem,
  updateBankItem,
  deleteBankItems,
  duplicateBankItems,
  moveBankItems,
} from '@/services/bank';
import {
  GetBankItemsParams,
  CreateLibraryPayload,
  UpdateLibraryPayload,
  CreateBankItemPayload,
  UpdateBankItemPayload,
} from '@/types/bank';

/**
 * Unified Query Key Factory for Content Bank
 */
export const bankKeys = {
  all: ['bank'] as const,
  libraries: () => [...bankKeys.all, 'libraries'] as const,
  items: (params?: GetBankItemsParams) =>
    params !== undefined
      ? ([...bankKeys.all, 'items', params] as const)
      : ([...bankKeys.all, 'items'] as const),
  item: (id: string | number) => [...bankKeys.all, 'item', String(id)] as const,
};

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Hook to fetch all content libraries
 */
export const useLibraries = () => {
  return useQuery({
    queryKey: bankKeys.libraries(),
    queryFn: () => getLibraries(),
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to fetch bank items with filters and pagination
 */
export const useBankItems = (params?: GetBankItemsParams) => {
  return useQuery({
    queryKey: bankKeys.items(params),
    queryFn: () => getBankItems(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to fetch a single bank item by ID
 */
export const useBankItem = (id?: string | number) => {
  return useQuery({
    queryKey: bankKeys.item(id || ''),
    queryFn: () => getBankItemById(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
};

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Hook to create a new content library
 */
export const useCreateLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLibraryPayload) => createLibrary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
    },
  });
};

/**
 * Hook to update a content library
 */
export const useUpdateLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateLibraryPayload }) =>
      updateLibrary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
    },
  });
};

/**
 * Hook to delete a content library
 */
export const useDeleteLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
    },
  });
};

/**
 * Hook to create a new bank item
 */
export const useCreateBankItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankItemPayload) => createBankItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.items() });
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
    },
  });
};

/**
 * Hook to update an existing bank item
 */
export const useUpdateBankItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateBankItemPayload }) =>
      updateBankItem(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bankKeys.items() });
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
      queryClient.invalidateQueries({ queryKey: bankKeys.item(variables.id) });
    },
  });
};

/**
 * Hook to delete multiple bank items in batch
 */
export const useDeleteBankItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: (string | number)[]) => deleteBankItems(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.items() });
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
    },
  });
};

/**
 * Hook to duplicate multiple bank items
 */
export const useDuplicateBankItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ids,
      targetLibraryId,
    }: {
      ids: (string | number)[];
      targetLibraryId?: string | number;
    }) => duplicateBankItems(ids, targetLibraryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.items() });
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
    },
  });
};

/**
 * Hook to move multiple bank items to another library
 */
export const useMoveBankItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ids,
      libraryId,
    }: {
      ids: (string | number)[];
      libraryId: string | number;
    }) => moveBankItems(ids, libraryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.items() });
      queryClient.invalidateQueries({ queryKey: bankKeys.libraries() });
    },
  });
};
