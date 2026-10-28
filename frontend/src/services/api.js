import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('turfbook_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully & refresh expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't attempt refresh for auth endpoints
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login/') ||
                             originalRequest.url?.includes('/auth/register/') ||
                             originalRequest.url?.includes('/auth/token/refresh/');

      if (!isAuthEndpoint) {
        const refreshToken = localStorage.getItem('turfbook_refresh_token');

        if (refreshToken) {
          try {
            const refreshRes = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken,
            });

            if (refreshRes.data?.access) {
              const newAccessToken = refreshRes.data.access;
              localStorage.setItem('turfbook_access_token', newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshErr) {
            console.warn('Token refresh failed, clearing session', refreshErr);
          }
        }

        // If refresh failed or no refresh token was present:
        localStorage.removeItem('turfbook_access_token');
        localStorage.removeItem('turfbook_refresh_token');
        localStorage.removeItem('turfbook_user');
        window.dispatchEvent(new Event('auth:logout'));

        // If it was a public GET request (e.g. turfs list or turf detail), retry without Authorization header
        const isPublicGet = originalRequest.method?.toLowerCase() === 'get' &&
                            !originalRequest.url?.includes('/turfs/wishlist/') &&
                            !originalRequest.url?.includes('/bookings/') &&
                            !originalRequest.url?.includes('/owner/');

        if (isPublicGet) {
          delete originalRequest.headers.Authorization;
          return api(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

