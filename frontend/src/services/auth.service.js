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

  logout() {
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
    const response = await api.get(`/account/oauth/url/?provider=${provider}`);
    return response.data;
  },

  async oauthLogin(provider, code) {
    const response = await api.post('/account/oauth/login/', {
      provider,
      code,
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
};

export default AuthService;
