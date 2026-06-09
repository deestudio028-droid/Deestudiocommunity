import { motion } from 'framer-motion';

const stats = [
  { label: 'Subscribers', value: '39' },
  { label: 'Community Members', value: '0' },
  { label: 'Projects Built Together', value: '0' },
];

export default function Stats() {
  return (
    <section className="py-20 relative z-10 border-y border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
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
