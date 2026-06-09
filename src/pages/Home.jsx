import Particles from '../components/Particles';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Story from '../components/Story';
import WhyJoin from '../components/WhyJoin';
import WallPreview from '../components/WallPreview';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white/20 font-sans relative">
      <Particles />
      <Navbar />
      
      <main className="relative z-10 pt-20">
        <Hero />
        <Stats />
        <Story />
        <WhyJoin />
        <WallPreview />
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  );
}


