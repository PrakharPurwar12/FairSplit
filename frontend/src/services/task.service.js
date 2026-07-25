import api from './api';

const TaskService = {
  async getTasks() {
    const response = await api.get('/tasks/');
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.patch(`/tasks/${id}/`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}/`);
    return response.data;
  },

  async updateProgress(id, progressData) {
    const response = await api.patch(`/tasks/${id}/progress/`, progressData);
    return response.data;
  },
};

export default TaskService;
