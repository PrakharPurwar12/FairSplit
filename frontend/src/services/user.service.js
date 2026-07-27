import api from './api';

const UserService = {
  async getUsers() {
    const response = await api.get('/account/users/');
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/account/profile/');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.patch('/account/profile/', profileData);
    return response.data;
  }
};

export default UserService;
