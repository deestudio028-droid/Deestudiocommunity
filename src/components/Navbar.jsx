import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="DeeStudio" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">DeeStudio</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <Link to="/wall" className="text-white/60 hover:text-white font-medium transition-colors hidden sm:block">
            The Wall
          </Link>
          <a href="https://forms.gle/V58BsJF3HckZvPvk7" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full hover:bg-white/5">
            Claim Your DS ID
          </a>
        </motion.div>
      </div>
    </nav>
  );
}
