import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { MetricsDashboard } from './components/MetricsDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<ChatContainer />} />
            <Route path="/metrics" element={<MetricsDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
