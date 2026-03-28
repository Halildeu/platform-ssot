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

const renderApp = (preloadedState: object = {}) => {
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

describe('App - structural rendering', () => {
  it('renders the MFE title', () => {
    renderApp();
    expect(screen.getByText('Burası "Ethic" Mikro Uygulaması')).toBeInTheDocument();
  });

  it('renders the port description text', () => {
    renderApp();
    expect(
      screen.getByText(/mfe-ethic tarafından yönetiliyor/),
    ).toBeInTheDocument();
  });

  it('renders the products section label', () => {
    renderApp();
    expect(
      screen.getByText('API\'dan Gelen ve Shell Tarafından Yönetilen Ürünler:'),
    ).toBeInTheDocument();
  });

  it('renders the decrement button', () => {
    renderApp();
    const button = screen.getByRole('button', { name: /Sayacı Azalt/ });
    expect(button).toBeInTheDocument();
  });

  it('renders a horizontal rule separator', () => {
    const { container } = renderApp();
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('wraps content in a div with dashed green border', () => {
    const { container } = renderApp();
    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe('DIV');
    expect((wrapper as HTMLElement).style.border).toBe('2px dashed green');
  });
});
