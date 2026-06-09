import { motion } from 'framer-motion';
import { useSubscribers } from '../hooks/useSubscribers';
import { useCommunityMembers } from '../hooks/useCommunityMembers';
import { useCommunityStats } from '../hooks/useCommunityStats';

export default function Stats() {
  const { subscribers, loading: subsLoading } = useSubscribers();
  const { members, loading: membersLoading } = useCommunityMembers();
  const { stats, loading: statsLoading } = useCommunityStats();

  const displayStats = [
    { label: 'Subscribers', value: subsLoading ? '...' : subscribers },
    { label: 'Community Members', value: membersLoading ? '...' : members.length },
    { label: 'Projects Built Together', value: statsLoading ? '...' : (stats?.projects_built || 0) },
  ];

  return (
    <section className="py-20 relative z-10 border-y border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="text-center flex flex-col items-center"
            >
              <h3 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {stat.value}
              </h3>
              <p className="text-white/60 font-medium tracking-widest uppercase text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-16"
        >
          <p className="text-primary font-medium tracking-wide">Starting from zero.</p>
          <p className="text-white/50">Building together.</p>
        </motion.div>
      </div>
    </section>
  );
}
