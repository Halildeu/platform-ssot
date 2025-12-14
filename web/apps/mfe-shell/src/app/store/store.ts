import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/model/auth.slice';
import counterReducer from '../../features/counter/model/counter.slice';
import productsReducer from '../../features/products/model/products.slice';
import notificationsReducer from '../../features/notifications/model/notifications.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    products: productsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
