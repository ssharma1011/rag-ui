export type WorkflowStatus = 'RUNNING' | 'WAITING_FOR_DEVELOPER' | 'COMPLETED' | 'FAILED';

export interface WorkflowRequest {
  requirement: string;
  repoUrl: string;  // Changed from repoName to repoUrl
  targetClass?: string;
  logsPasted?: string;  // Logs pasted in chat
  logFiles?: File[];    // Uploaded log files
}

export interface WorkflowStatusResponse {
  conversationId: string;
  status: WorkflowStatus;
  message: string;
  currentAgent?: string;
  progress?: number;
  error?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
  status?: WorkflowStatus;
  progress?: number;
  timestamp: Date;
}
