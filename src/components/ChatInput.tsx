import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Github } from 'lucide-react';
import { isValidGitHubUrl } from '../utils/validation';

interface ChatInputProps {
  onSend: (message: string, repoUrl: string) => void;
  disabled: boolean;
  placeholder?: string;
  initialRepoUrl?: string;
  isRepoLocked?: boolean;
}

export const ChatInput = ({
  onSend,
  disabled,
  placeholder = 'Type your message...',
  initialRepoUrl = '',
  isRepoLocked = false
}: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [repoError, setRepoError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved repo URL from localStorage on mount if no initial URL provided
  useEffect(() => {
    if (!initialRepoUrl) {
      const savedRepoUrl = localStorage.getItem('lastRepoUrl');
      if (savedRepoUrl) {
        setRepoUrl(savedRepoUrl);
      }
    }
  }, [initialRepoUrl]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Validate repo URL when it changes
  useEffect(() => {
    if (repoUrl.trim()) {
      if (isValidGitHubUrl(repoUrl)) {
        setRepoError('');
        // Save valid URL to localStorage
        localStorage.setItem('lastRepoUrl', repoUrl.trim());
      } else {
        setRepoError('Invalid GitHub repository URL');
      }
    } else {
      setRepoError('');
    }
  }, [repoUrl]);

  const handleSend = () => {
    // Validate repository URL
    if (!repoUrl.trim()) {
      setRepoError('Repository URL is required');
      return;
    }

    if (!isValidGitHubUrl(repoUrl)) {
      setRepoError('Please enter a valid GitHub repository URL');
      return;
    }

    if (input.trim() && !disabled) {
      onSend(input.trim(), repoUrl.trim());
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
    <div className="border-t border-gray-200 bg-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Repository URL Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <Github className="w-3.5 h-3.5" />
            Repository URL
            <span className="text-red-500">*</span>
            {repoUrl && !repoError && (
              <span className="text-green-600 text-xs font-normal ml-auto">✓ Valid</span>
            )}
            {isRepoLocked && (
              <span className="text-blue-600 text-xs font-normal ml-auto">🔒 Locked</span>
            )}
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            disabled={disabled || isRepoLocked}
            className={`w-full px-3 py-2 rounded-lg border-2 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 transition-all ${
              repoError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : isRepoLocked
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500`}
          />
          {repoError && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span>
              {repoError}
            </p>
          )}
          {!repoError && repoUrl && !isRepoLocked && (
            <p className="text-gray-500 text-xs mt-1">
              This repository will be used for the entire chat session
            </p>
          )}
          {isRepoLocked && (
            <p className="text-blue-600 text-xs mt-1">
              To work on a different repository, start a new chat
            </p>
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none rounded-xl border-2 border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 max-h-24 overflow-hidden shadow-sm transition-all text-sm"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim() || !repoUrl.trim() || !!repoError}
            title={disabled ? placeholder : 'Send message'}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-sm flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Shift+Enter</kbd> for new line</span>
          {disabled && <span className="text-blue-600 font-medium">⏳ Processing...</span>}
        </div>
      </div>
    </div>
  );
};
