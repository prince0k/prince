import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, MessageSquare, Tag } from 'lucide-react';

const API_URL = 'https://portfolio-backend-aa7l.onrender.com';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      setPost(data);
      setError(null);
    } catch (err) {
      setError('Failed to load post');
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-red-600 dark:text-red-400 text-center mb-4">
          {error || 'Post not found'}
        </div>
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with cover image */}
      {post.imageUrl && (
        <div className="w-full h-96 relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-32 relative"
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-8 flex items-center text-white hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blog
        </button>

        {/* Post content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {post.tags.join(', ')}
              </span>
            )}
          </div>

          <div className="mt-8 prose prose-lg dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogPost; 