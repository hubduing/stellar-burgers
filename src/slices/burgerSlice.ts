import {
  getOrderByNumberApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getIngredientsApi
} from './../utils/burger-api';
// import { BurgerConstructor } from '@components';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../utils/types';
import { v4 as randomId } from 'uuid';

interface IBurgerConstructor {
  ingredients: TConstructorIngredient[];
  orderModal: TOrder | null;
  bun: Partial<TIngredient> | null;
}

interface BurgerState {
  ingredients: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  feeds: TOrder[];
  orderUser: TOrder[];
  isLoading: boolean;
  currentOrder: TOrder | null;
  burgerConstructor: IBurgerConstructor;
}

const initialState: BurgerState = {
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  feeds: [],
  orderUser: [],
  isLoading: true,
  currentOrder: null,
  burgerConstructor: {
    bun: null,
    ingredients: [],
    orderModal: null
  }
};

// Асинхронные запросы
export const fetchIngredients = createAsyncThunk(
  'fetchIngredients',
  getIngredientsApi
);
export const fetchFeeds = createAsyncThunk('fetchFeeds', getFeedsApi);
export const fetchOrders = createAsyncThunk('fetchOrders', getOrdersApi);
export const getOrder = createAsyncThunk('getOrder', getOrderByNumberApi);
export const orderBurger = createAsyncThunk('orderBurger', orderBurgerApi);

const burgerSlice = createSlice({
  name: 'burgerReducer',
  initialState,
  reducers: {
    // выбрать булочку
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.burgerConstructor.bun = action.payload;
    },
    // добавить ингредиент
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.burgerConstructor.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: randomId() }
      })
    },
    // удалить ингредиент
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    //  данные для модального окна
    setOrderModal: (state, action: PayloadAction<TOrder | null>) => {
      if (!action.payload) {
        state.burgerConstructor.bun = null;
        state.burgerConstructor.ingredients = [];
      }
      state.burgerConstructor.orderModal = action.payload;
    }
  },

  selectors: {
    selectBuns: (stateBurger) => stateBurger.buns,
    selectMains: (stateBurger) => stateBurger.mains,
    selectSauces: (stateBurger) => stateBurger.sauces,
    selectIngredients: (stateBurger) => stateBurger.ingredients,
    selectFeeds: (stateBurger) => stateBurger.feeds,
    selectOrders: (stateBurger) => stateBurger.orderUser,
    selectIsLoading: (stateBurger) => stateBurger.isLoading,
    selectBurgerConstructor: (stateBurger) => stateBurger.burgerConstructor,
    selectOrderModal: (stateBurger) => stateBurger.burgerConstructor.orderModal
    // Дополнительные селекторы для других частей состояния, если они нужны...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.buns = state.ingredients.filter(
          (ingredients) => ingredients.type === 'bun'
        );
        state.mains = state.ingredients.filter(
          (ingredients) => ingredients.type === 'main'
        );
        state.sauces = state.ingredients.filter(
          (ingredients) => ingredients.type === 'sauce'
        );
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload.orders;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderUser = action.payload;
      })
      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.burgerConstructor.orderModal = action.payload.order;
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
      });
  }
});

// Экспортируйте действия и редьюсер
export const {
  selectBuns,
  selectIngredients,
  selectMains,
  selectSauces,
  selectFeeds,
  selectIsLoading,
  selectOrders,
  selectOrderModal,
  selectBurgerConstructor
} = burgerSlice.selectors;
export const { addBun, addIngredient, removeIngredient } = burgerSlice.actions;
export default burgerSlice.reducer;
