import axios from 'axios';
import { WorkflowRequest, WorkflowStatusResponse } from '../types/workflow';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const workflowApi = {
  /**
   * Start a new workflow
   */
  startWorkflow: async (request: WorkflowRequest): Promise<WorkflowStatusResponse> => {
    const hasLogs = request.logsPasted || (request.logFiles && request.logFiles.length > 0);

    if (hasLogs) {
      // Use multipart/form-data for requests with logs
      const formData = new FormData();
      formData.append('requirement', request.requirement);
      formData.append('repoUrl', request.repoUrl);

      if (request.targetClass) {
        formData.append('targetClass', request.targetClass);
      }

      if (request.logsPasted) {
        formData.append('logsPasted', request.logsPasted);
      }

      if (request.logFiles) {
        request.logFiles.forEach((file) => {
          formData.append('logFiles', file);
        });
      }

      const response = await apiClient.post<WorkflowStatusResponse>('/workflows/start', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Use JSON for simple requests
      const response = await apiClient.post<WorkflowStatusResponse>('/workflows/start', request);
      return response.data;
    }
  },

  /**
   * Get workflow status by conversation ID
   */
  getWorkflowStatus: async (conversationId: string): Promise<WorkflowStatusResponse> => {
    const response = await apiClient.get<WorkflowStatusResponse>(`/workflows/${conversationId}/status`);
    return response.data;
  },

  /**
   * Send developer response to a waiting workflow
   */
  respondToWorkflow: async (conversationId: string, response: string): Promise<WorkflowStatusResponse> => {
    const res = await apiClient.post<WorkflowStatusResponse>(`/workflows/${conversationId}/respond`, {
      response,
    });
    return res.data;
  },
};

export default apiClient;
