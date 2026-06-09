import { motion } from 'framer-motion';

export default function LiveStats({ subscribers, membersCount, projectsBuilt, loading }) {
  const stats = [
    { label: 'Subscribers', value: subscribers },
    { label: 'Community Members', value: membersCount },
    { label: 'Projects Built Together', value: projectsBuilt },
  ];

  return (
    <section className="py-12 relative z-10 border-y border-white/5 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass p-8 rounded-2xl text-center border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {loading ? <span className="animate-pulse">...</span> : stat.value}
              </h3>
              <p className="text-white/50 uppercase tracking-widest text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-primary font-medium">Starting from zero.</p>
          <p className="text-white/50 text-sm mt-1">Building together.</p>
        </div>
      </div>
    </section>
  );
}
