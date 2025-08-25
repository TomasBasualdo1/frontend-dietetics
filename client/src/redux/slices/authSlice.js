import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { clearCart } from './cartSlice';
import { clearUserProfile } from './userSlice';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/authenticate', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { access_token } = response.data;
      
      const userResponse = await api.get(`/users/email/${email}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      return {
        token: access_token,
        userId: userResponse.data.id
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error en el login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
      };

      const response = await api.post('/auth/register', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { access_token } = response.data;

      const userResponse = await api.get(`/users/email/${userData.email}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      return {
        token: access_token,
        userId: userResponse.data.id
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error en el registro');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    dispatch(clearCart());
    dispatch(clearUserProfile());
    return true;
  }
);

const initialState = {
  userId: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.userId = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(clearCart, (state) => {
      });
  },
});

export const { logout, clearError, setToken, setUserId } = authSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthUserId = (state) => state.auth.userId;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer; 