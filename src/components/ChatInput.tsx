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
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 shadow-lg transition-colors">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Repository URL Input - Only show when not locked */}
        {!isRepoLocked && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Github className="w-3 h-3" />
              Repository URL
              <span className="text-red-500">*</span>
              {repoUrl && !repoError && (
                <span className="text-green-600 dark:text-green-400 text-xs font-normal ml-auto">✓</span>
              )}
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              disabled={disabled}
              className={`w-full px-2.5 py-1.5 rounded-md border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:ring-1 transition-all ${
                repoError
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              } disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed disabled:text-gray-500`}
            />
            {repoError && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">⚠️ {repoError}</p>
            )}
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed disabled:text-gray-500 max-h-20 overflow-hidden shadow-sm transition-all text-sm"
            style={{ minHeight: '38px' }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim() || !repoUrl.trim() || !!repoError}
            title={disabled ? placeholder : 'Send message'}
            className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-sm flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {disabled && <p className="text-blue-600 dark:text-blue-400 text-xs">⏳ Processing...</p>}
      </div>
    </div>
  );
};
