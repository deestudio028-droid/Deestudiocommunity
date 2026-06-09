import { motion } from 'framer-motion';
import { generateBadge } from '../../utils/badge';
import { formatJoinDate } from '../../utils/date';

export default function MemberCard({ member, index, onClick }) {
  const badge = generateBadge(index);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(member, badge)}
      className="glass p-6 rounded-2xl cursor-pointer border border-white/10 hover:border-primary/50 group relative overflow-hidden transition-all duration-300 shadow-none hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] text-left flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <span className="text-xl font-mono font-bold text-white tracking-widest">{member.ds_id}</span>
          <span className="text-xs px-2 py-1 rounded-md bg-white/10 text-white/70 border border-white/5 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-lg font-bold text-white mb-1 truncate">{member.full_name}</h3>
          <p className="text-sm text-white/50 mb-4">{member.country}</p>
          <div className="text-xs text-white/30 uppercase tracking-widest">
            Joined {formatJoinDate(member.joined_at)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
