import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCommunityStats() {
  const [stats, setStats] = useState({ projects_built: 0, community_challenges: 0, ideas_submitted: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('community_stats')
          .select('*');

        if (error) throw error;
        
        if (data) {
          const statsMap = {};
          data.forEach(item => {
            statsMap[item.key] = item.value;
          });
          setStats(prev => ({ ...prev, ...statsMap }));
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Realtime changes for stats
    const channel = supabase
      .channel('public:community_stats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_stats' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading, error };
}
