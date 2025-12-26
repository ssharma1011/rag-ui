import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types/workflow';
import { UserMessage } from './UserMessage';
import { AgentMessage } from './AgentMessage';

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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-2xl font-semibold mb-2">Welcome to AutoFlow</h2>
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {message.role === 'user' ? (
                <UserMessage message={message} />
              ) : (
                <AgentMessage message={message} />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
