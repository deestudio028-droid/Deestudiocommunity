import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function DSIDModal({ isOpen, onClose }) {
  const [dsId, setDsId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccess = async (e) => {
    e.preventDefault();
    const cleanId = dsId.trim().toUpperCase();
    
    if (!cleanId) {
      setError('Please enter a valid DS ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: sbError } = await supabase
        .from('community_members')
        .select('*')
        .eq('ds_id', cleanId)
        .eq('approved', true)
        .single();

      if (sbError || !data) {
        throw new Error('Invalid DS ID. Please check and try again.');
      }

      // Success! Store session
      localStorage.setItem('communityMember', JSON.stringify(data));
      
      // Close modal and redirect
      onClose();
      navigate('/community');
    } catch (err) {
      setError(err.message || 'Invalid DS ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formUrl = import.meta.env.VITE_GOOGLE_FORM_URL || 'https://forms.gle/V58BsJF3HckZvPvk7';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-black/90 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] mx-auto">
                <Lock size={24} />
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">Enter Your DS ID</h2>
              <p className="text-white/50 text-center text-sm mb-8">
                Exclusive access for approved community builders.
              </p>

              <form onSubmit={handleAccess} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={dsId}
                    onChange={(e) => setDsId(e.target.value)}
                    placeholder="DS-001"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-center tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20 uppercase"
                    autoFocus
                  />
                  
                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-400 text-sm text-center mt-3 font-medium drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-bold tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        ACCESS COMMUNITY
                      </>
                    )}
                  </button>
                  
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center glass hover:bg-white/10 text-white/80 rounded-xl py-4 font-bold tracking-widest transition-all text-sm border border-white/10"
                  >
                    CLAIM DS ID
                  </a>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
