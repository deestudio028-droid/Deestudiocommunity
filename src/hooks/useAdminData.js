import { useState, useEffect, useCallback } from 'react';

export function useAdminData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('admin_token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      if (result.success) {
        setData(result.data || result);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export async function adminAction(endpoint, payload) {
  const token = sessionStorage.getItem('admin_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }
  
  if (!result.success) {
    throw new Error(result.message);
  }
  
  return result;
}
