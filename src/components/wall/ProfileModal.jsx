import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatJoinDate } from '../../utils/date';

export default function ProfileModal({ isOpen, onClose, member, badge }) {
  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-auto"
          >
            <div className="glass p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(124,58,237,0.2)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>

              <div className="text-center mt-6 relative z-10">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                  <span className="text-3xl">👤</span>
                </div>
                
                <h2 className="text-sm text-primary font-mono font-bold tracking-widest mb-2">{member.ds_id}</h2>
                <h3 className="text-3xl font-bold text-white mb-1">{member.full_name}</h3>
                <p className="text-white/60 mb-6">{member.country}</p>
                
                <div className="inline-block px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary-light font-medium tracking-wide mb-8 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                  {badge}
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs text-white/40 uppercase tracking-widest">Supporter Since</p>
                  <p className="text-lg text-white/80 font-medium">{formatJoinDate(member.joined_at)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
