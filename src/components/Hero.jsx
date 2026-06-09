import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden z-10">
      
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Logo prominently displayed */}
          <motion.img 
            src="/logo.png" 
            alt="DeeStudio Logo" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain mb-8 drop-shadow-[0_0_30px_rgba(124,58,237,0.4)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.8)]"></span>
            <span className="text-sm font-medium text-white/90 tracking-wide">Running On Comments & Hope 🚀</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="block text-white mb-2">People Who Built</span>
            <span className="text-gradient glow-purple">DeeStudio</span>
          </h1>

          <div className="text-xl md:text-3xl text-white/80 font-medium mb-10 leading-relaxed max-w-3xl">
            <p className="mb-2">Before the milestones.</p>
            <p className="mb-2">Before the growth.</p>
            <p className="text-white">Before anyone knew DeeStudio.</p>
          </div>
          
          <div className="text-lg text-white/60 mb-14 max-w-2xl mx-auto space-y-4">
            <p>This community is for the people who believed in DeeStudio from the very beginning.</p>
            <p>Every view, comment, idea and bit of support helped shape this journey.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] w-full sm:w-auto text-lg transition-all"
            >
              Join The Community
            </motion.button>
            
            <Link to="/wall" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl glass hover:bg-white/10 border border-white/20 text-white font-semibold shadow-[0_0_20px_rgba(255,255,255,0.05)] w-full text-lg transition-all"
              >
                View The Wall
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
