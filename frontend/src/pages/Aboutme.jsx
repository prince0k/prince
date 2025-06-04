import React from 'react';
import { Github, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { useAboutContent } from '../hooks/useAboutContent';

const Aboutme = ({ darkMode, setDarkMode }) => {
  const { content, isLoading, error } = useAboutContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading content: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 hover:scale-110"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <img
                  src="/your-photo.jpg"
                  alt="Profile"
                  className="relative w-48 h-48 object-cover border-4 border-white dark:border-gray-700 rounded-full shadow-lg transform group-hover:-translate-y-2 transition duration-300 mx-auto"
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              <div className="text-gray-600 dark:text-gray-300 mb-4 prose dark:prose-invert">
                {content.description}
              </div>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  <Github className="w-5 h-5 text-gray-700 dark:text-white" />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </a>
                <a
                  href="mailto:your@email.com"
                  className="w-10 h-10 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-300"
                >
                  <Mail className="w-5 h-5 text-red-600 dark:text-red-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 mb-8">
          <h2 className="text-2xl font-bold mb-6">My Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {content.skills.map((skill) => (
              <div 
                key={skill}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-gray-700 dark:text-gray-300">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <div className="space-y-6">
            {content.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{exp.company} • {exp.period}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Aboutme;