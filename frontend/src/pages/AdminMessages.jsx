import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Star,
  Trash2,
  Reply,
  Clock,
  User,
  Send,
  X,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const API_URL = 'https://portfolio-backend-aa7l.onrender.com';

// Mock data for testing
const mockMessages = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    message: "Hi, I'm interested in collaborating on a project.",
    createdAt: "2024-03-15T10:30:00Z",
    starred: true,
    read: false
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    message: "Your portfolio is impressive! Would love to discuss a potential opportunity.",
    createdAt: "2024-03-14T15:45:00Z",
    starred: false,
    read: true
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    message: "Great work on your recent projects. Let's connect!",
    createdAt: "2024-03-13T09:20:00Z",
    starred: false,
    read: false
  }
];

const ReplyForm = ({ message, onSubmit, onCancel }) => {
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(reply);
      setReply('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reply to {message.name}
        </label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="Type your reply..."
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

const MessageCard = ({ message, onReply, onDelete, onToggleStar }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = async (replyText) => {
    await onReply(message.id, replyText);
    setShowReplyForm(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {message.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleStar(message.id)}
              className={`p-2 rounded-lg transition-colors ${
                message.starred
                  ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Star className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(message.id)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-800 dark:text-gray-200">{message.message}</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(message.createdAt).toLocaleString()}
          </div>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </button>
        </div>

        <AnimatePresence>
          {showReplyForm && (
            <ReplyForm
              message={message}
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, starred, unread
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.data || data); // Handle both response formats
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (messageId, replyText) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyText }),
      });
      
      if (!response.ok) throw new Error('Failed to send reply');
      await fetchMessages(); // Refresh messages after reply
      setError(null);
    } catch (err) {
      setError('Failed to send reply');
      console.error('Error sending reply:', err);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete message');
      await fetchMessages(); // Refresh messages after deletion
      setError(null);
    } catch (err) {
      setError('Failed to delete message');
      console.error('Error deleting message:', err);
    }
  };

  const handleToggleStar = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${messageId}/star`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to update message');
      await fetchMessages(); // Refresh messages after starring
      setError(null);
    } catch (err) {
      setError('Failed to update message');
      console.error('Error updating message:', err);
    }
  };

  const filteredMessages = messages
    .filter((message) => {
      if (filter === 'starred') return message.starred;
      if (filter === 'unread') return !message.read;
      return true;
    })
    .filter((message) =>
      searchTerm
        ? message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage and respond to contact form messages
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="starred">Starred</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onReply={handleReply}
                  onDelete={handleDelete}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages; 