import api from './api';

const PredictionService = {
  async predictTaskRisk(taskFeatures) {
    const response = await api.post('/ml/predict-risk/', taskFeatures);
    return response.data;
  },

  async getProjectRisk(projectId) {
    const response = await api.get(`/analytics/risk/${projectId}/`);
    return response.data;
  },

  async recommendReassignment(taskId) {
    // RecommendReassignmentView uses POST method
    const response = await api.post(`/allocation/recommend/${taskId}/`);
    return response.data;
  }
};

export default PredictionService;
