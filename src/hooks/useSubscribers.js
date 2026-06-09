import { useState, useEffect } from 'react';

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch from the configured backend endpoint
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/subscribers`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // 2. Parse JSON safely
        const data = await response.json();
        
        // 3. Update state. The backend guarantees { count: number, error?: boolean }
        setSubscribers(data.count);
        
        if (data.error) {
          console.warn('Backend encountered an error but returned cached count:', data.count);
        }
      } catch (err) {
        // 4. Fallback if the fetch fails completely (no console errors as requested, just silent fallback)
        setSubscribers(39);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return { subscribers, loading, error };
}
