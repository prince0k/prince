import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-aa7l.onrender.com';

const AdminContent = () => {
  const navigate = useNavigate();
  const [aboutContent, setAboutContent] = useState({
    title: '',
    description: '',
    skills: [],
    experience: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const fetchAboutContent = async () => {
    try {
      console.log('Fetching about content...');
      const response = await fetch(`${API_URL}/api/about`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch content');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      
      setAboutContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage({ type: 'error', text: `Failed to load content: ${error.message}` });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(aboutContent),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Content updated successfully!' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update content');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      if (error.message === 'Not authenticated' || error.message === 'Token is invalid or expired') {
        navigate('/admin/login');
      }
    }
    setIsLoading(false);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...aboutContent.skills];
    updatedSkills[index] = value;
    setAboutContent({ ...aboutContent, skills: updatedSkills });
  };

  const addSkill = () => {
    setAboutContent({
      ...aboutContent,
      skills: [...aboutContent.skills, '']
    });
  };

  const removeSkill = (index) => {
    const updatedSkills = aboutContent.skills.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, skills: updatedSkills });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...aboutContent.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setAboutContent({ ...aboutContent, experience: updatedExperience });
  };

  const addExperience = () => {
    setAboutContent({
      ...aboutContent,
      experience: [...aboutContent.experience, { title: '', company: '', period: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const updatedExperience = aboutContent.experience.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, experience: updatedExperience });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Content Management</h1>
        
        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">About Me</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Skills</h2>
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Skill
              </button>
            </div>

            <div className="space-y-3">
              {aboutContent.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Experience</h2>
              <button
                type="button"
                onClick={addExperience}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {aboutContent.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Experience {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContent; 