import { motion } from 'framer-motion';

export default function Story() {
  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 flex items-center gap-4">
              <span className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
              The Story
            </h2>
            
            <div className="space-y-8 text-xl md:text-2xl text-white/70 font-light leading-relaxed">
              <p>Hi, I'm Deepak.</p>
              
              <p>
                I started DeeStudio to build apps, games and AI projects in public while sharing the entire journey online.
              </p>
              
              <p className="text-white/90 font-medium">
                This community isn't about being early to a product.
              </p>
              
              <p className="text-gradient font-semibold">
                It's about being early to a dream.
              </p>
              
              <p>
                Today it's a small community.<br/>
                Tomorrow, who knows?
              </p>
              
              <p>
                One day DeeStudio may become something much bigger.
              </p>
              
              <p className="text-white">
                But the people who were here at the beginning will always be remembered.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
