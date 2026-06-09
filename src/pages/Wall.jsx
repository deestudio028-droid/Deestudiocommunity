import { useState } from 'react';
import Particles from '../components/Particles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WallHero from '../components/wall/WallHero';
import LiveStats from '../components/wall/LiveStats';
import MemberSearch from '../components/wall/MemberSearch';
import MemberGrid from '../components/wall/MemberGrid';
import ProfileModal from '../components/wall/ProfileModal';
import WallCTA from '../components/wall/WallCTA';
import { useCommunityMembers } from '../hooks/useCommunityMembers';
import { useCommunityStats } from '../hooks/useCommunityStats';
import { useSubscribers } from '../hooks/useSubscribers';

export default function Wall() {
  const { members, loading: membersLoading, error: membersError } = useCommunityMembers();
  const { stats, loading: statsLoading } = useCommunityStats();
  const { subscribers, loading: subsLoading } = useSubscribers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter members based on search query
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (member.full_name && member.full_name.toLowerCase().includes(query)) ||
      (member.ds_id && member.ds_id.toLowerCase().includes(query))
    );
  });

  const handleMemberClick = (member, badge) => {
    setSelectedMember(member);
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white/20 font-sans relative">
      <Particles />
      <Navbar />
      
      <main className="relative z-10">
        <WallHero memberCount={members.length} />
        
        <LiveStats 
          subscribers={subscribers} 
          membersCount={members.length} 
          projectsBuilt={stats.projects_built} 
          loading={subsLoading || statsLoading || membersLoading} 
        />
        
        <MemberSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {membersLoading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/50">Loading community history...</p>
          </div>
        ) : membersError ? (
          <div className="py-20 text-center text-red-400">
            <p>Failed to load the wall. Please try again later.</p>
          </div>
        ) : (
          <MemberGrid members={filteredMembers} onMemberClick={handleMemberClick} />
        )}
        
        <WallCTA />
      </main>
      
      <Footer />

      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        member={selectedMember} 
        badge={selectedBadge}
      />
    </div>
  );
}
