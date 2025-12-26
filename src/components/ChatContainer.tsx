import { useState, useCallback } from 'react';
import { ChatMessage, WorkflowStatusResponse } from '../types/workflow';
import { workflowApi } from '../services/api';
import { useWorkflowPolling } from '../hooks/useWorkflowPolling';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { RefreshCw } from 'lucide-react';

// Helper function to safely parse timestamps
const parseTimestamp = (timestamp: string | Date): Date => {
  if (timestamp instanceof Date) return timestamp;
  const parsed = new Date(timestamp);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusUpdate = useCallback((status: WorkflowStatusResponse) => {
    // Update or add agent message
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];

      // If last message is from assistant and has the same agent, update it
      if (
        lastMessage &&
        lastMessage.role === 'assistant' &&
        lastMessage.agent === status.currentAgent
      ) {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: status.message,
          status: status.status,
          progress: status.progress,
          timestamp: parseTimestamp(status.timestamp),
        };
        return updatedMessages;
      }

      // Otherwise, add new message
      return [
        ...prevMessages,
        {
          id: `${Date.now()}-${status.currentAgent || 'system'}`,
          role: 'assistant',
          content: status.message,
          agent: status.currentAgent,
          status: status.status,
          progress: status.progress,
          timestamp: parseTimestamp(status.timestamp),
        },
      ];
    });

    // Update processing state based on workflow status
    if (status.status === 'COMPLETED' || status.status === 'FAILED') {
      setIsProcessing(false);
      setConversationId(null);
    } else if (status.status === 'WAITING_FOR_DEVELOPER') {
      // Allow user to respond when workflow is waiting
      setIsProcessing(false);
    } else if (status.status === 'RUNNING') {
      // Keep processing state while running
      setIsProcessing(true);
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Workflow error:', error);
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: `Error: ${error.message}`,
        status: 'FAILED',
        timestamp: new Date(),
      },
    ]);
    setIsProcessing(false);
    setConversationId(null);
  }, []);

  // Use polling hook
  useWorkflowPolling({
    conversationId,
    isProcessing,
    onStatusUpdate: handleStatusUpdate,
    onError: handleError,
  });

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsProcessing(true);

      if (conversationId) {
        // Respond to existing workflow
        const status = await workflowApi.respondToWorkflow(conversationId, content);
        handleStatusUpdate(status);
      } else {
        // Start new workflow
        const status = await workflowApi.startWorkflow({
          requirement: content,
          repoName: 'default-repo', // Could be made configurable
        });
        setConversationId(status.conversationId);
        handleStatusUpdate(status);
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleNewChat = () => {
    if (isProcessing) {
      const confirmed = window.confirm(
        'A workflow is currently in progress. Are you sure you want to start a new conversation?'
      );
      if (!confirmed) return;
    }
    setMessages([]);
    setConversationId(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button - Show when there are messages */}
      {messages.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </div>
      )}
      <MessageList messages={messages} />
      <ChatInput
        onSend={handleSendMessage}
        disabled={isProcessing}
        placeholder={
          isProcessing
            ? 'Processing... Please wait'
            : 'Describe what you want to build or ask a question...'
        }
      />
    </div>
  );
};
