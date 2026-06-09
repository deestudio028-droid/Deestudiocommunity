import { useState, useEffect } from 'react';
import { useAdminData, adminAction } from '../../hooks/useAdminData';
import { Save, Play } from 'lucide-react';

export default function AdminStats() {
  const { data: statsData, loading, refetch } = useAdminData('/api/admin/dashboard-stats');
  const [projectsBuilt, setProjectsBuilt] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (statsData?.projectsBuilt !== undefined) {
      setProjectsBuilt(statsData.projectsBuilt.toString());
    }
  }, [statsData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      await adminAction('/api/admin/update-projects', { count: projectsBuilt });
      setMessage('Stats updated successfully. Live site has been updated instantly via Realtime.');
      refetch();
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading) return <div className="text-primary font-mono animate-pulse">FETCHING_STATS...</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Project Statistics</h1>
        <p className="text-white/50">Update the live metrics shown on the Homepage and Wall page.</p>
      </div>

      <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-5">
          <Play size={200} />
        </div>
        
        <form onSubmit={handleSave} className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-white/80 uppercase tracking-widest mb-2">
              Projects Built Together
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                min="0"
                value={projectsBuilt}
                onChange={(e) => setProjectsBuilt(e.target.value)}
                className="w-full max-w-xs bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-2xl font-mono text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
            <p className="text-white/40 text-sm mt-3">
              This number represents the total number of apps, games, and projects the DeeStudio community has built together.
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${message.startsWith('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
      
      <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
        <h3 className="font-bold text-white mb-2">Automated Stats</h3>
        <p className="text-white/50 text-sm mb-4">The following stats are calculated automatically and cannot be manually overridden here:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-white/60">Community Members</span>
            <span className="font-mono text-primary font-bold">{statsData?.approvedMembers}</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-white/60">YouTube Subscribers</span>
            <span className="font-mono text-primary font-bold">{statsData?.liveSubscribers}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
