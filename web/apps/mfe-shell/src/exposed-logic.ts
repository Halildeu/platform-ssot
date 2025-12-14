import type { RootState } from './app/store/store';

export * from './features/counter/model/counter.slice';
export * from './features/products/model/products.slice';
export { store } from './app/store/store';
export type { RootState, AppDispatch } from './app/store/store';
export const selectAuthToken = (state: RootState) => state.auth.token;
