import { useState, useEffect } from 'react';
import { metricsApi } from '../services/metrics';
import { SystemMetrics } from '../types/metrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, Trash2, TrendingUp, Zap, DollarSign, MessageSquare } from 'lucide-react';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metricsApi.getSystemMetrics();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all metrics? This cannot be undone.')) {
      try {
        await metricsApi.resetMetrics();
        await fetchMetrics();
      } catch (err) {
        console.error('Failed to reset metrics:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error || 'No data available'}</div>
      </div>
    );
  }

  // Prepare chart data
  const tokenData = metrics.topAgents.map((agent) => ({
    name: agent.agentName,
    input: agent.inputTokens,
    output: agent.outputTokens,
  }));

  const costData = metrics.topAgents.map((agent) => ({
    name: agent.agentName,
    value: agent.totalCost,
  }));

  const invocationData = metrics.topAgents.map((agent) => ({
    name: agent.agentName,
    count: agent.invocations,
  }));

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">System Metrics</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchMetrics}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalConversations}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invocations</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalInvocations}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalTokens.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${metrics.totalCost.toFixed(4)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Token Usage Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Token Usage by Agent</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="input" fill="#0ea5e9" name="Input Tokens" />
                <Bar dataKey="output" fill="#8b5cf6" name="Output Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Cost Breakdown by Agent</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(4)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(4)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Invocations Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Invocations by Agent</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={invocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" name="Invocations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Performance Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Latency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calls</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.topAgents.map((agent) => (
                    <tr key={agent.agentName}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{agent.agentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{agent.avgLatencyMs.toFixed(0)}ms</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{agent.invocations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
