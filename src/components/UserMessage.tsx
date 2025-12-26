import { ChatMessage } from '../types/workflow';
import { User } from 'lucide-react';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="flex justify-end mb-4 group">
      <div className="flex items-start gap-2 max-w-3xl">
        <div className="flex-1">
          <div className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg px-4 py-2.5">
            <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </div>
  );
};
