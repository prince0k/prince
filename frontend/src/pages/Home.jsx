import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import config from '../config';
import io from 'socket.io-client';
import { useAboutContent } from '../hooks/useAboutContent';

const Home = ({ darkMode, setDarkMode, activeSection, setActiveSection, navigateTo, sections }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    bio: '',
    profileImage: '/your-photo.jpg',
    socialLinks: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      email: 'john.doe@example.com'
    },
    homePageContent: {
      title: 'Full Stack Developer',
      subtitle: 'Creating modern web applications',
      description: 'Welcome to my portfolio'
    }
  });
  const [isHovering, setIsHovering] = useState(false);

  const { content: aboutContent, isLoading: aboutLoading } = useAboutContent();

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile from:', `${config.apiUrl}/profile`);
      const response = await fetch(`${config.apiUrl}/profile`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`);
      
      const data = await response.json();
      console.log('Fetched profile data:', data);
      
      // More robust merging
      setProfile(prev => ({
        ...prev,
        name: data.name || prev.name,
        bio: data.bio || prev.bio,
        profileImage: data.profileImage || prev.profileImage,
        socialLinks: {
          ...prev.socialLinks,
          ...data.socialLinks
        },
        homePageContent: {
          ...prev.homePageContent,
          ...data.homePageContent
        }
      }));
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProfile();

    // Set up WebSocket connection
    const socket = io(config.apiUrl.replace('/api', ''));

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('profileUpdated', (updatedProfile) => {
      console.log('Received profile update:', updatedProfile);
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updatedProfile,
        homePageContent: {
          ...prevProfile.homePageContent,
          ...updatedProfile.homePageContent
        }
      }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

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

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Hero section */}
        <header className="mb-20">
          <div className={`relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto overflow-hidden transition-all duration-500 hover:shadow-3xl ${
            isHovering ? 'scale-[1.01]' : ''
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
            {/* Animated background elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-70 animate-float"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl opacity-70 animate-float-delay"></div>
            
            <div className="text-left mb-8 md:mb-0 relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-text">
                Hi, I'm {profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6">
                <span className="inline-block">
                  {profile.homePageContent?.title || 'designer'}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg text-lg leading-relaxed">
                {profile.homePageContent?.description || 'Welcome to my portfolio'}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  to="/projects" 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center"
                >
                  View Projects
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
                <Link 
                  to="/contactme" 
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center"
                  onClick={() => setActiveSection('contact')}
                >
                  Contact Me
                  <Mail className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
              <img
                src={profile.profileImage || '/your-photo.jpg'}
                alt="Your Profile"
                className="relative w-64 h-80 md:w-80 md:h-96 object-cover border-4 border-white dark:border-gray-700 rounded-lg shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1"
              />
            </div>
          </div>
        </header>

        {/* Section navigation controls */}
        {/* Section navigation controls - positioned above the content box */}
<div className="relative mb-8">
  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-40 flex justify-center items-center space-x-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
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
          className={`px-3 py-1 rounded-full transition-all text-xs font-medium ${
            activeSection === section 
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md" 
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
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

        {/* Single section display */}
        <div className="max-w-4xl mx-auto">
          {activeSection === "about" && (
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4 shadow-inner">
                  <span className="text-2xl animate-wiggle">👋</span>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {aboutContent.title || 'About Me'}
                </h2>
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                {aboutContent.description}
              </div>
              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-lg">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {aboutContent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link 
                  to="/aboutme" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  More about me
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4 shadow-inner">
                  <span className="text-2xl animate-bounce">🚀</span>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  Featured Projects
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { name: "Portfolio Website", tech: "React, Tailwind", status: "Live" },
                  { name: "Todo App with Firebase", tech: "React, Firebase", status: "Live" },
                  { name: "Blog Platform with CMS", tech: "Node.js, MongoDB", status: "In Development" },
                  { name: "E-commerce Fashion Hub", tech: "Next.js, Stripe", status: "Coming Soon" }
                ].map((project, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
                  >
                    <h3 className="font-medium text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{project.tech}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Live' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        project.status === 'In Development' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {project.status}
                      </span>
                      <Link 
                        to="/projects" 
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link 
                  to="/projects" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  View All Projects
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          )}

          {activeSection === "contact" && (
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4 shadow-inner">
                  <span className="text-2xl animate-pulse">📩</span>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
                  Get In Touch
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                Interested in working together or have questions? Feel free to
                reach out through any of these channels:
              </p>
              <div className="flex justify-center space-x-6 mb-10">
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="GitHub profile"
                >
                  <Github className="w-7 h-7 text-gray-700 dark:text-white" />
                </a>
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                </a>
                <a
                  href={`mailto:${profile.socialLinks.email}`}
                  className="w-14 h-14 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="Send email"
                >
                  <Mail className="w-7 h-7 text-red-600 dark:text-red-300" />
                </a>
              </div>
              <div className="text-center">
                <Link 
                  to="/contactme" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Contact Form
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/" className="hover:text-gray-700 dark:hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link to="/aboutme" className="hover:text-gray-700 dark:hover:text-white transition-colors font-medium">
                About
              </Link>
              <Link to="/projects" className="hover:text-gray-700 dark:hover:text-white transition-colors font-medium">
                Projects
              </Link>
              <Link to="/contactme" className="hover:text-gray-700 dark:hover:text-white transition-colors font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Add global animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0.9; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }
        .animate-text {
          animation: text 8s ease infinite;
          background-size: 200% 200%;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;