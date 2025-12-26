import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types/workflow';
import { UserMessage } from './UserMessage';
import { AgentMessage } from './AgentMessage';
import { MessageSquare, Sparkles } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
              <MessageSquare className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to AutoFlow
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-md">
              Your AI-powered code assistant with multi-agent workflows
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-md">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Start a conversation by typing a message below</span>
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
    </div>
  );
};
