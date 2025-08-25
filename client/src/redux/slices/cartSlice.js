import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const calculateEffectivePrice = (product) => {
  const originalPrice = parseFloat(product.price);
  const discountPercentage = product.discountPercentage ? parseFloat(product.discountPercentage) : 0;
  if (discountPercentage > 0) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discountAmount;
  }
  return originalPrice;
};

// Thunk validar productos del carrito
const validateCartItems = createAsyncThunk(
  'cart/validateCartItems',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { cartItems } = getState().cart;
    const { token } = getState().auth;
    
    if (cartItems.length === 0) return { validItems: [], removedItems: [] };
    
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const removedItems = [];
    let hasNetworkError = false;
    
    for (const item of cartItems) {
      try {
        const response = await api.get(`/products/${item.id}`, config);
        const product = response.data;
        if (product.stock < item.quantity) {
          if (product.stock === 0) {
            removedItems.push(item.id);
          } else {
            dispatch(updateQuantity({
              productId: item.id, 
              newQuantity: product.stock, 
              stock: product.stock 
            }));
          }
        }
      } catch (error) {
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          hasNetworkError = true;
        } else if (error.response?.status === 404 || error.response?.status === 400) {
          removedItems.push(item.id);
        }
      }
    }
    
    if (hasNetworkError) {
      return rejectWithValue('Error al validar los productos del carrito');
    }
    
    return { validItems: cartItems.filter(item => !removedItems.includes(item.id)), removedItems };
  }
);

// Thunk agregar producto al carrito con validación
const addToCartWithValidation = createAsyncThunk(
  'cart/addToCartWithValidation',
  async ({ product, quantity = 1 }, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    try {
      const response = await api.get(`/products/${product.id}`, config);
      const currentProduct = response.data;
      
      if (currentProduct.stock === 0) {
        return rejectWithValue('El producto no tiene stock disponible');
      }
      
      if (currentProduct.stock < quantity) {
        return rejectWithValue(`Solo hay ${currentProduct.stock} unidades disponibles`);
      }
      
      dispatch(addToCart({ product: currentProduct, quantity }));
      return { success: true };
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue('El producto ya no está disponible');
      }
      return rejectWithValue('Error al agregar el producto al carrito');
    }
  }
);

const initialState = {
  cartItems: [],
  notification: {
    show: false,
    productName: '',
    productImage: '',
    productPrice: 0,
    quantityAdded: 0,
  },
  validationLoading: false,
  validationError: null,
  removedProducts: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const effectivePrice = calculateEffectivePrice(product);
      
      const existingItemIndex = state.cartItems.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        const currentItem = state.cartItems[existingItemIndex];
        const newQuantity = currentItem.quantity + quantity;

        if (newQuantity <= product.stock) {
          state.cartItems[existingItemIndex] = { 
            ...currentItem, 
            quantity: newQuantity, 
            effectivePrice 
          };
          
          state.notification = {
            show: true,
            productName: product.name,
            productImage: (product.imageData && product.imageType) ? 
              { imageData: product.imageData, imageType: product.imageType } : 
              (product.imageUrls?.[0] || "https://via.placeholder.com/100"),
            productPrice: effectivePrice,
            quantityAdded: quantity,
          };
        }
      } else {
        if (quantity <= product.stock && product.stock > 0) {
          state.cartItems.push({ ...product, quantity, effectivePrice });
          
          state.notification = {
            show: true,
            productName: product.name,
            productImage: (product.imageData && product.imageType) ? 
              { imageData: product.imageData, imageType: product.imageType } : 
              (product.imageUrls?.[0] || "https://via.placeholder.com/100"),
            productPrice: effectivePrice,
            quantityAdded: quantity,
          };
        }
      }
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== productId);
    },
    
    updateQuantity: (state, action) => {
      const { productId, newQuantity, stock } = action.payload;
      let finalQuantity = newQuantity;
      
      if (newQuantity < 1) finalQuantity = 1;
      if (newQuantity > stock) finalQuantity = stock;
      
      const itemIndex = state.cartItems.findIndex(item => item.id === productId);
      if (itemIndex > -1) {
        state.cartItems[itemIndex].quantity = finalQuantity;
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
    },
    
    closeNotification: (state) => {
      state.notification.show = false;
    },

    clearRemovedProducts: (state) => {
      state.removedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCartItems.pending, (state) => {
        state.validationLoading = true;
        state.validationError = null;
      })
      .addCase(validateCartItems.fulfilled, (state, action) => {
        state.validationLoading = false;
        state.validationError = null;
        const { removedItems } = action.payload;
        
        if (removedItems.length > 0) {
          state.cartItems = state.cartItems.filter(item => !removedItems.includes(item.id));
          state.removedProducts = removedItems;
        }
      })
      .addCase(validateCartItems.rejected, (state, action) => {
        state.validationLoading = false;
        state.validationError = 'Error al validar los productos del carrito';
      })
      .addCase(addToCartWithValidation.pending, (state) => {
        state.validationLoading = true;
      })
      .addCase(addToCartWithValidation.fulfilled, (state) => {
        state.validationLoading = false;
      })
      .addCase(addToCartWithValidation.rejected, (state) => {
        state.validationLoading = false;
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  closeNotification,
  clearRemovedProducts
} = cartSlice.actions;

export { validateCartItems, addToCartWithValidation };

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartItemsCount = (state) => 
  state.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => 
  state.cart.cartItems.reduce((total, item) => total + (item.effectivePrice * item.quantity), 0);
export const selectNotification = (state) => state.cart.notification;
export const selectValidationLoading = (state) => state.cart.validationLoading;
export const selectValidationError = (state) => state.cart.validationError;
export const selectRemovedProducts = (state) => state.cart.removedProducts;

export default cartSlice.reducer; 