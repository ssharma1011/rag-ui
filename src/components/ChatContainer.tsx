import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, WorkflowStatusResponse } from '../types/workflow';
import { workflowApi } from '../services/api';
import { useWorkflowPolling } from '../hooks/useWorkflowPolling';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { RefreshCw, Github } from 'lucide-react';

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
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [isRepoLocked, setIsRepoLocked] = useState<boolean>(false);

  const handleStatusUpdate = useCallback((status: WorkflowStatusResponse) => {
    console.log('📥 Status update received:', status);

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
    console.log('🔄 Current status:', status.status);

    if (status.status === 'COMPLETED' || status.status === 'FAILED') {
      console.log('✅ Workflow ended, unlocking input');
      setIsProcessing(false);
      setConversationId(null);
    } else if (status.status === 'WAITING_FOR_DEVELOPER') {
      console.log('⏸️  Waiting for developer, unlocking input');
      setIsProcessing(false);
    } else if (status.status === 'RUNNING') {
      console.log('🏃 Workflow running, keeping input locked');
      setIsProcessing(true);
    } else {
      // Fallback: if status is unknown but we got a message, unlock input
      console.log('❓ Unknown status, unlocking input as fallback');
      setIsProcessing(false);
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

  const handleSendMessage = async (content: string, messageRepoUrl: string) => {
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
        // Start new workflow with repoUrl
        const status = await workflowApi.startWorkflow({
          requirement: content,
          repoUrl: messageRepoUrl.trim(),
        });
        setConversationId(status.conversationId);
        setRepoUrl(messageRepoUrl.trim()); // Store the repo URL
        setIsRepoLocked(true); // Lock it for this chat session
        handleStatusUpdate(status);
      }
    } catch (error: any) {
      // Handle validation errors from backend
      const errorMessage = error?.response?.data?.error || error.message;
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `❌ ${errorMessage}`,
          status: 'FAILED',
          timestamp: new Date(),
        },
      ]);
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    if (isProcessing) {
      const confirmed = window.confirm(
        'A workflow is currently in progress. Are you sure you want to start a new conversation?'
      );
      if (!confirmed) return;
    }
    // Save current conversation to history before clearing
    if (messages.length > 0 && conversationId) {
      saveConversationToHistory();
    }
    setMessages([]);
    setConversationId(null);
    setIsProcessing(false);
    setRepoUrl('');
    setIsRepoLocked(false);
  };

  const saveConversationToHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      const conversation = {
        id: conversationId,
        timestamp: new Date().toISOString(),
        messages: messages,
        preview: messages[0]?.content?.substring(0, 50) + '...' || 'New conversation',
      };
      history.unshift(conversation);
      // Keep only last 20 conversations
      localStorage.setItem('conversationHistory', JSON.stringify(history.slice(0, 20)));
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  };

  // Auto-save conversation periodically
  useEffect(() => {
    if (messages.length > 0 && conversationId) {
      const timer = setTimeout(() => {
        saveConversationToHistory();
      }, 5000); // Save every 5 seconds
      return () => clearTimeout(timer);
    }
  }, [messages, conversationId]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with Current Repository and New Chat Button */}
      {isRepoLocked && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Github className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Working on</p>
                <p className="text-sm font-semibold text-gray-800">{repoUrl}</p>
              </div>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow-md border border-blue-200"
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
        initialRepoUrl={repoUrl}
        isRepoLocked={isRepoLocked}
      />
    </div>
  );
};
