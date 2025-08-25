import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/purchase-orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear la orden');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, userId } = getState().auth;
      
      if (!userId) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      if (!token) {
        return rejectWithValue('Token no disponible');
      }
      
      const response = await api.get(`/purchase-orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar las órdenes');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get(`/purchase-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar la orden');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get('/purchase-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar las órdenes');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { token } = getState().auth;
      let endpoint;
      if (status === 'CONFIRMED') {
        endpoint = `/purchase-orders/${orderId}/confirm`;
      } else if (status === 'CANCELLED') {
        endpoint = `/purchase-orders/${orderId}/cancel`;
      } else {
        return rejectWithValue('Estado no válido');
      }
      
      const response = await api.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch(fetchAllOrders());
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el estado de la orden');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  userOrders: [],
  loading: false,
  error: null,
  checkoutData: {
    shippingAddress: null,
    paymentMethod: null,
    orderSummary: null
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setCheckoutData: (state, action) => {
      const { key, value } = action.payload;
      state.checkoutData[key] = value;
    },
    clearCheckoutData: (state) => {
      state.checkoutData = {
        shippingAddress: null,
        paymentMethod: null,
        orderSummary: null
      };
    },
    clearOrders: (state) => {
      state.orders = [];
      state.userOrders = [];
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentOrder, 
  setCheckoutData, 
  clearCheckoutData,
  clearOrders
} = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectCheckoutData = (state) => state.orders.checkoutData;

export default orderSlice.reducer; 