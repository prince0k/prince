import React, { useState, useEffect, useMemo } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  FolderKanban,
  Newspaper,
  UserCircle,
  MessageSquare,
  LayoutDashboard,
  Settings,
  FileText,
  BarChart2,
  Phone,
  User,
  FileEdit,
  FlameKindlingIcon,
  UserCogIcon,
} from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import './App.css';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import Contactme from './pages/Contactme';
import Projects from './pages/Projects';
import Aboutme from './pages/Aboutme';
import AdminMessages from './pages/AdminMessages';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPosts from './pages/AdminPosts';
import AdminAnalytics from './pages/AdminAnalytics';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminProfile from './pages/AdminProfile';
import AdminContent from './pages/AdminContent';

// Constants for better maintainability
const SOCIAL_LINKS = [
  {
    icon: Github,
    url: "https://github.com/yourusername",
    tooltip: "GitHub"
  },
  {
    icon: Linkedin,
    url: "https://linkedin.com/in/yourprofile",
    tooltip: "LinkedIn"
  },
  {
    icon: Mail,
    url: "mailto:your@email.com",
    tooltip: "Email me"
  }
];

const MAIN_SECTIONS = [
  { path: "/", icon: HomeIcon, section: "about", name: "Home" },
  { path: "/feed", icon: Newspaper, name: "Feed" },
  { path: "/projects", icon: FolderKanban, name: "Projects" },
  { path: "/blog", icon: FileText, name: "Blog" },
  { path: "/aboutme", icon: User, name: "About Me" },
  { path: "/contactme", icon: Phone, section: "contact", name: "Contact" },
  { path: "/admin/dashboard", icon: UserCogIcon, name: "Admin" },
];



const FloatingNavButton = React.memo(({ icon: Icon, onClick, className = "", tooltip }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className={`w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${className}`}
        aria-label={tooltip}
      >
        <Icon className="w-6 h-6 text-gray-700 dark:text-white" />
      </button>
      
      {tooltip && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap"
            >
              {tooltip}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
});

const NavLink = React.memo(({ to, children, onClick, isActive }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link
        to={to}
        onClick={onClick}
        className={`relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700/50"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="navActiveIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400 rounded-r"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
});

const NavigationMenu = React.memo(({ menuOpen, setMenuOpen, location, setActiveSection }) => {
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't render the menu for admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={menuOpen ? { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", damping: 25, stiffness: 500 }
      } : { 
        opacity: 0, 
        scale: 0.95, 
        y: -20,
        transition: { duration: 0.2 }
      }}
      className={`fixed top-16 left-4 bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden z-50
        ${menuOpen ? "p-4 w-64" : "p-0 w-0 h-0"}`}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
        <motion.nav 
          className="flex flex-col space-y-2"
          initial="hidden"
          animate={menuOpen ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.2 }
            },
            hidden: {
              transition: { staggerChildren: 0.05, staggerDirection: -1 }
            }
          }}
        >
          <motion.div
            className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            Main Navigation
          </motion.div>
          
          {MAIN_SECTIONS.map((item) => (
            <motion.div
              key={item.path}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { type: "spring", stiffness: 300 }
                }
              }}
            >
              <NavLink
                to={item.path}
                onClick={() => {
                  setMenuOpen(false);
                  if (item.section && location.pathname === "/") {
                    setActiveSection(item.section);
                  }
                }}
                isActive={location.pathname === item.path}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>
      </div>
    </motion.div>
  );
});

const AnimatedRoute = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AppContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const location = useLocation();

  // Memoize the sections array to prevent unnecessary re-renders
  const sections = useMemo(() => ["about", "projects", "contact"], []);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Default to system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(mediaQuery.matches);
      
      // Listen for system theme changes
      const handler = (e) => setDarkMode(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const navigateTo = (direction) => {
    const currentIndex = sections.indexOf(activeSection);
    if (direction === 'next') {
      setActiveSection(sections[(currentIndex + 1) % sections.length]);
    } else {
      setActiveSection(sections[(currentIndex - 1 + sections.length) % sections.length]);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
        {/* Navigation */}
        <div className="fixed top-4 left-4 z-50">
          <div className="relative">
            <FloatingNavButton
              icon={menuOpen ? X : Menu}
              onClick={() => setMenuOpen(!menuOpen)}
            />
            <AnimatePresence>
              {menuOpen && (
                <NavigationMenu
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  location={location}
                  setActiveSection={setActiveSection}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dark mode toggle */}
        <div className="fixed top-4 right-4 z-50">
          <FloatingNavButton
            icon={darkMode ? Sun : Moon}
            onClick={() => setDarkMode(!darkMode)}
            tooltip={darkMode ? "Light mode" : "Dark mode"}
          />
        </div>

        {/* Social links */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-3">
          {SOCIAL_LINKS.map((link, index) => (
            <FloatingNavButton
              key={index}
              icon={link.icon}
              onClick={() => window.open(link.url, "_blank")}
              tooltip={link.tooltip}
            />
          ))}
        </div>

        {/* Routes */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <AnimatedRoute>
              <Home 
                darkMode={darkMode}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                navigateTo={navigateTo}
                sections={sections}
              />
            </AnimatedRoute>
          } />
          <Route path="/feed" element={
            <AnimatedRoute>
              <GalleryPage darkMode={darkMode} />
            </AnimatedRoute>
          } />
          <Route path="/projects" element={
            <AnimatedRoute>
              <Projects darkMode={darkMode} />
            </AnimatedRoute>
          } />
          <Route path="/aboutme" element={
            <AnimatedRoute>
              <Aboutme darkMode={darkMode} />
            </AnimatedRoute>
          } />
          <Route path="/contactme" element={
            <AnimatedRoute>
              <Contactme darkMode={darkMode} />
            </AnimatedRoute>
          } />
          <Route path="/admin/messages" element={
            <AnimatedRoute>
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            </AnimatedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <AnimatedRoute>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </AnimatedRoute>
          } />
          <Route path="/admin/login" element={
            <AnimatedRoute>
              <AdminLoginPage />
            </AnimatedRoute>
          } />
          <Route path="/admin/posts" element={
            <AnimatedRoute>
              <ProtectedRoute>
                <AdminPosts />
              </ProtectedRoute>
            </AnimatedRoute>
          } />
          <Route path="/admin/analytics" element={
            <AnimatedRoute>
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            </AnimatedRoute>
          } />
          <Route path="/blog" element={
            <AnimatedRoute>
              <Blog />
            </AnimatedRoute>
          } />
          <Route path="/blog/:id" element={
            <AnimatedRoute>
              <BlogPost />
            </AnimatedRoute>
          } />
          <Route path="/admin/profile" element={
            <AnimatedRoute>
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            </AnimatedRoute>
          } />
          <Route path="/admin/content" element={
            <AnimatedRoute>
              <ProtectedRoute>
                <AdminContent />
              </ProtectedRoute>
            </AnimatedRoute>
          } />
          <Route path="*" element={
            <Navigate to="/" />
          } />
        </Routes>

        {/* Background decorative elements */}
        <BackgroundEffects />
      </div>
    </div>
  );
};

const BackgroundEffects = React.memo(() => {
  return (
    <motion.div 
      className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-200 dark:bg-blue-900 opacity-20"
          initial={{
            scale: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
          }}
          animate={{
            scale: 1,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            transition: {
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </motion.div>
  );
});

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}