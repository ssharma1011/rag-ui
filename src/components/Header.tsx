import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3 } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">AutoFlow</h1>
            <span className="ml-2 text-sm text-gray-500">AI Code Assistant</span>
          </div>

          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Link>
            <Link
              to="/metrics"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/metrics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
