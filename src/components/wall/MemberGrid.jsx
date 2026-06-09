import MemberCard from './MemberCard';

export default function MemberGrid({ members, onMemberClick }) {
  if (members.length === 0) {
    return (
      <div className="py-20 text-center relative z-10">
        <p className="text-2xl text-white/40 font-light italic">"The journey is just beginning."</p>
      </div>
    );
  }

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member, index) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              index={index} 
              onClick={onMemberClick} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
