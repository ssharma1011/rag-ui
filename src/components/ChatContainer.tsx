import { useState, useCallback } from 'react';
import { ChatMessage, WorkflowStatusResponse } from '../types/workflow';
import { workflowApi } from '../services/api';
import { useWorkflowPolling } from '../hooks/useWorkflowPolling';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

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
          timestamp: new Date(status.timestamp),
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
          timestamp: new Date(status.timestamp),
        },
      ];
    });

    // Stop processing if workflow is complete or failed
    if (status.status === 'COMPLETED' || status.status === 'FAILED') {
      setIsProcessing(false);
      setConversationId(null);
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

  return (
    <div className="flex flex-col h-full">
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
