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

describe('App - loading state', () => {
  it('shows loading text when products status is loading', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: [], status: 'loading', error: null },
    });
    expect(screen.getByText('Ürünler Yükleniyor...')).toBeInTheDocument();
  });

  it('does not show product list during loading', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: [], status: 'loading', error: null },
    });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
