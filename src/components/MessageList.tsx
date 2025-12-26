import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types/workflow';
import { UserMessage } from './UserMessage';
import { AgentMessage } from './AgentMessage';
import { MessageSquare, ChevronDown } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position < threshold;
  };

  const scrollToBottom = (force = false) => {
    // Only auto-scroll if user is near bottom OR if forced (user clicked button)
    if (force || isNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShowScrollButton(false);
    }
  };

  const handleScroll = () => {
    if (isNearBottom()) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  useEffect(() => {
    // Smart auto-scroll: only if user is already at bottom
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors relative"
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-2xl mb-6">
              <MessageSquare className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Welcome to AutoFlow
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Your AI-powered code assistant with multi-agent workflows
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span>Start a conversation by typing below</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <UserMessage message={message} />
                ) : (
                  <AgentMessage message={message} />
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && messages.length > 0 && (
        <button
          onClick={() => scrollToBottom(true)}
          className="fixed bottom-24 right-8 bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all z-20 flex items-center gap-2"
          title="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
          <span className="text-sm font-medium">New messages</span>
        </button>
      )}
    </div>
  );
};
