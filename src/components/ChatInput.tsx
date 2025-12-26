import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSend, disabled, placeholder = 'Type your message...' }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none rounded-2xl border-2 border-gray-300 px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 max-h-32 overflow-y-auto shadow-sm transition-all text-base leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            title={disabled ? placeholder : 'Send message'}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3.5 rounded-2xl hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-sm transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2.5 text-xs text-gray-500 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Shift+Enter</kbd> for new line</span>
          {disabled && <span className="text-blue-600 font-medium">⏳ Processing...</span>}
        </div>
      </div>
    </div>
  );
};
