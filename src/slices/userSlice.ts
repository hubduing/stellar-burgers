import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

export const getUser = createAsyncThunk('getUser', getUserApi);
export const registerUser = createAsyncThunk('registerUser', registerUserApi);
export const updateUser = createAsyncThunk('updateUser', updateUserApi);
export const loginUser = createAsyncThunk('loginUser', loginUserApi);
export const logoutUser = createAsyncThunk('logoutUser', logoutApi);

// interface UserError {
//   message: string;
//   code: number;
// }

interface UserState {
  loading: boolean | null;
  user: TUser | null;
  error: string;
}

const initialState: UserState = {
  loading: false,
  user: null,
  error: ''
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (stateUser) => stateUser.user,
    selectError: (stateUser) => stateUser.error,
    selectIsUserLoading: (stateUser) => stateUser.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(registerUser.rejected, (state, _) => {
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        // state.error = action.payload;
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        // state.error = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.user = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        // state.error = action.payload;
        state.loading = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(logoutUser.rejected, (state, _) => {
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state, _) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem('refreshToken');
        setCookie('accessToken', '');
      });
  }
});

export const { selectError, selectUser, selectIsUserLoading } =
  userSlice.selectors;
export default userSlice.reducer;
