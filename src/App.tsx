import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { MetricsDashboard } from './components/MetricsDashboard';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<ChatContainer />} />
              <Route path="/metrics" element={<MetricsDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
