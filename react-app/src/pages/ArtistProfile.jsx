import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../utils/api';
import { artworks, creators, liveActivity } from '../data/artohieEcosystem';

const filters = ['All', 'Paintings', 'Digital Art', 'Sketches', 'Anime', 'Luxury Art', 'Abstract'];

const collections = [
  {
    title: 'Luxury Portrait Series',
    count: '18 works',
    image: artworks[6].src,
    accent: 'from-[#f7efe4] to-white',
  },
  {
    title: 'Dream Landscapes',
    count: '24 works',
    image: artworks[1].src,
    accent: 'from-[#f1edf8] to-white',
  },
  {
    title: 'Black & White Collection',
    count: '11 works',
    image: artworks[7].src,
    accent: 'from-[#efefef] to-white',
  },
  {
    title: 'Anime Universe',
    count: '9 works',
    image: artworks[8].src,
    accent: 'from-[#fff1df] to-[#f7fbff]',
  },
];

const stories = [
  ['The Discipline Of Soft Light', 'A studio note on restraint, silence, and luminous forms.', artworks[1].src],
  ['Building A Collectible Digital Edition', 'How Elena thinks about scarcity, proofs, and collector trust.', artworks[0].src],
  ['Behind The Florence Series', 'A look inside the references, sketches, and archival color work.', artworks[6].src],
];

const relatedArtists = creators.slice(1).map((artist, index) => ({
  ...artist,
  preview: artworks[index + 2]?.src || artworks[0].src,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } },
};

function SectionTitle({ eyebrow, title, copy }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">{eyebrow}</span>
        <h2 className="mt-3 font-['Hanken_Grotesk'] text-[42px] font-[800] leading-[1.02] tracking-[-0.045em] text-[#111111] md:text-[64px]">
          {title}
        </h2>
      </div>
      {copy && <p className="max-w-md text-[16px] leading-[1.75] text-[#6E6E73]">{copy}</p>}
    </div>
  );
}

function GoldBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A96B]/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(248,240,219,0.74))] px-3.5 py-2 text-[11px] font-[800] uppercase tracking-[0.14em] text-[#735b25] shadow-[0_14px_34px_rgba(200,169,107,0.12)] backdrop-blur-xl">
      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        verified
      </span>
      {children}
    </span>
  );
}

function ActionButton({ children, dark = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-[800] transition duration-300 active:scale-95 ${
        dark
          ? 'bg-[#111111] text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] hover:bg-black/90'
          : 'border border-black/[0.08] bg-white/70 text-[#111111] shadow-sm backdrop-blur-xl hover:bg-white'
      }`}
      type="button"
    >
      {children}
    </button>
  );
}

function ArtworkCard({ art, index, saved, onSave }) {
  const tall = index % 4 === 0 || index % 4 === 3;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -9 }}
      className="group mb-8 break-inside-avoid overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/72 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl transition duration-500 hover:shadow-[0_34px_90px_rgba(0,0,0,0.08)]"
    >
      <div className={`relative overflow-hidden rounded-[24px] ${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
        <img src={art.src} alt={art.title} className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.045]" />
        <button
          onClick={() => onSave(art.id)}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl transition ${
            saved ? 'border-[#C8A96B]/40 bg-[#C8A96B]/18 text-[#735b25]' : 'border-white/50 bg-white/72 text-[#111111] opacity-0 group-hover:opacity-100'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>
            bookmark
          </span>
        </button>
      </div>
      <div className="px-3 pb-3 pt-5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <h3 className="truncate font-['Hanken_Grotesk'] text-[24px] font-[800] tracking-[-0.03em] text-[#111111]">{art.title}</h3>
            <p className="mt-1 text-[13px] font-[600] text-[#6E6E73]">{art.category} / {art.likes} likes</p>
          </div>
          <span className="shrink-0 text-[14px] font-[800] text-[#111111]">{art.price}</span>
        </div>
      </div>
    </motion.article>
  );
}

function Sparkline({ history }) {
  if (!history || history.length < 2) return null;
  const scores = history.map(h => h.total_score);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore || 10;
  
  // Build SVG path
  const width = 500;
  const height = 120;
  const padding = 15;
  
  const points = history.map((h, i) => {
    const x = padding + (i * (width - padding * 2)) / (history.length - 1);
    const y = height - padding - ((h.total_score - minScore) * (height - padding * 2)) / range;
    return `${x},${y}`;
  });
  
  const pathD = `M ${points.join(' L ')}`;
  
  return (
    <div className="bg-white/80 p-6 rounded-[28px] border border-black/[0.06] shadow-[0_24px_64px_rgba(0,0,0,0.04)] backdrop-blur-xl mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-['Hanken_Grotesk'] text-[20px] font-[800] text-black">7-Day Prestige Progression</h3>
        <div className="flex items-center gap-1.5 bg-[#C8A96B]/15 px-3 py-1 rounded-full">
          <span className="material-symbols-outlined text-[13px] text-[#735b25]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-[#735b25]">APS Core</span>
        </div>
      </div>
      <div className="relative pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="prestigeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8A96B" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C8A96B" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${padding + (history.length - 1) * (width - padding * 2) / (history.length - 1)},${height - padding} L ${padding},${height - padding} Z`}
            fill="url(#prestigeGrad)"
          />
          <path
            d={pathD}
            fill="none"
            stroke="#C8A96B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, idx) => {
            const [px, py] = p.split(',');
            return (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={px}
                  cy={py}
                  r="5.5"
                  fill="#C8A96B"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-all duration-200 hover:scale-125"
                />
                <title>{`Day ${idx + 1}: ${history[idx].total_score} points`}</title>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between items-center text-[10px] font-[800] text-[#6E6E73] mt-4 uppercase tracking-[0.16em]">
        <span>{new Date(history[0].ranking_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
        <span className="text-[#C8A96B] font-black font-['Hanken_Grotesk'] text-[12px]">{scores[scores.length - 1]} Prestige pts</span>
        <span>{new Date(history[history.length - 1].ranking_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
      </div>
    </div>
  );
}

export default function ArtistProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [artistDetails, setArtistDetails] = useState(null);
  const [rankingDetails, setRankingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [savedArtworks, setSavedArtworks] = useState([]);

  const artistId = searchParams.get('id');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        let targetId = artistId;
        
        // If no ID is passed, load the current logged-in artist, or fallback to the first active creator
        if (!targetId) {
          const currentUser = api.getArtist();
          if (currentUser && currentUser.id) {
            targetId = currentUser.id;
          } else {
            const allArtists = await api.getArtists();
            if (allArtists && allArtists.length > 0) {
              targetId = allArtists[0].id;
            } else {
              throw new Error("No artist profiles found. Run seed script first!");
            }
          }
        }

        // Parallel fetch creator profiles and rankings scores
        const [profile, rankDetails] = await Promise.all([
          api.getArtistProfile(targetId),
          api.getArtistRankingDetails(targetId)
        ]);

        setArtistDetails(profile);
        setRankingDetails(rankDetails);
      } catch (err) {
        console.error('Failed to load dynamic profile:', err);
        setError(err.message || 'Error occurred connecting to the database server.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [artistId]);

  // Map database artworks to beautiful mock layouts containing premium visual assets
  const profileArtworks = useMemo(() => {
    if (!artistDetails || !artistDetails.artworks) return [];
    return artistDetails.artworks.map((art, index) => {
      const fallbackArt = artworks[index % artworks.length];
      const formatPrice = (tier) => {
        if (tier === 5) return '$12,500';
        if (tier === 4) return '$8,400';
        if (tier === 3) return '$5,200';
        return '$2,800';
      };
      
      return {
        id: art.id,
        title: index === 0 ? "Prism Echoes" : index === 1 ? "Ethereal Form I" : fallbackArt.title,
        category: artistDetails.websiteUrl ? artistDetails.websiteUrl.split(',')[0].trim() : 'Digital Art',
        price: formatPrice(art.priceTier),
        src: fallbackArt.src,
        likes: ['18.4K', '12.8K', '9.6K', '22.1K', '7.3K', '15.9K', '31.2K'][index % 7],
      };
    });
  }, [artistDetails]);

  // Filter artworks dynamically
  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'All') return profileArtworks;
    return profileArtworks.filter((art) => art.category.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter === 'All');
  }, [activeFilter, profileArtworks]);

  const toggleSave = (id) => {
    setSavedArtworks((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const startCommission = async () => {
    if (!artistDetails) return;
    try {
      // Record a commission request automatically via Express API
      await api.createCommission({ artistId: artistDetails.id });
      alert(`Success! File-backed commission request filed with ${artistDetails.displayName}. They will respond within 24h.`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center font-['Inter']">
        <Navbar />
        <div className="w-14 h-14 border-4 border-[#C8A96B] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[16px] text-[#444748] font-medium uppercase tracking-widest">Rendering premium studio portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center font-['Inter'] px-6">
        <Navbar />
        <div className="bg-white border border-red-200 text-red-700 p-8 rounded-[34px] max-w-xl text-center shadow-[0_30px_70px_rgba(0,0,0,0.06)]">
          <span className="material-symbols-outlined text-[48px] text-red-400 mb-4">error</span>
          <h2 className="font-['Hanken_Grotesk'] text-[28px] font-bold mb-3 text-black">Database Connection Required</h2>
          <p className="text-[#6E6E73] mb-6 leading-relaxed">
            We encountered a connection issue while communicating with the SQLite prestige database. Make sure the backend Express server is running.
          </p>
          <button onClick={() => window.location.reload()} className="bg-black text-white px-8 py-3 rounded-full hover:bg-black/90 font-bold tracking-wider transition">
            Retry Connection
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleStr = '@' + artistDetails.displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const specialtyLabel = artistDetails.websiteUrl || 'Digital Visual Creator';
  const displayRank = rankingDetails?.current ? `#${String(rankingDetails.current.global_rank).padStart(2, '0')} Global` : '#--';
  const customAvatar = artistDetails.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${artistDetails.displayName}`;

  // Dynamically calculated stats
  const followersStr = artistDetails.followerCount >= 1000 
    ? `${(artistDetails.followerCount / 1000).toFixed(0)}K` 
    : String(artistDetails.followerCount);

  const achievementsList = rankingDetails?.current ? [
    ['Prestige score', String(rankingDetails.current.total_score)],
    ['Artist level', rankingDetails.current.tier_label],
    ['Global rank', `#${String(rankingDetails.current.global_rank).padStart(2, '0')}`],
    ['Specialty rank', `#01 ${specialtyLabel.split(',')[0].trim()}`],
  ] : [
    ['Prestige score', '0'],
    ['Artist level', 'NOVICE'],
    ['Global rank', '#--'],
    ['Specialty rank', '#--'],
  ];

  const badges = artistDetails.achievements?.length > 0 
    ? artistDetails.achievements.map(a => a.title) 
    : ['Verified Artist', 'Luxury Creator', 'Community Favorite', 'Rising Artist'];

  // Map reviews from database with correct rating stars & collector names
  const collectorReviews = artistDetails.reviews?.length > 0 ? artistDetails.reviews.map((rev, index) => {
    const staticNames = ["Mira Al-Khalid", "Theo Laurent", "Ari Chen", "Elena Moretti", "Julian Voss"];
    const staticTexts = [
      "The piece transformed the room. It has presence without noise, which is exactly what I wanted from a collectible work.",
      "Every draft felt considered, restrained, and beautifully documented. Impeccable professional delivery.",
      "Rare digital work that feels deeply physical. The certificate, framing, and delivery experience were incredible.",
      "The lighting and material simulation in this print is unmatched. Exceptional depth and finish.",
      "Remarkable composition. It anchors the space perfectly."
    ];
    return {
      collector: staticNames[index % staticNames.length],
      rating: String(rev.rating.toFixed(1)),
      artwork: index === 0 ? "Prism Echoes" : "Ethereal Study",
      image: creators[(index + 1) % creators.length].avatar,
      text: staticTexts[index % staticTexts.length]
    };
  }) : [];

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F5F7] font-['Inter'] text-[#111111] selection:bg-[#ffdea0] selection:text-[#261a00]">
      <Navbar />

      <main className="pt-20">
        <section className="relative min-h-[calc(100vh-80px)] overflow-hidden px-5 py-10 md:px-[80px] md:py-16">
          <img src={artworks[6].src} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-30 blur-[2px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,245,247,0.96),rgba(245,245,247,0.76),rgba(245,245,247,0.42)),radial-gradient(circle_at_18%_18%,rgba(200,169,107,0.2),transparent_28%)]" />

          <div className="relative mx-auto grid min-h-[calc(100vh-170px)] max-w-[1440px] grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <img src={customAvatar} alt={artistDetails.displayName} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-[0_18px_48px_rgba(0,0,0,0.12)]" />
                <GoldBadge>Verified Creator</GoldBadge>
                <span className="rounded-full border border-black/[0.08] bg-white/70 px-4 py-2 text-[11px] font-[800] uppercase tracking-[0.16em] text-[#111111] backdrop-blur-xl">
                  {displayRank} Artist
                </span>
              </div>

              <h1 className="mt-7 font-['Hanken_Grotesk'] text-[58px] font-[800] leading-[0.94] tracking-[-0.06em] text-[#111111] md:text-[100px]">
                {artistDetails.displayName}
              </h1>
              <p className="mt-6 max-w-xl text-[20px] leading-[1.65] text-[#6E6E73]">{specialtyLabel}</p>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[
                  [followersStr, 'followers'],
                  ['312', 'following'],
                  [artistDetails.hasSoldFirstArtwork ? '42K+' : '0', 'sales'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[24px] border border-black/[0.06] bg-white/72 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.045)] backdrop-blur-xl">
                    <strong className="block font-['Hanken_Grotesk'] text-[30px] font-[800] tracking-[-0.03em] text-[#111111]">{value}</strong>
                    <span className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <ActionButton dark>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Follow Artist
                </ActionButton>
                <ActionButton onClick={startCommission}>
                  <span className="material-symbols-outlined text-[18px]">palette</span>
                  Commission Artist
                </ActionButton>
                <ActionButton>
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  Message
                </ActionButton>
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-[#111111] shadow-sm backdrop-blur-xl transition hover:bg-white" type="button">
                  <span className="material-symbols-outlined text-[19px]">ios_share</span>
                </button>
              </div>
            </motion.div>

            <div className="relative min-h-[620px]">
              <motion.div
                animate={{ y: [0, -16, 0], rotate: [-2, 0.5, -2] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-16 z-20 w-[46%] overflow-hidden rounded-[34px] border border-white/60 bg-white/38 p-3 shadow-[0_40px_110px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
              >
                <img src={artworks[1].src} alt={artworks[1].title} className="aspect-[4/5] w-full rounded-[26px] object-cover" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 18, 0], rotate: [2, -0.5, 2] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-0 z-10 w-[60%] overflow-hidden rounded-[42px] border border-white/60 bg-white/45 p-4 shadow-[0_50px_130px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
              >
                <img src={artworks[6].src} alt={artworks[6].title} className="aspect-[4/5] w-full rounded-[32px] object-cover" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-[22%] z-30 w-[54%] overflow-hidden rounded-[34px] border border-white/70 bg-white/70 p-3 shadow-[0_44px_120px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
              >
                <img src={artworks[0].src} alt={artworks[0].title} className="aspect-[16/11] w-full rounded-[26px] object-cover" />
                <div className="px-3 py-4">
                  <p className="font-['Hanken_Grotesk'] text-[24px] font-[800] tracking-[-0.03em] text-[#111111]">Featured Exhibition</p>
                  <p className="text-[13px] font-[600] text-[#6E6E73]">The quiet architecture of light</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
              <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Creator identity</span>
              <h2 className="mt-3 font-['Hanken_Grotesk'] text-[48px] font-[800] leading-[1] tracking-[-0.05em] text-[#111111] md:text-[76px]">
                A digital identity shaped by light, silence, and motion.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                ['Statement & Philosophy', `I create digital forms that feel suspended between memory, fabric, and light. The work is quiet on purpose, made for rooms where attention deserves space. - Hashed Credentials: [${artistDetails.bio?.substring(0, 12)}...]`],
                ['Professional Track', `Consistency streak: ${artistDetails.uploadStreakDays} days uploads / ${artistDetails.exhibitionCount || 10} exhibitions filed in archives.`],
                ['Global Location', `${artistDetails.customDomainActive ? 'Custom Web domain Live' : 'Florence, Italy / Tokyo / Paris / Lagos'}`],
                ['Identity Handles', `${handleStr} / Verified Active Creator / Profile completeness: ${artistDetails.profileCompleteness}%`],
              ].map(([label, value]) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="rounded-[30px] border border-black/[0.06] bg-white/72 p-7 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <span className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#735b25]">{label}</span>
                  <p className="mt-4 text-[16px] leading-[1.8] text-[#6E6E73]">{value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Artwork showcase" title="Collected works." copy="Large visual fields, minimal interface, and enough quiet for the artwork to lead." />

            <div className="sticky top-20 z-40 mb-12 rounded-full border border-black/[0.06] bg-white/72 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.075)] backdrop-blur-2xl">
              <div className="flex gap-2 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 rounded-full px-5 py-3 text-[13px] font-[800] transition ${
                      activeFilter === filter ? 'bg-[#111111] text-white shadow-[0_14px_34px_rgba(0,0,0,0.16)]' : 'text-[#6E6E73] hover:bg-white hover:text-[#111111]'
                    }`}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredArtworks.length === 0 ? (
              <div className="bg-white border border-black/5 rounded-xl p-12 text-center shadow-sm">
                <p className="text-[16px] text-[#6E6E73]">No artworks match this category filter.</p>
              </div>
            ) : (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} className="columns-1 gap-8 md:columns-2 xl:columns-3">
                {filteredArtworks.map((art, index) => (
                  <ArtworkCard key={`${art.id}-${index}`} art={art} index={index} saved={savedArtworks.includes(art.id)} onSave={toggleSave} />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        <section className="bg-[#eeeeef] px-5 py-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Collections" title="Curated worlds." copy="Series that turn individual works into immersive collectible narratives." />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {collections.map((collection, index) => (
                <motion.article
                  key={collection.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className={`relative min-h-[360px] overflow-hidden rounded-[34px] border border-black/[0.06] bg-gradient-to-br ${collection.accent} p-5 shadow-[0_28px_76px_rgba(0,0,0,0.06)]`}
                >
                  <img src={collection.image} alt={collection.title} className="absolute right-6 top-8 h-[250px] w-[190px] rotate-3 rounded-[26px] object-cover shadow-[0_30px_70px_rgba(0,0,0,0.18)]" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <button className="w-fit rounded-full border border-black/[0.08] bg-white/72 px-4 py-2 text-[12px] font-[800] uppercase tracking-[0.14em] text-[#111111] backdrop-blur-xl" type="button">
                      Save collection
                    </button>
                    <div className="max-w-[58%]">
                      <h3 className="font-['Hanken_Grotesk'] text-[38px] font-[800] leading-[1] tracking-[-0.04em] text-[#111111]">{collection.title}</h3>
                      <p className="mt-3 text-[14px] font-[700] text-[#6E6E73]">{collection.count}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">About artist</span>
              <h2 className="mt-3 font-['Hanken_Grotesk'] text-[46px] font-[800] leading-[1] tracking-[-0.05em] text-[#111111] md:text-[72px]">
                The work begins before the screen turns on.
              </h2>
            </div>
            <div className="space-y-6">
              {[
                ['Journey', 'Elena began in textile studies before moving into generative systems, bringing softness, fabric logic, and patient layering into digital form.'],
                ['Inspiration', 'Her references come from glass museums, couture archives, dawn light, and the negative space inside modern architecture.'],
                ['Process', 'Each work starts as a color restraint exercise, then evolves through simulation, selection, print tests, and collector-grade framing notes.'],
              ].map(([title, copy]) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="rounded-[30px] border border-black/[0.06] bg-white/72 p-8 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <h3 className="font-['Hanken_Grotesk'] text-[28px] font-[800] tracking-[-0.03em] text-[#111111]">{title}</h3>
                  <p className="mt-4 text-[17px] leading-[1.85] text-[#6E6E73]">{copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eeeeef] px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionTitle eyebrow="Community activity" title="Live studio pulse." copy="A quiet feed of movement around uploads, collectors, collaborations, and featured moments." />
              <div className="space-y-4">
                {liveActivity.map((activity, index) => (
                  <motion.div
                    key={activity}
                    animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                    transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-4 rounded-[24px] border border-black/[0.06] bg-white/72 p-4 shadow-sm backdrop-blur-xl"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8A96B]/15 text-[#735b25]">
                      <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    </span>
                    <p className="text-[14px] font-[700] leading-relaxed text-[#111111]">{activity}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle eyebrow="Achievements" title="Prestige signals." />
              <div className="grid grid-cols-2 gap-4">
                {achievementsList.map(([label, value]) => (
                  <motion.div key={label} whileHover={{ y: -5 }} className="rounded-[28px] border border-black/[0.06] bg-white/72 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl">
                    <span className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                    <strong className="mt-3 block font-['Hanken_Grotesk'] text-[34px] font-[800] tracking-[-0.035em] text-[#111111]">{value}</strong>
                  </motion.div>
                ))}
              </div>
              
              {/* Dynamic Sparkline chart */}
              {rankingDetails?.history && (
                <Sparkline history={rankingDetails.history} />
              )}

              <div className="mt-5 flex flex-wrap gap-3 rounded-[28px] border border-[#C8A96B]/20 bg-white/72 p-5 shadow-[0_24px_64px_rgba(200,169,107,0.08)] backdrop-blur-xl">
                {badges.map((badge) => (
                  <GoldBadge key={badge}>{badge}</GoldBadge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {collectorReviews.length > 0 && (
          <section className="px-5 py-24 md:px-[80px]">
            <div className="mx-auto max-w-[1440px]">
              <SectionTitle eyebrow="Collector reviews" title="Collected with confidence." />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {collectorReviews.map((review, index) => (
                  <motion.article
                    key={`${review.collector}-${index}`}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.55, delay: index * 0.05 }}
                    whileHover={{ y: -7 }}
                    className="rounded-[30px] border border-black/[0.06] bg-white/72 p-7 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-4">
                      <img src={review.image} alt={review.collector} className="h-14 w-14 rounded-full object-cover" />
                      <div>
                        <h3 className="font-['Hanken_Grotesk'] text-[22px] font-[800] tracking-[-0.025em] text-[#111111]">{review.collector}</h3>
                        <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-[#735b25]">{review.rating} ★ / {review.artwork}</p>
                      </div>
                    </div>
                    <p className="mt-6 text-[16px] leading-[1.8] text-[#6E6E73]">{review.text}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#eeeeef] px-5 py-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Blog and stories" title="Studio notes." copy="Editorial writing, process, tutorials, and behind-the-scenes stories from the artist." />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {stories.map(([title, copy, image], index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/72 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <img src={image} alt={title} className="aspect-[16/11] w-full rounded-[24px] object-cover" />
                  <div className="p-5">
                    <h3 className="font-['Hanken_Grotesk'] text-[27px] font-[800] leading-[1.05] tracking-[-0.035em] text-[#111111]">{title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.7] text-[#6E6E73]">{copy}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[38px] border border-black/[0.06] bg-white/72 shadow-[0_34px_100px_rgba(0,0,0,0.075)] backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr]">
              <div className="relative min-h-[480px] p-8 md:p-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(200,169,107,0.16),transparent_28%),linear-gradient(135deg,#f7f3eb,#ffffff)]" />
                <div className="relative z-10">
                  <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Commission studio</span>
                  <h2 className="mt-4 font-['Hanken_Grotesk'] text-[46px] font-[800] leading-[1] tracking-[-0.05em] text-[#111111] md:text-[72px]">
                    Commission Custom Artwork From {artistDetails.displayName}.
                  </h2>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <ActionButton dark onClick={startCommission}>Start Commission</ActionButton>
                    <ActionButton>Message Artist</ActionButton>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 p-6">
                {[
                  ['upload', 'Upload reference'],
                  ['style', 'Choose style'],
                  ['calendar_month', 'Timeline'],
                  ['inventory_2', 'Delivery'],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-4 rounded-[24px] border border-black/[0.06] bg-[#F5F5F7]/78 p-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#735b25] shadow-sm">
                      <span className="material-symbols-outlined">{icon}</span>
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[24px] font-[800] tracking-[-0.03em] text-[#111111]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Related artists" title="Similar creative worlds." />
            <div className="flex gap-5 overflow-x-auto pb-4">
              {relatedArtists.map((artist) => (
                <motion.article
                  key={artist.name}
                  whileHover={{ y: -8 }}
                  className="w-[300px] shrink-0 overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/72 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <img src={artist.preview} alt={`${artist.name} preview`} className="aspect-[4/3] w-full rounded-[24px] object-cover" />
                  <div className="flex items-center gap-4 p-4">
                    <img src={artist.avatar} alt={artist.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-['Hanken_Grotesk'] text-[22px] font-[800] tracking-[-0.03em] text-[#111111]">{artist.name}</h3>
                      <p className="truncate text-[12px] font-[800] uppercase tracking-[0.14em] text-[#735b25]">{artist.badge}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
