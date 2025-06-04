import { Sun, Moon } from 'lucide-react';

const Projects = ({ darkMode, setDarkMode }) => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and Tailwind CSS.",
      tags: ["React", "Tailwind CSS", "Responsive Design"],
      link: "#"
    },
    {
      title: "E-commerce Fashion Hub",
      description: "Instagram-based fashion store with custom product showcases.",
      tags: ["Social Media", "Content Strategy", "Fashion"],
      link: "#"
    },
    {
      title: "Todo App with Firebase",
      description: "A task management application with real-time database functionality.",
      tags: ["React", "Firebase", "Authentication"],
      link: "#"
    },
    {
      title: "Blog Platform with CMS",
      description: "Content management system for bloggers with markdown support.",
      tags: ["Node.js", "React", "Markdown"],
      link: "#"
    },
    {
      title: "Agricultural Machinery Research",
      description: "Research project on modern agricultural equipment efficiency.",
      tags: ["Research", "Agriculture", "Data Analysis"],
      link: "#"
    },
    {
      title: "Food Packaging Study",
      description: "Analysis of packaging materials on food shelf life.",
      tags: ["Research", "Food Science", "Packaging"],
      link: "#"
    }
  ];

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
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          My Projects
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span className="text-4xl">📁</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm font-medium"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
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

export default Projects;