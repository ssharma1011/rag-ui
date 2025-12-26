import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '../types/workflow';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

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
        return 'border-blue-300 bg-blue-50';
      case 'COMPLETED':
        return 'border-green-300 bg-green-50';
      case 'FAILED':
        return 'border-red-300 bg-red-50';
      case 'WAITING_FOR_DEVELOPER':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-2xl">
        <div className={`border-2 rounded-lg px-4 py-3 shadow-sm ${getStatusColor()}`}>
          {/* Agent Badge */}
          {message.agent && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300">
              <span className="text-sm font-semibold text-gray-700">{message.agent}</span>
              {getStatusIcon()}
            </div>
          )}

          {/* Progress Bar */}
          {message.progress !== undefined && message.progress > 0 && (
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${message.progress * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {Math.round(message.progress * 100)}% complete
              </div>
            </div>
          )}

          {/* Message Content with Markdown */}
          <div className="prose prose-sm max-w-none">
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
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm" {...rest}>
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
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
