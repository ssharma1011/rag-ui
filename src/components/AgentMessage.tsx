import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '../types/workflow';
import { Loader2, CheckCircle2, XCircle, Clock, Bot } from 'lucide-react';

interface AgentMessageProps {
  message: ChatMessage;
}

export const AgentMessage = ({ message }: AgentMessageProps) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'RUNNING':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'WAITING_FOR_DEVELOPER':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (message.status) {
      case 'RUNNING':
        return 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800';
      case 'COMPLETED':
        return 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800';
      case 'FAILED':
        return 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800';
      case 'WAITING_FOR_DEVELOPER':
        return 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="flex justify-start mb-4 group">
      <div className="flex items-start gap-2 max-w-3xl">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 dark:bg-gray-600 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1">
          <div className={`border rounded-lg px-4 py-3 ${getStatusColor()}`}>
            {/* Agent Badge */}
            {message.agent && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 px-2 py-0.5 rounded">
                  {message.agent}
                </span>
                {getStatusIcon()}
              </div>
            )}

          {/* Progress Bar */}
          {message.progress !== undefined && message.progress > 0 && (
            <div className="mb-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${message.progress * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {Math.round(message.progress * 100)}% complete
              </div>
            </div>
          )}

          {/* Message Content with Markdown */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;

                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded text-xs font-mono" {...rest}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
          <div className="text-xs text-gray-500 mt-1.5">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
