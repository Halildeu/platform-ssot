import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CounterState } from '@mfe/shared-types'; // GÜNCELLENDİ: Tip, paylaşılan paketten import edildi.

// ÖNCEDEN BURADA OLAN "interface CounterState" TANIMI SİLİNDİ.

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // Reducer'lar aynı kalıyor.
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;