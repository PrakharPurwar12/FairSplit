import api from './api';

const InvitationService = {
  async sendInvitation(projectId, inviteData) {
    const response = await api.post(`/projects/${projectId}/invite/`, inviteData);
    return response.data;
  },

  async getProjectInvitations(projectId, status = '') {
    const url = status ? `/projects/${projectId}/invitations/?status=${status}` : `/projects/${projectId}/invitations/`;
    const response = await api.get(url);
    return response.data;
  },

  async getInvitationPreview(token) {
    const response = await api.get(`/invitations/${token}/`);
    return response.data;
  },

  async acceptInvitation(token) {
    const response = await api.post(`/invitations/${token}/accept/`);
    return response.data;
  },

  async cancelInvitation(invitationId) {
    const response = await api.post(`/invitations/${invitationId}/cancel/`);
    return response.data;
  },

  async resendInvitation(invitationId) {
    console.log('[RESEND TRACE: INVITATION_SERVICE BEFORE AXIOS] invitationId:', invitationId);
    try {
      const response = await api.post(`/invitations/${invitationId}/resend/`);
      console.log('[RESEND TRACE: INVITATION_SERVICE AXIOS SUCCESS] status:', response.status, 'data:', response.data);
      return response.data;
    } catch (error) {
      console.error('[RESEND TRACE: INVITATION_SERVICE AXIOS ERROR] error:', error);
      throw error;
    }
  },
};

export default InvitationService;
