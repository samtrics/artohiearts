import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { artworks, creators, liveActivity, moodStories } from '../data/artohieEcosystem';

const categories = ['Portraits', 'Anime', 'Digital Art', 'Sketches', 'Luxury Art', 'Abstract', 'Traditional Art'];

const sectionLabels = [
  'Trending Today',
  'Luxury Picks',
  'New Rising Artists',
  'Recommended For You',
  'Most Saved Artworks',
  'Community Favorites',
  'Featured Collections',
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A96B]/30 bg-white/70 px-3 py-1 text-[11px] font-[700] uppercase tracking-[0.16em] text-[#735b25] shadow-[0_12px_28px_rgba(200,169,107,0.12)] backdrop-blur-xl">
      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
      {children}
    </span>
  );
}

function ArtworkCard({ art, tall = false }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -10, scale: 1.01 }}
      className="group mb-8 break-inside-avoid overflow-hidden rounded-[28px] border border-black/5 bg-white/75 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl"
    >
      <div className={`relative overflow-hidden rounded-[20px] ${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
        <img src={art.src} alt={art.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white opacity-0 transition duration-500 group-hover:opacity-100">
          <p className="font-['Hanken_Grotesk'] text-[24px] font-[700] leading-tight">{art.title}</p>
          <p className="mt-1 text-[13px] text-white/75">by {art.artist}</p>
        </div>
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black opacity-0 shadow-lg backdrop-blur-xl transition duration-300 group-hover:opacity-100">
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
        </button>
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-5">
        <div>
          <h3 className="font-['Hanken_Grotesk'] text-[20px] font-[700] tracking-[-0.02em] text-black">{art.title}</h3>
          <p className="text-[13px] font-[500] text-[#6E6E73]">{art.mood} / {art.category}</p>
        </div>
        <span className="text-[12px] font-[700] text-[#735b25]">{art.price}</span>
      </div>
    </motion.article>
  );
}

function SectionRail({ title, offset = 0 }) {
  const selection = useMemo(() => artworks.slice(offset).concat(artworks.slice(0, offset)).slice(0, 4), [offset]);

  return (
    <section className="px-5 md:px-[80px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-[#735b25]">Curated discovery</span>
            <h2 className="mt-2 font-['Hanken_Grotesk'] text-[32px] font-[800] tracking-[-0.03em] text-black md:text-[44px]">{title}</h2>
          </div>
          <button className="hidden rounded-full border border-black/10 bg-white/60 px-5 py-3 text-[13px] font-[700] text-black shadow-sm backdrop-blur-xl transition hover:bg-white md:inline-flex">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {selection.map((art, index) => (
            <motion.div
              key={`${title}-${art.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="group rounded-[28px] border border-black/5 bg-white/70 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.04)] backdrop-blur-xl"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[22px]">
                <img src={art.src} alt={art.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-start justify-between gap-4 px-2 py-4">
                <div>
                  <h3 className="font-['Hanken_Grotesk'] text-[19px] font-[700] text-black">{art.title}</h3>
                  <p className="text-[13px] text-[#6E6E73]">{art.artist}</p>
                </div>
                <span className="rounded-full bg-black px-3 py-1 text-[11px] font-[700] uppercase tracking-[0.12em] text-white">{art.mood}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('Digital Art');
  const filteredArt = artworks.filter((art) => art.category === activeCategory);
  const visibleArt = filteredArt.length > 0 ? filteredArt : artworks;

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F5F7] font-['Inter'] text-[#111111]">
      <Navbar />
      <main className="pt-20">
        <section className="relative min-h-[calc(100vh-80px)] overflow-hidden px-5 py-14 md:px-[80px] md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,169,107,0.18),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.9),transparent_24%)]" />
          <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
              <Badge>Featured creator</Badge>
              <h1 className="mt-7 font-['Hanken_Grotesk'] text-[48px] font-[800] leading-[0.98] tracking-[-0.04em] text-black md:text-[86px]">
                Explore art that feels personally chosen.
              </h1>
              <p className="mt-7 max-w-xl text-[18px] leading-[1.75] text-[#6E6E73]">
                A cinematic discovery system for collectors, artists, moods, drops, and stories, tuned to feel like a private luxury museum.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {['Editor Picks', 'Trending Collections', 'Verified Artists'].map((item) => (
                  <button key={item} className="rounded-full border border-black/10 bg-white/75 px-5 py-3 text-[13px] font-[700] text-black shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-12 grid grid-cols-3 gap-4">
                {[
                  ['2.8M', 'monthly saves'],
                  ['18K', 'verified artists'],
                  ['94', 'curated moods'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[24px] border border-black/5 bg-white/70 p-5 backdrop-blur-xl">
                    <strong className="block font-['Hanken_Grotesk'] text-[28px] text-black">{value}</strong>
                    <span className="text-[12px] font-[700] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative min-h-[620px]">
              <motion.div
                animate={{ y: [0, -18, 0], rotate: [-2, 1, -2] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-16 z-20 w-[46%] overflow-hidden rounded-[34px] border border-white/50 bg-white/30 p-3 shadow-[0_40px_100px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
              >
                <img src={artworks[1].src} alt={artworks[1].title} className="aspect-[4/5] w-full rounded-[26px] object-cover" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 22, 0], rotate: [3, -1, 3] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-0 z-10 w-[58%] overflow-hidden rounded-[42px] border border-white/50 bg-white/40 p-4 shadow-[0_48px_120px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
              >
                <img src={artworks[0].src} alt={artworks[0].title} className="aspect-[4/5] w-full rounded-[32px] object-cover" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-10 left-[22%] z-30 w-[52%] overflow-hidden rounded-[34px] border border-white/60 bg-white/60 p-3 shadow-[0_40px_100px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
              >
                <img src={artworks[4].src} alt={artworks[4].title} className="aspect-[16/11] w-full rounded-[26px] object-cover" />
                <div className="flex items-center justify-between px-3 py-4">
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-[22px] font-[800] text-black">Editor's Pick</p>
                    <p className="text-[13px] text-[#6E6E73]">{creators[0].name} / Quiet Light</p>
                  </div>
                  <span className="material-symbols-outlined text-[#735b25]">auto_awesome</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="sticky top-20 z-40 border-y border-black/5 bg-white/65 px-5 py-5 backdrop-blur-2xl md:px-[80px]">
          <div className="mx-auto flex max-w-[1440px] gap-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-3 text-[13px] font-[700] transition ${
                  activeCategory === category
                    ? 'bg-black text-white shadow-[0_16px_36px_rgba(0,0,0,0.18)]'
                    : 'border border-black/10 bg-white/70 text-[#111111] hover:-translate-y-1 hover:bg-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-[#735b25]">Mood based discovery</span>
                <h2 className="mt-3 font-['Hanken_Grotesk'] text-[42px] font-[800] tracking-[-0.04em] text-black md:text-[64px]">Browse by feeling.</h2>
              </div>
              <p className="max-w-md text-[16px] leading-[1.7] text-[#6E6E73]">
                Follow moods like Calm, Luxury, Cinematic, or Vibrant and let the feed evolve around your emotional taste.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {moodStories.map((mood, index) => (
                <motion.article
                  key={mood.name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.55, delay: index * 0.04 }}
                  whileHover={{ y: -8 }}
                  className="relative min-h-[280px] overflow-hidden rounded-[34px] border border-black/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.06)]"
                  style={{ background: mood.gradient }}
                >
                  <img src={mood.image} alt={mood.name} className="absolute right-5 top-8 h-48 w-36 rotate-6 rounded-[24px] object-cover shadow-[0_24px_50px_rgba(0,0,0,0.18)]" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <button className={`w-fit rounded-full px-4 py-2 text-[12px] font-[800] uppercase tracking-[0.14em] ${mood.name === 'Dark' ? 'bg-white/15 text-white' : 'bg-white/70 text-black'} backdrop-blur-xl`}>
                      Follow mood
                    </button>
                    <div>
                      <h3 className={`font-['Hanken_Grotesk'] text-[38px] font-[800] ${mood.name === 'Dark' ? 'text-white' : 'text-black'}`}>{mood.name}</h3>
                      <p className={`${mood.name === 'Dark' ? 'text-white/65' : 'text-[#6E6E73]'} text-[14px] font-[600]`}>1.2K new works this week</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 md:px-[80px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto max-w-[1440px] columns-1 gap-8 md:columns-2 lg:columns-3"
          >
            {visibleArt.concat(artworks).slice(0, 9).map((art, index) => (
              <ArtworkCard key={`${art.id}-${index}`} art={art} tall={index % 3 === 0} />
            ))}
          </motion.div>
        </section>

        <section className="bg-[#eeeeef] py-24">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 md:grid-cols-[1.1fr_0.9fr] md:px-[80px]">
            <div className="rounded-[36px] border border-black/5 bg-white/70 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl md:p-12">
              <span className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[#735b25]">Creator verification</span>
              <h2 className="mt-3 font-['Hanken_Grotesk'] text-[40px] font-[800] tracking-[-0.04em] text-black md:text-[56px]">Prestige you can recognize.</h2>
              <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                {['Verified Artist', 'Luxury Creator', 'Rising Artist', 'Community Favorite', 'Elite Creator'].map((badge) => (
                  <motion.div key={badge} whileHover={{ y: -5 }} className="rounded-[24px] border border-[#C8A96B]/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(248,241,222,0.72))] p-5 shadow-[0_20px_48px_rgba(200,169,107,0.10)]">
                    <Badge>{badge}</Badge>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#6E6E73]">Metallic identity signaling for collectors, communities, and verified creative trust.</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-[36px] border border-black/5 bg-white/70 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl md:p-12">
              <span className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[#735b25]">Live ecosystem</span>
              <h2 className="mt-3 font-['Hanken_Grotesk'] text-[36px] font-[800] tracking-[-0.03em] text-black">Realtime movement.</h2>
              <div className="mt-8 space-y-4">
                {liveActivity.map((item, index) => (
                  <motion.div
                    key={item}
                    animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                    transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-4 rounded-[22px] border border-black/5 bg-white/80 p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8A96B]/15 text-[#735b25]">
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </span>
                    <p className="text-[14px] font-[600] leading-relaxed text-[#111111]">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-28 py-28">
          {sectionLabels.map((label, index) => (
            <SectionRail key={label} title={label} offset={index % artworks.length} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

