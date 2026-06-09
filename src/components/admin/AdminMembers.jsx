import { useState } from 'react';
import { useAdminData, adminAction } from '../../hooks/useAdminData';
import { Search, Trash2, Eye } from 'lucide-react';
import { formatJoinDate } from '../../utils/date';
import ProfileModal from '../wall/ProfileModal';
import { generateBadge } from '../../utils/badge';

export default function AdminMembers() {
  const { data: members, loading, refetch } = useAdminData('/api/admin/members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const filteredMembers = members?.filter(m => 
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.ds_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async (id, name) => {
    if (!confirm(`CRITICAL WARNING: Are you sure you want to completely remove ${name} from the database? This action cannot be undone.`)) return;
    
    setProcessingId(id);
    try {
      await adminAction('/api/admin/delete-member', { memberId: id, memberName: name });
      refetch();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleView = (member, index) => {
    setSelectedMember({ member, badge: generateBadge(index) });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Members</h1>
          <p className="text-white/50">Manage approved members of DeeStudio.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-sm uppercase tracking-wider text-white/50">
                <th className="p-4 font-medium">DS ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-primary font-mono animate-pulse">FETCHING_MEMBERS...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-white/30 italic">No members found matching your search.</td>
                </tr>
              ) : (
                filteredMembers.map((member, i) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-mono font-bold text-primary">{member.ds_id}</td>
                    <td className="p-4">
                      <p className="font-bold">{member.full_name}</p>
                      <p className="text-xs text-white/50">{member.country}</p>
                    </td>
                    <td className="p-4 text-sm text-white/70 font-mono">{member.email}</td>
                    <td className="p-4 text-sm text-white/50">{formatJoinDate(member.joined_at)}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleView(member, i)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id, member.full_name)}
                          disabled={processingId === member.id}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        member={selectedMember?.member} 
        badge={selectedMember?.badge}
      />
    </div>
  );
}
