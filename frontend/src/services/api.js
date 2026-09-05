import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (import.meta.env.DEV) {
    return '/api';
  }

  console.warn(
    "VITE_API_BASE_URL is not defined in production build. Falling back to '/api'. This requires a reverse proxy (e.g., Nginx) to route requests to the backend."
  );

  return '/api';
};

// Create Axios instance with base URL from environment
const api = axios.create({
  baseURL: getBaseUrl(),
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // OAuth URL endpoint is public and does not require authentication.
    // Avoid attaching Authorization header so the browser does not
    // unnecessarily trigger a CORS preflight request.
    const isOAuthUrlRequest =
      config.url?.includes('/account/oauth/url/');

    if (token && !isOAuthUrlRequest) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for refresh token logic
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Safety check in case the error does not contain a request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If 401 Unauthorized and request hasn't already been retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use native axios here to avoid triggering this interceptor again
        const response = await axios.post(
          `${getBaseUrl()}/account/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem(
          'access_token',
          newAccessToken
        );

        // Attach new token to the original request
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → clear stored tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
