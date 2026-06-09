import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="py-40 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Become Part Of The Story
          </h2>
          
          <p className="text-2xl text-white/60 mb-12 font-light">
            The journey is just getting started.
          </p>
          
          <motion.a
            href="https://forms.gle/V58BsJF3HckZvPvk7"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300"
          >
            Claim Your DS ID
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
