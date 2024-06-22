import {
  getOrderByNumberApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getIngredientsApi
} from './../utils/burger-api';
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
  error: Error | null;
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
  error: null,
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

const findIndexById = (array: { id: string }[], id: string) =>
  array.findIndex((el) => el.id === id);

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
    },
    up: (state, action: PayloadAction<string>) => {
      const index = findIndexById(
        state.burgerConstructor.ingredients,
        action.payload
      );
      // console.log('UP', state.ingredients[index]);
      if (index > 0) {
        [
          state.burgerConstructor.ingredients[index],
          state.burgerConstructor.ingredients[index - 1]
        ] = [
          state.burgerConstructor.ingredients[index - 1],
          state.burgerConstructor.ingredients[index]
        ];
      }
    },
    down: (state, action: PayloadAction<string>) => {
      const index = findIndexById(
        state.burgerConstructor.ingredients,
        action.payload
      );
      // console.log('DOWN', state.burgerConstructor.ingredients[index]);
      if (index !== -1 && index < state.ingredients.length - 1) {
        [
          state.burgerConstructor.ingredients[index],
          state.burgerConstructor.ingredients[index + 1]
        ] = [
          state.burgerConstructor.ingredients[index + 1],
          state.burgerConstructor.ingredients[index]
        ];
      }
    }
  },

  selectors: {
    selectBuns: (stateBurger) => stateBurger.buns,
    selectMains: (stateBurger) => stateBurger.mains,
    selectSauces: (stateBurger) => stateBurger.sauces,
    selectIngredients: (stateBurger) => stateBurger.ingredients,
    selectFeeds: (stateBurger) => stateBurger.feeds,
    selectOrders: (stateBurger) => stateBurger.orderUser,
    selectCurrentOrder: (stateBurger) => stateBurger.currentOrder,
    selectIsLoading: (stateBurger) => stateBurger.isLoading,
    selectBurgerConstructor: (stateBurger) => stateBurger.burgerConstructor,
    selectOrderModal: (stateBurger) => stateBurger.burgerConstructor.orderModal
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload instanceof Error
            ? action.payload
            : new Error(
                action.payload ? String(action.payload) : 'Unknown error'
              );
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload.orders;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error =
          action.payload instanceof Error
            ? action.payload
            : new Error(
                action.payload ? String(action.payload) : 'Unknown error'
              );
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderUser = action.payload;
      })
      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload instanceof Error
            ? action.payload
            : new Error(
                action.payload ? String(action.payload) : 'Unknown error'
              );
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.burgerConstructor.orderModal = action.payload.order;
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload instanceof Error
            ? action.payload
            : new Error(
                action.payload ? String(action.payload) : 'Unknown error'
              );
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
        // console.log(state.currentOrder);
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
  selectBurgerConstructor,
  selectCurrentOrder
} = burgerSlice.selectors;
export const {
  addBun,
  addIngredient,
  removeIngredient,
  setOrderModal,
  down,
  up
} = burgerSlice.actions;
export default burgerSlice.reducer;
