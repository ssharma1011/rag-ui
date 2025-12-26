import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3, Home, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-white dark:bg-gray-700 p-1.5 rounded-lg transition-colors">
              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AutoFlow</h1>
              <p className="text-xs text-blue-100 dark:text-gray-400">AI Code Assistant</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-white hover:bg-white/20 dark:hover:bg-gray-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
            <Link
              to="/metrics"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/metrics'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-white hover:bg-white/20 dark:hover:bg-gray-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Metrics
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
