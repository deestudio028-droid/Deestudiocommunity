import { motion } from 'framer-motion';

export default function WallCTA() {
  return (
    <section className="py-32 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Become Part Of The Story
          </h2>
          
          <div className="text-xl text-white/60 mb-12 font-light space-y-2">
            <p>One day this wall may contain thousands of names.</p>
            <p className="text-white/80 font-medium">Only a few can say they were here from the beginning.</p>
          </div>
          
          <a
            href="https://forms.gle/V58BsJF3HckZvPvk7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Claim Your DS ID
          </a>
        </motion.div>
      </div>
    </section>
  );
}
