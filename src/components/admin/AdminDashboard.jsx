import { useAdminData } from '../../hooks/useAdminData';
import { Users, Inbox, XCircle, Activity, Play } from 'lucide-react';
import { formatJoinDate } from '../../utils/date';

export default function AdminDashboard() {
  const { data: stats, loading: statsLoading } = useAdminData('/api/admin/dashboard-stats');
  const { data: logs, loading: logsLoading } = useAdminData('/api/admin/activity-logs');

  if (statsLoading || logsLoading) {
    return <div className="text-primary font-mono animate-pulse">LOADING_DATA...</div>;
  }

  const statCards = [
    { label: 'Pending Applications', value: stats?.pendingApplications || 0, icon: Inbox, color: 'text-yellow-400' },
    { label: 'Approved Members', value: stats?.approvedMembers || 0, icon: Users, color: 'text-primary' },
    { label: 'Projects Built', value: stats?.projectsBuilt || 0, icon: Play, color: 'text-blue-400' },
    { label: 'Live Subscribers', value: stats?.liveSubscribers || 0, icon: Activity, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Overview</h1>
        <p className="text-white/50">DeeStudio Community Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={100} />
              </div>
              <Icon size={24} className={`mb-4 ${stat.color}`} />
              <div className="text-3xl font-bold font-mono tracking-widest mb-1">{stat.value}</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Live Activity Feed
              </h2>
            </div>
            <div className="p-0">
              {logs && logs.length > 0 ? (
                <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                  {logs.map(log => (
                    <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-white/5 transition-colors">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
                      <div>
                        <p className="font-medium">
                          {log.action}: <span className="text-primary">{log.target_name}</span>
                        </p>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-mono">
                          {formatJoinDate(log.created_at)} • by {log.performed_by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-white/30 italic">No activity logged yet.</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="glass p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="font-bold text-lg mb-4 text-primary">System Status</h3>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between items-center">
                <span className="text-white/50">Database</span>
                <span className="text-green-400 font-bold tracking-widest">ONLINE</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-white/50">Realtime Services</span>
                <span className="text-green-400 font-bold tracking-widest">ONLINE</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-white/50">YouTube API</span>
                <span className="text-green-400 font-bold tracking-widest">ONLINE</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-white/50">Admin Proxy</span>
                <span className="text-green-400 font-bold tracking-widest">SECURE</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
