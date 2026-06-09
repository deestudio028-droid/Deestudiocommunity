import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function CommunityRoute() {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      const storedData = localStorage.getItem('communityMember');
      
      if (!storedData) {
        setIsAuthorized(false);
        return;
      }

      try {
        const member = JSON.parse(storedData);
        
        // Validate against Supabase to ensure they weren't deleted or unapproved
        const { data, error } = await supabase
          .from('community_members')
          .select('id, approved')
          .eq('ds_id', member.ds_id)
          .single();

        if (error || !data || !data.approved) {
          throw new Error('Member invalid or not approved');
        }

        setIsAuthorized(true);
      } catch (err) {
        // If anything fails, wipe the session and reject
        console.error('Session validation failed:', err);
        localStorage.removeItem('communityMember');
        setIsAuthorized(false);
      }
    };

    validateSession();
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono text-primary">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        <p className="tracking-widest animate-pulse">VALIDATING_DS_ID...</p>
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
}
