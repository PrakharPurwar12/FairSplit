import api from './api';

const ProjectService = {
  async getProjects() {
    const response = await api.get('/projects/');
    return response.data;
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  async createProject(projectData) {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  async updateProject(id, projectData) {
    const response = await api.patch(`/projects/${id}/`, projectData);
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}/`);
    return response.data;
  },

  async getProjectMembers(projectId) {
    const response = await api.get(`/projects/${projectId}/members/`);
    return response.data;
  },

  async addProjectMember(projectId, memberData) {
    const response = await api.post(`/projects/${projectId}/members/`, memberData);
    return response.data;
  },

  async updateProjectMember(memberId, memberData) {
    const response = await api.patch(`/projects/members/${memberId}/`, memberData);
    return response.data;
  },

  async deleteProjectMember(memberId) {
    const response = await api.delete(`/projects/members/${memberId}/`);
    return response.data;
  },
};

export default ProjectService;
