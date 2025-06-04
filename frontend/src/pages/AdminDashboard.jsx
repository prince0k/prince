import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Eye,
  ThumbsUp,
  ArrowUp,
  ArrowDown,
  Mail,
  FileText,
  BarChart2,
  User,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
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
        {changeType === 'increase' ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm ml-1 ${
          changeType === 'increase' ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}% from last month
        </span>
      </div>
    )}
  </motion.div>
);

const RecentActivity = ({ activities }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div className="h-8 w-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <activity.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const QuickActions = ({ actions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="h-8 w-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <action.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
        </button>
      ))}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: 'Total Visitors',
      value: '2,847',
      icon: Eye,
      change: '12',
      changeType: 'increase',
    },
    {
      title: 'New Messages',
      value: '24',
      icon: MessageSquare,
      change: '8',
      changeType: 'increase',
    },
    {
      title: 'Blog Posts',
      value: '15',
      icon: FileText,
      change: '5',
      changeType: 'increase',
    },
    {
      title: 'Engagement Rate',
      value: '64%',
      icon: ThumbsUp,
      change: '3',
      changeType: 'decrease',
    },
  ];

  const recentActivities = [
    {
      icon: Mail,
      title: 'New contact message received',
      time: '5 minutes ago',
    },
    {
      icon: Eye,
      title: 'Portfolio viewed by 23 new visitors',
      time: '1 hour ago',
    },
    {
      icon: FileText,
      title: 'New blog post published',
      time: '2 hours ago',
    },
    {
      icon: ThumbsUp,
      title: 'Received 5 new project inquiries',
      time: '4 hours ago',
    },
  ];

  const quickActions = [
    {
      title: 'Update Profile',
      icon: User,
      onClick: () => navigate('/admin/profile'),
    },
    {
      title: 'New Blog Post',
      icon: FileText,
      onClick: () => navigate('/admin/posts/new'),
    },
    {
      title: 'View Analytics',
      icon: BarChart2,
      onClick: () => navigate('/admin/analytics'),
    },
    {
      title: 'Check Messages',
      icon: Mail,
      onClick: () => navigate('/admin/messages'),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monitor your website's performance and manage content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={recentActivities} />
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 