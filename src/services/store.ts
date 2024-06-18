import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerReducer from '../slices/burgerSlice';
import userReducer from '../slices/userSlice';

const rootReducer = {
  burgerReducer,
  userReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

// const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера
// export type RootState = ReturnType<typeof rootReducer>;
