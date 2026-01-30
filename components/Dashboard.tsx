import { Users, FlaskConical, Calendar, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  const [paymentPeriod, setPaymentPeriod] = useState('week');

  const stats = [
    { label: 'Active Studies', value: '24', change: '+12%', trend: 'up', icon: FlaskConical, color: 'blue' },
    { label: 'Total Participants', value: '1,845', change: '+8%', trend: 'up', icon: Users, color: 'green' },
    { label: 'Visits Today', value: '89', change: '-5%', trend: 'down', icon: Calendar, color: 'orange' },
    { label: 'Active Enrollments', value: '156', change: '+15%', trend: 'up', icon: Activity, color: 'purple' },
  ];

  const recentPaymentsData = [
    { date: 'Jan 1', amount: 1250 },
    { date: 'Jan 2', amount: 2100 },
    { date: 'Jan 3', amount: 1875 },
    { date: 'Jan 4', amount: 2450 },
    { date: 'Jan 5', amount: 1950 },
  ];

  const paymentsByTypeWeek = [
    { name: 'Travel', value: 3200, color: '#3b82f6' },
    { name: 'Stipend', value: 2800, color: '#10b981' },
    { name: 'Parking', value: 850, color: '#f59e0b' },
    { name: 'Meal', value: 650, color: '#8b5cf6' },
    { name: 'Other', value: 450, color: '#6b7280' },
  ];

  const paymentsByTypeMonth = [
    { name: 'Travel', value: 12500, color: '#3b82f6' },
    { name: 'Stipend', value: 15200, color: '#10b981' },
    { name: 'Parking', value: 3400, color: '#f59e0b' },
    { name: 'Meal', value: 2100, color: '#8b5cf6' },
    { name: 'Other', value: 1800, color: '#6b7280' },
  ];

  const paymentsByTypeQuarter = [
    { name: 'Travel', value: 38000, color: '#3b82f6' },
    { name: 'Stipend', value: 45000, color: '#10b981' },
    { name: 'Parking', value: 9800, color: '#f59e0b' },
    { name: 'Meal', value: 6200, color: '#8b5cf6' },
    { name: 'Other', value: 5000, color: '#6b7280' },
  ];

  const getPaymentData = () => {
    switch (paymentPeriod) {
      case 'week':
        return paymentsByTypeWeek;
      case 'month':
        return paymentsByTypeMonth;
      case 'quarter':
        return paymentsByTypeQuarter;
      default:
        return paymentsByTypeWeek;
    }
  };

  const recentParticipants = [
    { id: 1, name: 'John Smith', participantId: 'P-2026-001', study: 'CHS-2026-001', enrollDate: '2026-01-02', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', participantId: 'P-2025-156', study: 'NDR-2025-042', enrollDate: '2025-12-28', status: 'Active' },
    { id: 3, name: 'Michael Brown', participantId: 'P-2026-045', study: 'DPT-2025-019', enrollDate: '2026-01-03', status: 'Active' },
    { id: 4, name: 'Emily Davis', participantId: 'P-2026-089', study: 'PNS-2026-008', enrollDate: '2026-01-05', status: 'Screening' },
    { id: 5, name: 'Robert Wilson', participantId: 'P-2025-234', study: 'CIS-2025-055', enrollDate: '2025-12-15', status: 'Active' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications Demo */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 border border-blue-200">
        <h3 className="text-lg mb-3">Toast Notifications Demo</h3>
        <p className="text-sm text-gray-600 mb-4">Click the buttons below to see different notification types:</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => toast.success('Operation completed successfully!', {
              description: 'Your changes have been saved.'
            })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Success Message
          </button>
          <button
            onClick={() => toast.error('Operation failed', {
              description: 'Please check all required fields and try again.'
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Error Message
          </button>
          <button
            onClick={() => toast.info('Important information', {
              description: 'You have 3 pending payment requests to review.'
            })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Info Message
          </button>
          <button
            onClick={() => toast.warning('Action required', {
              description: 'Please review the conflicting schedules.'
            })}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Warning Message
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts (Stacked) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Payments Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="mb-4">Recent Payments</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentPaymentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payments by Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Payments by Type</h2>
              <select
                value={paymentPeriod}
                onChange={(e) => setPaymentPeriod(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPaymentData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPaymentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - KPIs */}
        <div className="space-y-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : AlertCircle;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorMap[stat.color]} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon size={16} />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Participants Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2>Recent Participants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Participant ID</th>
                <th className="px-6 py-3 text-left text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-gray-600">Study</th>
                <th className="px-6 py-3 text-left text-gray-600">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{participant.participantId}</td>
                  <td className="px-6 py-4">{participant.name}</td>
                  <td className="px-6 py-4">{participant.study}</td>
                  <td className="px-6 py-4">{participant.enrollDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${participant.status === 'Active' ? 'bg-green-100 text-green-800' :
                      participant.status === 'Screening' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {participant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}