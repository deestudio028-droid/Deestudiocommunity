import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Inbox, BarChart2, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    // Check if token exists in session storage
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('admin_token', password);
        setIsAuthenticated(true);
      } else {
        setError('ACCESS DENIED');
      }
    } catch (err) {
      setError('Connection to secure server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md border border-white/10 bg-black/50 backdrop-blur-xl p-8 rounded-lg shadow-[0_0_50px_rgba(124,58,237,0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <h1 className="text-xl text-primary font-bold mb-8 tracking-widest text-center">SYSTEM_AUTH_REQUIRED</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSCODE..."
                className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-center tracking-widest placeholder:text-white/20"
                autoFocus
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-3 font-bold tracking-[0.2em] uppercase transition-all"
            >
              {loading ? 'AUTHENTICATING...' : 'INITIALIZE'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Applications', path: '/admin/applications', icon: Inbox },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Stats', path: '/admin/stats', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <span className="text-primary font-bold text-xs">DS</span>
            </div>
            <span className="font-bold tracking-widest text-sm text-white/80 uppercase">Control Room</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="p-8 relative z-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
