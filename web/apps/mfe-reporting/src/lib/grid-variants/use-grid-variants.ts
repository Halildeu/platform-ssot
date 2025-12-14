import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GridVariant } from '@mfe/shared-types';
import {
  createGridVariant,
  CreateGridVariantPayload,
  deleteGridVariant,
  fetchGridVariants,
  updateGridVariant,
  UpdateGridVariantPayload,
  cloneGridVariant,
  CloneGridVariantPayload,
  updateVariantPreference,
  UpdateVariantPreferencePayload,
  compareGridVariants,
} from './variants.api';

const queryKey = (gridId: string) => ['grid-variants', gridId] as const;

export const useGridVariants = (gridId: string) => {
  const queryClient = useQueryClient();

  const variantsQuery = useQuery({
    queryKey: queryKey(gridId),
    queryFn: () => fetchGridVariants(gridId),
    staleTime: 60_000,
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKey(gridId) });

  const createMutation = useMutation({
    mutationFn: (payload: CreateGridVariantPayload) => createGridVariant(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<GridVariant[]>(queryKey(gridId), (previous) => {
        let next = previous ? [...previous.filter((item) => item.id !== created.id), created] : [created];
        if (!created.isGlobal && created.isDefault) {
          next = next.map((variant) =>
            variant.id === created.id || variant.isGlobal
              ? variant
              : { ...variant, isDefault: false, isUserDefault: false },
          );
        }
        if (created.isGlobal && created.isGlobalDefault) {
          next = next.map((variant) =>
            variant.id === created.id || !variant.isGlobal
              ? variant
              : { ...variant, isGlobalDefault: false },
          );
        }
        return next.slice().sort(compareGridVariants);
      });
      invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateGridVariantPayload) => updateGridVariant(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<GridVariant[]>(queryKey(gridId), (previous) => {
        if (!previous) {
          return previous;
        }
        let next = previous.map((variant) => (variant.id === updated.id ? updated : variant));
        if (!updated.isGlobal && updated.isDefault) {
          next = next.map((variant) => {
            if (variant.id === updated.id) {
              return variant;
            }
            if (variant.isGlobal) {
              return variant;
            }
            return { ...variant, isDefault: false, isUserDefault: false };
          });
        }
        if (updated.isGlobal && updated.isGlobalDefault) {
          next = next.map((variant) => {
            if (variant.id === updated.id) {
              return variant;
            }
            if (!variant.isGlobal) {
              return variant;
            }
            return { ...variant, isGlobalDefault: false };
          });
        }
        return next.slice().sort(compareGridVariants);
      });
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGridVariant(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<GridVariant[]>(queryKey(gridId), (previous) =>
        previous ? previous.filter((variant) => variant.id !== id) : previous,
      );
      invalidate();
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (payload: CloneGridVariantPayload) => cloneGridVariant(payload),
    onSuccess: (cloned) => {
      queryClient.setQueryData<GridVariant[]>(queryKey(gridId), (previous) => {
        const next = previous ? [...previous, cloned] : [cloned];
        return next.slice().sort(compareGridVariants);
      });
      invalidate();
    },
  });

  const preferenceMutation = useMutation({
    mutationFn: (payload: UpdateVariantPreferencePayload) => updateVariantPreference(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKey(gridId) });
      const previous = queryClient.getQueryData<GridVariant[]>(queryKey(gridId));
      queryClient.setQueryData<GridVariant[]>(queryKey(gridId), (current) => {
        if (!current) {
          return current;
        }
        return current.map((variant) => {
          if (variant.id !== payload.variantId) {
            if (payload.isDefault && variant.isUserDefault) {
              return { ...variant, isUserDefault: false };
            }
            if (payload.isSelected && variant.isUserSelected) {
              return { ...variant, isUserSelected: false };
            }
            return variant;
          }
          return {
            ...variant,
            isUserDefault: payload.isDefault ?? variant.isUserDefault ?? false,
            isUserSelected: payload.isSelected ?? payload.isDefault ?? variant.isUserSelected ?? false,
          };
        });
      });
      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey(gridId), context.previous);
      }
    },
    onSuccess: (updated, payload) => {
      queryClient.setQueryData<GridVariant[]>(queryKey(gridId), (previous) => {
        if (!previous) {
          return previous;
        }
        const userDefault = updated.isUserDefault ?? payload.isDefault ?? false;
        const userSelected = updated.isUserSelected ?? payload.isSelected ?? userDefault;
        let next = previous.map((variant) =>
          variant.id === updated.id
            ? { ...updated, isUserDefault: userDefault, isUserSelected: userSelected }
            : variant,
        );
        if (userDefault) {
          next = next.map((variant) =>
            variant.id === updated.id
              ? variant
              : { ...variant, isUserDefault: false },
          );
        }
        if (userSelected) {
          next = next.map((variant) =>
            variant.id === updated.id
              ? variant
              : { ...variant, isUserSelected: false },
          );
        }
        return next.slice().sort(compareGridVariants);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(gridId) });
    },
  });

  return {
    variants: variantsQuery.data ?? [],
    isLoading: variantsQuery.isLoading,
    isFetching: variantsQuery.isFetching,
    error: variantsQuery.error,
    refetch: variantsQuery.refetch,
    createVariant: createMutation.mutateAsync,
    updateVariant: updateMutation.mutateAsync,
    deleteVariant: deleteMutation.mutateAsync,
    cloneVariant: cloneMutation.mutateAsync,
    updateVariantPreference: preferenceMutation.mutateAsync,
    createStatus: createMutation.status,
    updateStatus: updateMutation.status,
    deleteStatus: deleteMutation.status,
    cloneStatus: cloneMutation.status,
    preferenceStatus: preferenceMutation.status,
  };
};
