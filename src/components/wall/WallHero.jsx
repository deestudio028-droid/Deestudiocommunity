import { motion } from 'framer-motion';

export default function WallHero({ memberCount }) {
  return (
    <section className="relative pt-32 pb-16 text-center z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-white/80">{memberCount} Approved Members</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">People Who Built </span>
            <span className="text-gradient glow-purple">DeeStudio</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 font-light">
            Every person on this wall helped shape the journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
