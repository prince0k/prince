import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  MessageSquare,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

// Mock data for charts - Replace with actual data from your analytics service
const mockData = {
  pageViews: [
    { date: '2024-01', views: 1200 },
    { date: '2024-02', views: 1800 },
    { date: '2024-03', views: 2200 },
    { date: '2024-04', views: 2800 },
    { date: '2024-05', views: 3200 },
    { date: '2024-06', views: 3800 },
  ],
  devices: [
    { name: 'Desktop', value: 65, icon: Monitor },
    { name: 'Mobile', value: 25, icon: Smartphone },
    { name: 'Tablet', value: 10, icon: Tablet },
  ],
  topPages: [
    { path: '/', views: 1200, title: 'Home' },
    { path: '/blog', views: 800, title: 'Blog' },
    { path: '/projects', views: 600, title: 'Projects' },
    { path: '/about', views: 400, title: 'About' },
    { path: '/contact', views: 300, title: 'Contact' },
  ],
};

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
    {change && (
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span
          className={`text-sm ml-1 ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change}% from last month
        </span>
      </div>
    )}
  </motion.div>
);

const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.views));
  const points = data
    .map((d, i) => [
      (i * 100) / (data.length - 1),
      100 - (d.views * 100) / maxValue,
    ])
    .map((p) => p.join(','))
    .join(' ');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Views</h3>
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          {data.map((d) => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const DeviceChart = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Usage</h3>
    <div className="space-y-4">
      {data.map(({ name, value, icon: Icon }) => (
        <div key={name} className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{value}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopPages = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
    <div className="space-y-4">
      {data.map(({ path, views, title }) => (
        <div
          key={path}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{path}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Eye className="h-4 w-4 mr-1" />
            {views.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnalyticsData(mockData);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monitor your website's performance and user engagement
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Visitors"
            value="12,345"
            change="12"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Page Views"
            value="45,678"
            change="8"
            icon={Eye}
            trend="up"
          />
          <StatCard
            title="Messages"
            value="89"
            change="5"
            icon={MessageSquare}
            trend="down"
          />
          <StatCard
            title="Blog Posts"
            value="34"
            change="15"
            icon={FileText}
            trend="up"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart data={analyticsData.pageViews} />
          <DeviceChart data={analyticsData.devices} />
        </div>

        {/* Top Pages */}
        <TopPages data={analyticsData.topPages} />
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics; 