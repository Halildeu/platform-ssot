import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const createTestStore = (preloadedState: object = {}) =>
  configureStore({
    reducer: {
      counter: mockCounterSlice.reducer,
      products: mockProductsSlice.reducer,
    },
    preloadedState,
  });

describe('App - counter interactions', () => {
  it('displays counter value from store', () => {
    const store = createTestStore({ counter: { value: 42 }, products: { items: [], status: 'idle', error: null } });
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Paylaşılan Sayaç Değeri: 42')).toBeInTheDocument();
  });

  it('displays negative counter values', () => {
    const store = createTestStore({ counter: { value: -5 }, products: { items: [], status: 'idle', error: null } });
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Paylaşılan Sayaç Değeri: -5')).toBeInTheDocument();
  });

  it('decrements counter multiple times', async () => {
    const user = userEvent.setup();
    const store = createTestStore({ counter: { value: 3 }, products: { items: [], status: 'idle', error: null } });
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const button = screen.getByText("Shell'deki Sayacı Azalt");

    await user.click(button);
    expect(screen.getByText('Paylaşılan Sayaç Değeri: 2')).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('Paylaşılan Sayaç Değeri: 1')).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('Paylaşılan Sayaç Değeri: 0')).toBeInTheDocument();
  });

  it('dispatches decrement action on button click', async () => {
    const user = userEvent.setup();
    const store = createTestStore({ counter: { value: 0 }, products: { items: [], status: 'idle', error: null } });
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await user.click(screen.getByText("Shell'deki Sayacı Azalt"));

    expect(store.getState().counter.value).toBe(-1);
  });
});
