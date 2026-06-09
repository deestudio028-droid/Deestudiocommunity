import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Award, Sparkles } from 'lucide-react';
import { formatJoinDate } from '../utils/date';
import Navbar from '../components/Navbar';

export default function Community() {
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('communityMember');
    if (stored) {
      setMember(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('communityMember');
    navigate('/');
  };

  if (!member) return null; // CommunityRoute handles the redirect

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans overflow-hidden">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50 mix-blend-screen" />
      <div className="fixed bottom-0 left-0 w-[50vw] h-[50vw] bg-secondary/20 rounded-full blur-[150px] pointer-events-none opacity-50 mix-blend-screen" />

      <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-32">
        <div className="max-w-4xl w-full mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Welcome To The <span className="text-gradient glow-purple">DeeStudio Community</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              This is where builders, dreamers and supporters shape the future together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass rounded-3xl p-1 lg:p-12 border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 lg:p-0">
              
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/20 shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-center relative group">
                {member.profile_image_url ? (
                  <img 
                    src={member.profile_image_url} 
                    alt={member.full_name} 
                    className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white/50">{member.full_name.charAt(0)}</span>
                )}
                <div className="absolute -bottom-3 -right-3 bg-black border border-white/20 rounded-full p-2 text-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                  <Award size={20} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{member.full_name}</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary text-xs font-bold tracking-widest font-mono shadow-[0_0_10px_rgba(124,58,237,0.3)] mx-auto md:mx-0">
                    <Sparkles size={12} />
                    {member.ds_id}
                  </span>
                </div>
                
                <p className="text-white/40 text-sm tracking-widest uppercase font-mono mb-8">
                  Joined • {formatJoinDate(member.joined_at)}
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                  <p className="text-white/80 italic font-light leading-relaxed">
                    "Thank you for believing in DeeStudio. Every piece of this platform, every line of code, and every future milestone belongs to this community. The journey is just beginning."
                  </p>
                  <p className="mt-4 text-primary font-bold text-sm tracking-widest uppercase">
                    — Deepak, Founder
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors font-mono tracking-widest uppercase text-sm border border-transparent hover:border-red-500/30 bg-transparent hover:bg-red-500/10 px-6 py-3 rounded-full"
            >
              <LogOut size={16} />
              Leave Community
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
