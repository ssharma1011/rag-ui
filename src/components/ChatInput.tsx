import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { isValidGitHubUrl } from '../utils/validation';
import { detectLogs, countLogLines, extractRequirement, extractLogs } from '../utils/logDetection';
import { FileUpload } from './FileUpload';

interface ChatInputProps {
  onSend: (message: string, repoUrl: string, logsPasted?: string, logFiles?: File[]) => void;
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
  const [logFiles, setLogFiles] = useState<File[]>([]);
  const [detectedLogs, setDetectedLogs] = useState<string | null>(null);
  const [showDetectedLogs, setShowDetectedLogs] = useState(false);
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

  // Detect logs in input
  useEffect(() => {
    if (input.trim() && detectLogs(input)) {
      const logs = extractLogs(input);
      setDetectedLogs(logs || input);
    } else {
      setDetectedLogs(null);
    }
  }, [input]);

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

    if (input.trim()) {
      // Extract requirement and logs if logs detected
      let requirement = input.trim();
      let logsPasted: string | undefined = undefined;

      if (detectedLogs) {
        requirement = extractRequirement(input);
        logsPasted = detectedLogs;
      }

      // Send message with logs
      onSend(
        requirement,
        repoUrl.trim(),
        logsPasted,
        logFiles.length > 0 ? logFiles : undefined
      );

      // Clear input and files
      setInput('');
      setLogFiles([]);
      setDetectedLogs(null);
      setShowDetectedLogs(false);

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
            placeholder={disabled ? "AI is responding... Type to queue your next message" : placeholder}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-h-20 overflow-hidden shadow-sm transition-all text-sm"
            style={{ minHeight: '38px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !repoUrl.trim() || !!repoError}
            title={disabled ? "Queue message" : (detectedLogs || logFiles.length > 0 ? "Send + Logs" : "Send message")}
            className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-sm flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Detected logs badge */}
        {detectedLogs && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  📋 Logs detected: {countLogLines(detectedLogs)} lines
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowDetectedLogs(!showDetectedLogs)}
                  className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-all flex items-center gap-1"
                >
                  {showDetectedLogs ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Show
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDetectedLogs(null);
                    setInput(extractRequirement(input));
                  }}
                  className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
            {showDetectedLogs && (
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">
                {detectedLogs}
              </pre>
            )}
          </div>
        )}

        {/* File upload */}
        <FileUpload
          files={logFiles}
          onFilesChange={setLogFiles}
          disabled={disabled}
        />

        {disabled && <p className="text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
          AI is responding...
        </p>}
      </div>
    </div>
  );
};
