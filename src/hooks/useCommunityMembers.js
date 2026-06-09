import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCommunityMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('community_members')
          .select('*')
          .eq('approved', true)
          .order('joined_at', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:community_members')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_members' },
        (payload) => {
          // Re-fetch to ensure correct ordering and filtering
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { members, loading, error };
}
