export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 text-center bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <img src="/logo.png" alt="DeeStudio" className="w-16 h-16 object-contain mb-8 opacity-50 hover:opacity-100 transition-opacity" />
        
        <div className="space-y-2 text-white/50 mb-10 font-medium">
          <p>One day this page may have thousands of names.
But only a few people can say they were here first.</p>
        </div>
        
        <div className="space-y-2 text-white/40 text-sm mb-12">
          <p>Started with 0 subscribers.<br/>Built with belief.</p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
          <span className="text-xs text-white/60">Running On Comments & Hope 🚀</span>
        </div>
      </div>
    </footer>
  );
}
