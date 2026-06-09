import { Search } from 'lucide-react';

export default function MemberSearch({ searchQuery, setSearchQuery }) {
  return (
    <section className="py-12 z-10 relative">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all backdrop-blur-md"
            placeholder="Search by Name or DS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
