import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, createSlice, EnhancedStore } from '@reduxjs/toolkit'; // EnhancedStore eklendi
import { CounterState, ProductsState } from '@mfe/shared-types';
import '@testing-library/jest-dom';

import App from './App';

// Test için mock counter slice
const mockCounterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 } as CounterState,
  reducers: {
    decrement: (state) => { state.value -= 1; },
  },
});

// Test için mock products slice
const mockProductsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null } as ProductsState,
  reducers: {},
});

// renderWithProviders fonksiyonunu tiplerle güncelliyoruz
const renderWithProviders = (
  ui: React.ReactElement, // 'ui' parametresine tip eklendi
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        counter: mockCounterSlice.reducer,
        products: mockProductsSlice.reducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: { preloadedState?: object; store?: EnhancedStore } = {} // Opsiyonlara tip eklendi
) => {
  // 'children' parametresine tip eklendi
  const Wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    return <Provider store={store}>{children}</Provider>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};


describe('Ethic MFE Entegrasyon Testi', () => {
  test('başlangıç durumunu doğru bir şekilde gösterir', () => {
    const preloadedState = {
      counter: { value: 5 },
      products: {
        items: [{ id: 1, name: 'Test Ürünü' }],
        status: 'succeeded' as const, // 'as const' ile tip daraltması
        error: null,
      },
    };
    renderWithProviders(<App />, { preloadedState });

    expect(screen.getByText('Paylaşılan Sayaç Değeri: 5')).toBeInTheDocument();
    expect(screen.getByText('Test Ürünü')).toBeInTheDocument();
  });

  test('butona tıklandığında sayacı azaltır', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<App />);
    
    expect(screen.getByText('Paylaşılan Sayaç Değeri: 0')).toBeInTheDocument();
    
    await user.click(screen.getByText("Shell'deki Sayacı Azalt"));
    
    expect(screen.getByText('Paylaşılan Sayaç Değeri: -1')).toBeInTheDocument();
    
    const finalState = store.getState();
    expect(finalState.counter.value).toBe(-1);
  });
});
