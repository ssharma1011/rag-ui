import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3, Home } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-white p-1.5 rounded-lg">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AutoFlow</h1>
              <p className="text-xs text-blue-100">AI Code Assistant</p>
            </div>
          </Link>

          <nav className="flex space-x-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
            <Link
              to="/metrics"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/metrics'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Metrics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
