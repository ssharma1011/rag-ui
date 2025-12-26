import { History, X, MessageSquare, Clock, Github } from 'lucide-react';
import { ChatMessage } from '../types/workflow';

interface SavedConversation {
  id: string;
  repoUrl: string;
  messages: ChatMessage[];
  timestamp: Date;
  title?: string;
}

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (conversation: SavedConversation) => void;
  currentConversationId: string | null;
}

export const ConversationHistory = ({
  isOpen,
  onClose,
  onRestore,
  currentConversationId,
}: ConversationHistoryProps) => {
  const getConversationHistory = (): SavedConversation[] => {
    try {
      const history = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
      return history.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      return [];
    }
  };

  const conversations = getConversationHistory();

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getConversationTitle = (conv: SavedConversation): string => {
    if (conv.title) return conv.title;
    const firstUserMessage = conv.messages.find((m) => m.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
    }
    return 'Untitled Conversation';
  };

  const getRepoName = (repoUrl: string): string => {
    try {
      const url = new URL(repoUrl);
      const parts = url.pathname.split('/').filter((p) => p);
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
    } catch (error) {
      // Invalid URL, return as is
    }
    return repoUrl;
  };

  const deleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this conversation?');
    if (confirmed) {
      try {
        const history = getConversationHistory();
        const updated = history.filter((c) => c.id !== convId);
        localStorage.setItem('conversationHistory', JSON.stringify(updated));
        // Force re-render by closing and opening
        onClose();
        setTimeout(() => {
          // This is a hack to force re-render, ideally we'd use state
          window.dispatchEvent(new Event('storage'));
        }, 0);
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Conversation History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No saved conversations yet</p>
              <p className="text-xs mt-1">Start chatting to create history</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onRestore(conv);
                  onClose();
                }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  conv.id === currentConversationId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                    {getConversationTitle(conv)}
                  </h3>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition-all flex-shrink-0"
                    title="Delete conversation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Github className="w-3 h-3" />
                  <span className="truncate">{getRepoName(conv.repoUrl)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{conv.messages.length} messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(conv.timestamp)}</span>
                  </div>
                </div>

                {conv.id === currentConversationId && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <span className="text-xs text-blue-600 font-medium">Current conversation</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {conversations.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              {conversations.length} saved conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
