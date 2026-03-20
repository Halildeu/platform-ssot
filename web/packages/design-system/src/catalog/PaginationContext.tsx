import React from 'react';
import {
  usePaginationState,
  type PaginationStateController,
  type UsePaginationStateOptions,
} from './usePaginationState';

export const PaginationContext = React.createContext<PaginationStateController | null>(null);

export type PaginationStateProviderProps = React.PropsWithChildren<
  UsePaginationStateOptions & {
    value?: PaginationStateController;
  }
>;

export const PaginationStateProvider: React.FC<PaginationStateProviderProps> = ({
  children,
  value,
  ...options
}) => {
  const derivedValue = usePaginationState(options);
  return (
    <PaginationContext.Provider value={value ?? derivedValue}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = () => {
  const contextValue = React.useContext(PaginationContext);
  if (!contextValue) {
    throw new Error('usePaginationContext must be used within a PaginationStateProvider.');
  }

  return contextValue;
};

export default PaginationContext;
