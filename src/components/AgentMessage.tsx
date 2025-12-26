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
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case 'COMPLETED':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'FAILED':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      case 'WAITING_FOR_DEVELOPER':
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="flex justify-start mb-6 group">
      <div className="flex items-start gap-3 max-w-3xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className={`border-2 rounded-2xl rounded-tl-sm px-5 py-4 shadow-md group-hover:shadow-lg transition-shadow ${getStatusColor()}`}>
            {/* Agent Badge */}
            {message.agent && (
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <span className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm">
                  {message.agent}
                </span>
                {getStatusIcon()}
              </div>
            )}

          {/* Progress Bar */}
          {message.progress !== undefined && message.progress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-300 rounded-full h-2.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${message.progress * 100}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-gray-700 mt-1.5">
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
          <div className="text-xs text-gray-500 mt-1.5">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
