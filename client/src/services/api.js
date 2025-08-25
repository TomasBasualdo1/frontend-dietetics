import axios from "axios";

const API_BASE_URL = "https://backend-dietetics.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const setupApiInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        import("../redux/slices/authSlice").then(({ logout }) => {
          store.dispatch(logout());
        });
      }

      if (error.response?.status === 403) {
        console.error("Acceso denegado");
      }

      if (error.response?.status === 404) {
        console.error("Recurso no encontrado");
      }

      if (error.response?.status >= 500) {
        console.error("Error del servidor");
      }

      return Promise.reject(error);
    }
  );
};

export default api;
