import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalLoading: false,
  notifications: [],
  modals: {
    showLoginModal: false,
    showRegisterModal: false,
    showCartModal: false,
  },
  sidebar: {
    isOpen: false,
  },
  theme: {
    mode: 'light',
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    addNotification: (state, action) => {
      const { id, type, message, duration = 5000 } = action.payload;
      state.notifications.push({
        id,
        type,
        message,
        duration,
        timestamp: Date.now(),
      });
    },
    
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
        notification => notification.id !== notificationId
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    setModalState: (state, action) => {
      const { modalName, isOpen } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = isOpen;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload;
    },
    
    toggleTheme: (state) => {
      state.theme.mode = state.theme.mode === 'light' ? 'dark' : 'light';
    },
    
    setTheme: (state, action) => {
      state.theme.mode = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setModalState,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

// Selectors
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectSidebar = (state) => state.ui.sidebar;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer; 