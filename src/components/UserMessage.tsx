import { ChatMessage } from '../types/workflow';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-2xl">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-3 shadow-sm">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
