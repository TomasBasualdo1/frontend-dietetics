import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { fetchUserProfile } from './userSlice';

// Async thunks usuarios
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar usuarios');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar usuario');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put(`/users/role/${userId}`, userData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const currentUserId = getState().auth.userId;
      if (currentUserId && parseInt(userId) === currentUserId) {
        dispatch(fetchUserProfile(currentUserId));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/users', userData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear usuario');
    }
  }
);

// Async thunks categories
export const fetchAllCategories = createAsyncThunk(
  'admin/fetchAllCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get('/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías');
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/categories', categoryData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear categoría');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ categoryId, categoryData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put(`/categories/${categoryId}`, categoryData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar categoría');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (categoryId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar categoría');
    }
  }
);

// Async thunks products
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/products', productData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear producto');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put(`/products/${productId}`, productData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar producto');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar producto');
    }
  }
);

const initialState = {
  users: [],
  categories: [],
  loading: false,
  error: null,
  success: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearAdminData: (state) => {
      state.users = [];
      state.categories = [];
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.success = 'Usuario eliminado correctamente';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
        state.success = 'Usuario actualizado correctamente';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = 'Usuario creado correctamente';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.success = 'Categoría creada correctamente';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        );
        state.success = 'Categoría actualizada correctamente';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.payload);
        state.success = 'Categoría eliminada correctamente';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Producto creado correctamente';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Producto actualizado correctamente';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Producto eliminado correctamente';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearAdminData 
} = adminSlice.actions;

// Selectors
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminCategories = (state) => state.admin.categories;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectAdminSuccess = (state) => state.admin.success;

export default adminSlice.reducer; 