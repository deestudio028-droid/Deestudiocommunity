import { useState } from 'react';
import { useAdminData, adminAction } from '../../hooks/useAdminData';
import { Check, X, ExternalLink } from 'lucide-react';
import { formatJoinDate } from '../../utils/date';

export default function AdminApplications() {
  const { data: applications, loading, refetch } = useAdminData('/api/admin/applications');
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await adminAction('/api/admin/approve-member', { applicationId: id });
      refetch();
    } catch (err) {
      alert('Failed to approve: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this application?')) return;
    
    setProcessingId(id);
    try {
      await adminAction('/api/admin/reject-member', { applicationId: id });
      refetch();
    } catch (err) {
      alert('Failed to reject: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-primary font-mono animate-pulse">FETCHING_APPLICATIONS...</div>;

  const pendingApps = applications?.filter(app => app.status === 'pending') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pending Applications</h1>
        <p className="text-white/50">Review and approve new community members.</p>
      </div>

      {pendingApps.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-white/5">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
            <Check size={32} className="text-white/30" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-white/50">There are no pending applications at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingApps.map(app => (
            <div key={app.id} className="glass p-6 lg:p-8 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-8 justify-between">
                
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{app.full_name}</h2>
                      <p className="text-white/50">{app.country}</p>
                    </div>
                    <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
                      {formatJoinDate(app.created_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/40 mb-1 uppercase tracking-wider text-xs">Email</p>
                      <p className="font-mono">{app.email}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1 uppercase tracking-wider text-xs">YouTube</p>
                      <p className="font-mono text-primary">{app.youtube_username}</p>
                    </div>
                  </div>

                  {app.why_join && (
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <p className="text-white/40 mb-2 uppercase tracking-wider text-xs">Why they want to join</p>
                      <p className="text-white/80 italic font-light">"{app.why_join}"</p>
                    </div>
                  )}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  {app.subscription_screenshot_url && (
                    <a 
                      href={app.subscription_screenshot_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
                    >
                      <span className="text-sm font-medium flex items-center gap-2 text-white/50 group-hover:text-white">
                        <ExternalLink size={16} /> View Screenshot
                      </span>
                    </a>
                  )}
                  
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processingId === app.id}
                      className="flex-1 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={18} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={processingId === app.id}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                      {processingId === app.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={18} /> Approve
                        </>
                      )}
                    </button>
                  </div>
                  
                  <button className="text-xs text-center text-primary/60 hover:text-primary transition-colors py-2 uppercase tracking-widest font-bold">
                    Approve & Notify (Coming Soon)
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
