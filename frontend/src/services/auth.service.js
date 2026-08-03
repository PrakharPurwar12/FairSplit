import api from './api';

const AuthService = {
  
  async login(username, password) {
    const response = await api.post('/account/login/', {
      username,
      password,
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/account/register/', userData);
    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/account/logout/', { refresh: refreshToken });
      } catch (err) {
        console.warn('Backend logout call failed or token already invalid:', err);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async getCurrentUser() {
    const response = await api.get('/account/profile/');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.patch('/account/profile/', profileData);
    return response.data;
  },

  async getOAuthUrl(provider) {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const response = await api.get(`/account/oauth/url/?provider=${provider}&redirect_uri=${redirectUri}`);
    return response.data;
  },

  async oauthLogin(provider, code) {
    const response = await api.post('/account/oauth/login/', {
      provider,
      code,
      redirect_uri: window.location.origin + '/auth/callback'
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
};

export default AuthService;
