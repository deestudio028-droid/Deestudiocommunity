import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const members = [
  { id: 'DS-001', status: 'Waiting For Its Owner' },
  { id: 'DS-002', status: 'Waiting For Its Owner' },
  { id: 'DS-003', status: 'Waiting For Its Owner' },
  { id: 'DS-004', status: 'Waiting For Its Owner' },
];

export default function WallPreview() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            People Who Built DeeStudio
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            The first members will become part of DeeStudio history.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 rounded-2xl w-full sm:w-64 bg-white/[0.02] border border-white/10 hover:border-white/30 transition-all group"
            >
              <div className="text-center">
                <h4 className="text-2xl font-bold text-white mb-3 font-mono tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{member.id}</h4>
                <p className="text-sm text-white/40 group-hover:text-white/70 transition-colors">{member.status}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Link to="/wall">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all text-lg"
          >
            Claim Your DS ID
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
