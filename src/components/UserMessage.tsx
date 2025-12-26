import { ChatMessage } from '../types/workflow';
import { User } from 'lucide-react';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="flex justify-end mb-6 group">
      <div className="flex items-start gap-3 max-w-3xl">
        <div className="flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md group-hover:shadow-lg transition-shadow">
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
          <div className="text-xs text-gray-500 mt-1.5 text-right">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};
