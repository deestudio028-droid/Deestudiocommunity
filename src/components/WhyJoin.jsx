import { motion } from 'framer-motion';

const features = [
  {
    icon: "🆔",
    title: "Get Your DS ID",
    description: "Become part of DeeStudio history."
  },
  {
    icon: "📜",
    title: "Be Part Of DeeStudio History",
    description: "Your name can be remembered as one of the earliest members."
  },
  {
    icon: "💡",
    title: "Share Ideas",
    description: "Help shape future projects and experiments."
  },
  {
    icon: "🏆",
    title: "Join Future Challenges",
    description: "Participate in community challenges and events."
  }
];

export default function WhyJoin() {
  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            What Makes This Different?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors flex gap-6 items-start"
            >
              <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
