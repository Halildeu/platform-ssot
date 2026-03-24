import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { CounterState, ProductsState, Product } from '@mfe/shared-types';
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

describe('App - products display', () => {
  const products: Product[] = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Telefon' },
    { id: 3, name: 'Tablet' },
  ];

  it('renders all products as list items', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: products, status: 'succeeded', error: null },
    });
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Telefon')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
  });

  it('renders products in a ul element', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: products, status: 'succeeded', error: null },
    });
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(3);
  });

  it('renders empty list section when succeeded with no products', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: [], status: 'succeeded', error: null },
    });
    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });

  it('does not render any content when status is idle', () => {
    renderWithStore({
      counter: { value: 0 },
      products: { items: [], status: 'idle', error: null },
    });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('Ürünler Yükleniyor...')).not.toBeInTheDocument();
    expect(screen.queryByText(/Hata:/)).not.toBeInTheDocument();
  });
});
