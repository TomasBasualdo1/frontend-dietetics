import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/products', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar productos');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get(`/products/${productId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar el producto');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/categories', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar categorías');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get(`/products/category/${categoryId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar productos por categoría');
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  errorProducts: null,
  errorCategories: null,
  filters: {
    category: null,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearErrorProducts: (state) => {
      state.errorProducts = null;
    },
    clearErrorCategories: (state) => {
      state.errorCategories = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc'
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.errorProducts = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.errorProducts = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.errorProducts = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.errorProducts = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.errorProducts = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.errorProducts = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.errorCategories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.errorCategories = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.errorCategories = action.payload;
      })
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.errorProducts = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.errorProducts = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.errorProducts = action.payload;
      });
  },
});

export const {
  clearErrorProducts,
  clearErrorCategories,
  clearCurrentProduct,
  setFilter,
  clearFilters
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.errorProducts;
export const selectCategories = (state) => state.products.categories;
export const selectCategoriesError = (state) => state.products.errorCategories;
export const selectFilters = (state) => state.products.filters;

export default productSlice.reducer; 