import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { CounterState, ProductsState } from '@mfe/shared-types';
import '@testing-library/jest-dom';

import App from './App';

const mockCounterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 } as CounterState,
  reducers: {
    decrement: (state) => { state.value -= 1; },
  },
});

const mockProductsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null } as ProductsState,
  reducers: {},
});

const renderWithStore = (preloadedState: object) => {
  const store = configureStore({
    reducer: {
      counter: mockCounterSlice.reducer,
      products: mockProductsSlice.reducer,
    },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

describe('App - error state', () => {
  it('shows error message when products status is failed', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: [], status: 'failed', error: 'Network error' },
    });
    expect(screen.getByText('Hata: Ürünler yüklenemedi.')).toBeInTheDocument();
  });

  it('does not show product list in error state', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: [], status: 'failed', error: 'Network error' },
    });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('still shows counter in error state', () => {
    renderWithStore({
      counter: { value: 10 },
      products: { items: [], status: 'failed', error: 'Network error' },
    });
    expect(screen.getByText('Paylaşılan Sayaç Değeri: 10')).toBeInTheDocument();
  });
});
