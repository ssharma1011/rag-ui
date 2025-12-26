export interface AgentMetrics {
  agentName: string;
  invocations: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  avgLatencyMs: number;
}

export interface SystemMetrics {
  totalConversations: number;
  totalInvocations: number;
  totalTokens: number;
  totalCost: number;
  topAgents: AgentMetrics[];
}

export interface ConversationMetrics {
  conversationId: string;
  totalInvocations: number;
  totalTokens: number;
  totalCost: number;
  agents: AgentMetrics[];
}
