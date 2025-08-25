import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar perfil de usuario');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put(`/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch(fetchUserProfile(userId));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar perfil de usuario');
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearUserProfile } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer; 