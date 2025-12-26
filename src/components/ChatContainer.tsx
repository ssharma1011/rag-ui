import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, WorkflowStatusResponse } from '../types/workflow';
import { workflowApi } from '../services/api';
import { useWorkflowPolling } from '../hooks/useWorkflowPolling';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ConversationHistory } from './ConversationHistory';
import { RefreshCw, Github, History } from 'lucide-react';

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
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

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

  const handleSendMessage = async (
    content: string,
    messageRepoUrl: string,
    logsPasted?: string,
    logFiles?: File[]
  ) => {
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
        // Start new workflow with repoUrl and logs
        const status = await workflowApi.startWorkflow({
          requirement: content,
          repoUrl: messageRepoUrl.trim(),
          logsPasted,
          logFiles,
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
    if (!conversationId || messages.length === 0) return;

    try {
      const history = JSON.parse(localStorage.getItem('conversationHistory') || '[]');

      // Remove existing conversation with same ID if it exists (update scenario)
      const filteredHistory = history.filter((c: any) => c.id !== conversationId);

      const conversation = {
        id: conversationId,
        repoUrl: repoUrl,
        timestamp: new Date().toISOString(),
        messages: messages,
      };

      filteredHistory.unshift(conversation);

      // Keep only last 50 conversations
      localStorage.setItem('conversationHistory', JSON.stringify(filteredHistory.slice(0, 50)));
      console.log('💾 Conversation saved to history');
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  };

  const restoreConversation = (conversation: any) => {
    // Save current conversation before restoring
    if (conversationId && messages.length > 0) {
      saveConversationToHistory();
    }

    // Restore the conversation
    setMessages(conversation.messages);
    setConversationId(conversation.id);
    setRepoUrl(conversation.repoUrl);
    setIsRepoLocked(true);
    setIsProcessing(false);

    console.log('📂 Conversation restored:', conversation.id);
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
      {/* Header with Current Repository and Action Buttons */}
      {isRepoLocked && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-200 dark:border-gray-700 px-4 py-2 transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm border border-gray-200 dark:border-gray-600"
                title="View conversation history"
              >
                <History className="w-3.5 h-3.5" />
                History
              </button>
              <div className="flex items-center gap-1.5 ml-1">
                <Github className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium truncate max-w-md">{repoUrl}</p>
              </div>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition-all shadow-sm border border-blue-200 dark:border-gray-600"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>
        </div>
      )}

      {/* History button when no active conversation - ALWAYS SHOW */}
      {!isRepoLocked && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
            title="View conversation history"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
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

      {/* Conversation History Sidebar */}
      <ConversationHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onRestore={restoreConversation}
        currentConversationId={conversationId}
      />
    </div>
  );
};
