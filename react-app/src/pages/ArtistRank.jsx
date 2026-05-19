import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../utils/api';

const getBadgeDetails = (tier) => {
  switch (tier?.toLowerCase()) {
    case 'elite':
      return { badge: 'ELITE CREATOR', badgeIcon: 'workspace_premium', isGold: true };
    case 'master':
      return { badge: 'MASTER CREATOR', badgeIcon: 'bolt', isGold: false };
    case 'adept':
      return { badge: 'ADEPT CREATOR', badgeIcon: 'verified_user', isGold: false };
    case 'emerging':
      return { badge: 'EMERGING TALENT', badgeIcon: 'star', isGold: false };
    default:
      return { badge: 'NOVICE CREATOR', badgeIcon: 'school', isGold: false };
  }
};

export default function ArtistRank() {
  const navigate = useNavigate();
  const [rankingsList, setRankingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRankings() {
      try {
        setLoading(true);
        // Get the global leaderboard rankings from Express backend
        const res = await api.getRankings({ page: 1, limit: 20 });
        setRankingsList(res.data || []);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError(err.message || 'Failed to load leaderboards.');
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="font-['Inter'] text-[#1a1c1d]" style={{ backgroundColor: '#F5F5F7' }}>
      <Navbar />
      <main className="pt-32 pb-[160px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <span className="font-['Inter'] text-[12px] font-[600] text-[#C8A96B] uppercase tracking-widest mb-4 block">Ecosystem Integrity</span>
            <h1 className="font-['Hanken_Grotesk'] text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.04em] text-black mb-8">The Elite Rankings</h1>
            <div className="bg-white p-8 rounded-xl border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
              <h2 className="font-['Hanken_Grotesk'] text-[24px] font-[600] mb-4">The Prestige Algorithm</h2>
              <p className="font-['Inter'] text-[16px] text-[#444748] leading-relaxed">
                Prestige is Artohie's proprietary metric of artistic influence. It calculates a weighted score based on{' '}
                <span className="text-black font-semibold">secondary market stability</span>,{' '}
                <span className="text-black font-semibold">curatorial peer-review</span>, and{' '}
                <span className="text-black font-semibold">historical provenance</span>.
                A higher score unlocks exclusive high-stakes commissions and private gallery placements.
              </p>
            </div>
          </motion.header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#C8A96B] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-['Inter'] text-[16px] text-[#444748]">Retrieving prestige rankings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
              <p className="font-semibold mb-2">Error Connection Server</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : rankingsList.length === 0 ? (
            <div className="bg-white border border-black/5 rounded-xl p-12 text-center shadow-sm">
              <p className="font-['Inter'] text-[16px] text-[#444748]">No ranking entries found. Seed the database to populate creators.</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <motion.section 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                <div className="hidden md:grid grid-cols-12 px-8 py-4 font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-5">Artist</div>
                  <div className="col-span-2 text-center">Specialty</div>
                  <div className="col-span-2 text-center">Prestige Score</div>
                  <div className="col-span-2 text-right">Achievement</div>
                </div>

                {rankingsList.map((r) => {
                  const { badge, badgeIcon, isGold } = getBadgeDetails(r.tier);
                  const displayRank = String(r.global_rank).padStart(2, '0');
                  const customAvatar = r.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.display_name}`;
                  const specialtyLabel = r.specialty || 'Digital Visual Creator';
                  const handleStr = '@' + r.display_name.toLowerCase().replace(/[^a-z0-9]/g, '');

                  return (
                    <motion.div 
                      key={r.artist_id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, boxShadow: "0 30px 60px rgba(0, 0, 0, 0.08)" }}
                      onClick={() => navigate(`/artist-profile?id=${r.artist_id}`)}
                      className={`bg-white rounded-xl p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 items-center gap-6 relative overflow-hidden transition-all duration-300 cursor-pointer ${isGold
                        ? 'shadow-[0_30px_60px_rgba(0,0,0,0.06)] border-2 border-[#C8A96B]/20'
                        : 'shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-black/5 hover:border-black/10'
                        }`}
                    >
                      {isGold && (
                        <div className="absolute top-0 right-0 p-4">
                          <span className="material-symbols-outlined text-[#C8A96B]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                        </div>
                      )}
                      <div className="col-span-1 flex items-center justify-center md:justify-start">
                        <span className={`font-['Hanken_Grotesk'] text-[32px] font-bold ${isGold ? 'text-[#C8A96B]' : 'text-[#444748]'}`}>{displayRank}</span>
                      </div>
                      <div className="col-span-5 flex items-center gap-6 w-full">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#eeeef0] flex-shrink-0" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}>
                          <img className="w-full h-full object-cover" src={customAvatar} alt={r.display_name} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[600] truncate">{r.display_name}</h3>
                          <p className="font-['Inter'] text-[14px] font-[500] text-[#444748] truncate">{handleStr}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-4 py-1 bg-[#f3f3f5] rounded-full font-['Inter'] text-[12px] font-[600] block truncate max-w-full">{specialtyLabel}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-['Hanken_Grotesk'] text-[32px] font-[600] ${isGold ? 'text-[#C8A96B]' : 'text-[#1a1c1d]'}`}>{r.total_score}</span>
                          <span className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider">{r.tier_label}</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isGold ? 'bg-[#C8A96B]/10 border border-[#C8A96B]/20' : 'bg-[#e8e8ea]'}`}>
                          <span className={`material-symbols-outlined text-lg ${isGold ? 'text-[#C8A96B]' : 'text-[#444748]'}`} style={isGold ? { fontVariationSettings: "'FILL' 1" } : {}}>{badgeIcon}</span>
                          <span className={`font-['Inter'] text-[12px] font-[600] ${isGold ? 'text-[#735b25] font-bold' : 'text-[#444748]'}`}>{badge}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.section>
            </>
          )}

          <footer className="mt-20 text-center">
            <p className="font-['Inter'] text-[16px] text-[#444748] mb-8 max-w-xl mx-auto">
              Rankings are updated every 24 hours at 00:00 UTC. To improve your Prestige score, focus on increasing the verification status of your secondary sales.
            </p>
            <button className="border border-black px-10 py-4 font-['Inter'] text-[14px] font-[500] hover:scale-95 active:scale-90 transition-transform duration-200">
              Apply for Elite Certification
            </button>
          </footer>
        </div>
      </main>
      <Footer />
    </div>
  );
}
