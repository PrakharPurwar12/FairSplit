import api from './api';

const AllocationService = {
  async generateAllocation(projectId) {
    const response = await api.post(`/allocation/generate/${projectId}/`);
    return response.data;
  },
};

export default AllocationService;
