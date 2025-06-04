import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-aa7l.onrender.com';

export const useAboutContent = () => {
  const [content, setContent] = useState({
    title: 'Loading...',
    description: 'Loading...',
    skills: [],
    experience: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutContent = async () => {
    try {
      console.log('Fetching about content from:', `${API_URL}/api/about`);
      const response = await fetch(`${API_URL}/api/about`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Received data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch content');
      }

      if (!data) {
        throw new Error('No data received');
      }

      setContent(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setError(error.message);
      setContent({
        title: 'Error loading content',
        description: 'Please try again later.',
        skills: [],
        experience: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  return { content, isLoading, error, refetch: fetchAboutContent };
}; 