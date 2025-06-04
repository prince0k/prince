import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  MessageCircle,
  Home,
  FolderKanban,
  Image,
  Mail,
  User,
  Phone
} from 'lucide-react';
import Gallery from '../components/Gallery';

const GalleryPage = ({ darkMode, setDarkMode, activeSection, setActiveSection, navigateTo, sections = ["about", "projects", "gallery", "contact"] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');

  // Get icon for section
  const getIconForSection = (section) => {
    switch (section) {
      case 'about':
        return <Home className="w-4 h-4" />;
      case 'projects':
        return <FolderKanban className="w-4 h-4" />;
      case 'gallery':
        return <Image className="w-4 h-4" />;
      case 'contact':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Fetch feed posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts?category=feed');
      if (!response.ok) throw new Error('Failed to fetch feed posts');
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle like
  const handleLike = async (postId) => {
    if (!userEmail) {
      const email = window.prompt('Please enter your email to like this post:');
      if (!email) return;
      setUserEmail(email);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) throw new Error('Failed to like post');
      await fetchPosts();
    } catch (err) {
      setError('Failed to like post. Please try again.');
    }
  };

  // Handle comment submission
  const handleComment = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;

    // Check if we have user information
    if (!userEmail || !userName) {
      setError('Please provide your name and email to comment.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${selectedPost._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          content: comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      // Refresh the posts to get the updated comments
      await fetchPosts();
      
      // Clear the comment form
      setComment('');
      
      // Show success message
      setError(null);
      
      // Optional: Keep the modal open to show the new comment
      // setSelectedPost(null);
    } catch (err) {
      setError(err.message || 'Failed to add comment. Please try again.');
    }
  };

  // Sample gallery data with placeholder images
  const galleryImages = [
    {
      src: 'https://via.placeholder.com/400x300?text=Project+1',
      alt: 'E-commerce Fashion Hub',
      title: 'Fashion E-commerce Platform',
      description: 'Instagram-based fashion store with custom product showcases',
      tags: ['React', 'E-commerce', 'UI Design'],
      date: '2023'
    },
    {
      src: 'https://via.placeholder.com/400x300?text=Project+2',
      alt: 'Portfolio Website',
      title: 'Personal Portfolio',
      description: 'Responsive portfolio built with React and Tailwind CSS',
      tags: ['React', 'Tailwind CSS', 'Responsive'],
      date: '2023'
    },
    {
      src: 'https://via.placeholder.com/400x300?text=Project+3',
      alt: 'Todo App',
      title: 'Task Management App',
      description: 'Todo application with Firebase integration',
      tags: ['React', 'Firebase', 'Authentication'],
      date: '2022'
    },
    {
      src: 'https://via.placeholder.com/400x300?text=Project+4',
      alt: 'Blog Platform',
      title: 'CMS Blog System',
      description: 'Content management system for bloggers',
      tags: ['Node.js', 'React', 'Markdown'],
      date: '2022'
    },
    {
      src: '/images/project5.jpg',
      alt: 'Agricultural Research',
      title: 'Agricultural Machinery Study',
      description: 'Research on modern agricultural equipment',
      tags: ['Research', 'Agriculture', 'Data'],
      date: '2021'
    },
    {
      src: '/images/project6.jpg',
      alt: 'Food Packaging',
      title: 'Food Shelf Life Research',
      description: 'Study of packaging materials on food preservation',
      tags: ['Research', 'Food Science', 'Packaging'],
      date: '2021'
    },
    {
      src: '/images/project7.jpg',
      alt: 'UI Design',
      title: 'Mobile App Interface',
      description: 'Custom mobile application UI design',
      tags: ['UI/UX', 'Figma', 'Mobile'],
      date: '2020'
    },
    {
      src: '/images/project8.jpg',
      alt: 'Brand Identity',
      title: 'Branding Project',
      description: 'Complete brand identity design',
      tags: ['Branding', 'Logo', 'Identity'],
      date: '2020'
    }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Floating theme toggle button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed z-50 bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          darkMode ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-gray-900" />
        ) : (
          <Moon className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Section navigation controls - positioned above the content box */}
      <div className="relative mb-8 pt-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 z-40 flex justify-center items-center space-x-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => navigateTo('prev')}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
            aria-label="Previous section"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`p-2 rounded-full transition-all ${
                  activeSection === section 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md" 
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={section.charAt(0).toUpperCase() + section.slice(1)}
              >
                {getIconForSection(section)}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => navigateTo('next')}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
            aria-label="Next section"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-20">
        <Gallery images={galleryImages} />
      </main>

      {/* Footer */}
      <footer className="py-8 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Your Name. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/" 
                className="hover:text-gray-700 dark:hover:text-white transition-colors p-2 relative group"
                title="Home"
              >
                <Home className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Home
                </span>
              </Link>
              <Link 
                to="/aboutme" 
                className="hover:text-gray-700 dark:hover:text-white transition-colors p-2 relative group"
                title="About"
              >
                <User className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  About
                </span>
              </Link>
              <Link 
                to="/projects" 
                className="hover:text-gray-700 dark:hover:text-white transition-colors p-2 relative group"
                title="Projects"
              >
                <FolderKanban className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Projects
                </span>
              </Link>
              <Link 
                to="/contactme" 
                className="hover:text-gray-700 dark:hover:text-white transition-colors p-2 relative group"
                title="Contact"
              >
                <Phone className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Contact
                </span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GalleryPage;