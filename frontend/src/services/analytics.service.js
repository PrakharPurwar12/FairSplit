import api from './api';

const AnalyticsService = {
  async getProjectDashboard(projectId) {
    const response = await api.get(`/analytics/project/${projectId}/`);
    return response.data;
  },

  async getTeamAnalytics(projectId) {
    const response = await api.get(`/analytics/team/${projectId}/`);
    return response.data;
  },

  async getRiskAnalytics(projectId) {
    const response = await api.get(`/analytics/risk/${projectId}/`);
    return response.data;
  },

  async getMemberAnalytics(memberId) {
    const response = await api.get(`/analytics/member/${memberId}/`);
    return response.data;
  }
};

export default AnalyticsService;
