import axios from 'axios';
import { SystemMetrics, ConversationMetrics, AgentMetrics } from '../types/metrics';

const API_BASE_URL = '/api/v1';

const metricsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const metricsApi = {
  /**
   * Get system-wide metrics
   */
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    const response = await metricsClient.get<SystemMetrics>('/metrics/system');
    return response.data;
  },

  /**
   * Get metrics for a specific conversation
   */
  getConversationMetrics: async (conversationId: string): Promise<ConversationMetrics> => {
    const response = await metricsClient.get<ConversationMetrics>(`/metrics/conversation/${conversationId}`);
    return response.data;
  },

  /**
   * Get metrics for a specific agent
   */
  getAgentMetrics: async (agentName: string): Promise<AgentMetrics> => {
    const response = await metricsClient.get<AgentMetrics>(`/metrics/agent/${agentName}`);
    return response.data;
  },

  /**
   * Reset all metrics
   */
  resetMetrics: async (): Promise<void> => {
    await metricsClient.post('/metrics/reset');
  },
};

export default metricsClient;
