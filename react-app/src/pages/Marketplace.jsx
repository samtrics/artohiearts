import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { artworks, creators } from '../data/artohieEcosystem';

const filters = ['All', 'Portraits', 'Digital', 'Abstract', 'Luxury', 'Anime'];
const sortOptions = ['Curated', 'Newest', 'Price high', 'Price low'];

const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const categoryMap = {
  All: 'All',
  Portraits: 'Portraits',
  Digital: 'Digital Art',
  Abstract: 'Abstract',
  Luxury: 'Luxury Art',
  Anime: 'Anime',
};

function priceValue(price) {
  return Number(price.replace(/[$,]/g, ''));
}

function PrimaryButton({ children, onClick, subtle = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[14px] font-[700] transition duration-300 active:scale-95 ${
        subtle
          ? 'border border-black/10 bg-white/65 text-[#111111] shadow-[0_14px_34px_rgba(0,0,0,0.04)] backdrop-blur-xl hover:bg-white'
          : 'bg-[#111111] text-white shadow-[0_18px_42px_rgba(0,0,0,0.16)] hover:bg-black/90'
      }`}
      type="button"
    >
      {children}
    </button>
  );
}

function ArtworkCard({ art, index, onOpen, onSave, saved }) {
  const tall = index % 5 === 0 || index % 5 === 3;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -10 }}
      className="group mb-8 break-inside-avoid overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/70 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.045)] backdrop-blur-xl transition duration-500 hover:shadow-[0_34px_90px_rgba(0,0,0,0.08)]"
    >
      <button onClick={() => onOpen(art)} className="block w-full text-left" type="button">
        <div className={`relative overflow-hidden rounded-[24px] ${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
          <img
            src={art.src}
            alt={art.title}
            className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(0,0,0,0.42))] opacity-0 transition duration-700 group-hover:opacity-100" />
        </div>
      </button>

      <div className="flex items-center justify-between gap-5 px-3 pb-3 pt-5">
        <button onClick={() => onOpen(art)} className="min-w-0 text-left" type="button">
          <p className="truncate text-[13px] font-[600] text-[#6E6E73]">{art.artist}</p>
          <h3 className="mt-1 truncate font-['Hanken_Grotesk'] text-[23px] font-[700] tracking-[-0.025em] text-[#111111]">
            {art.title}
          </h3>
          <p className="mt-2 text-[14px] font-[700] text-[#111111]">{art.price}</p>
        </button>
        <button
          onClick={() => onSave(art.id)}
          aria-label={`Save ${art.title}`}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
            saved ? 'border-[#C8A96B]/40 bg-[#C8A96B]/15 text-[#735b25]' : 'border-black/10 bg-white/70 text-[#111111] hover:bg-white'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>
            bookmark
          </span>
        </button>
      </div>
    </motion.article>
  );
}

function ProductModal({ artwork, onClose, onPurchase, onSave, saved }) {
  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#F5F5F7]/86 p-4 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto my-6 max-w-[1380px] overflow-hidden rounded-[38px] border border-black/[0.06] bg-white/72 shadow-[0_48px_140px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#111111] shadow-sm backdrop-blur-xl"
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="flex min-h-[640px] items-center justify-center bg-[radial-gradient(circle_at_50%_18%,rgba(200,169,107,0.12),transparent_26%),linear-gradient(135deg,#f2f0eb,#fbfbfd)] p-6 md:p-14">
                <motion.div
                  initial={{ y: 8 }}
                  animate={{ y: [8, -6, 8] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full max-w-[680px] rounded-[28px] border-[12px] border-[#171717] bg-white p-3 shadow-[0_46px_120px_rgba(0,0,0,0.22)]"
                >
                  <img src={artwork.src} alt={artwork.title} className="max-h-[720px] w-full rounded-[16px] object-cover" />
                </motion.div>
              </div>

              <aside className="flex flex-col justify-center p-8 md:p-14">
                <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">{artwork.edition}</span>
                <h2 className="mt-5 font-['Hanken_Grotesk'] text-[48px] font-[800] leading-[0.98] tracking-[-0.045em] text-[#111111] md:text-[76px]">
                  {artwork.title}
                </h2>
                <p className="mt-5 text-[18px] text-[#6E6E73]">{artwork.artist}</p>

                <div className="mt-10 grid grid-cols-2 gap-3">
                  {[
                    ['Dimensions', artwork.dimensions],
                    ['Medium', artwork.medium],
                    ['Frame', 'Museum black'],
                    ['Certificate', 'Verified'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[22px] border border-black/[0.06] bg-[#F5F5F7]/75 p-4">
                      <span className="block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                      <strong className="mt-2 block text-[14px] leading-snug text-[#111111]">{value}</strong>
                    </div>
                  ))}
                </div>

                <p className="mt-9 text-[16px] leading-[1.85] text-[#6E6E73]">{artwork.story}</p>

                <div className="mt-10 flex items-end justify-between border-t border-black/[0.06] pt-8">
                  <div>
                    <span className="text-[12px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Collector price</span>
                    <strong className="mt-1 block font-['Hanken_Grotesk'] text-[42px] font-[800] tracking-[-0.03em] text-[#111111]">{artwork.price}</strong>
                  </div>
                  <button
                    onClick={() => onSave(artwork.id)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                      saved ? 'border-[#C8A96B]/40 bg-[#C8A96B]/15 text-[#735b25]' : 'border-black/10 bg-white/70 text-[#111111]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                  <PrimaryButton onClick={() => onPurchase(artwork)}>Purchase Artwork</PrimaryButton>
                  <PrimaryButton subtle onClick={() => onSave(artwork.id)}>Save</PrimaryButton>
                  <button
                    className="rounded-full border border-black/10 bg-white/60 px-7 py-3.5 text-[14px] font-[700] text-[#111111] transition hover:bg-white sm:col-span-2"
                    type="button"
                  >
                    Commission Similar Style
                  </button>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CheckoutDrawer({ artwork, onClose, onComplete }) {
  return (
    <AnimatePresence>
      {artwork && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-0 top-0 z-[120] h-full w-full max-w-[520px] overflow-y-auto border-l border-black/[0.06] bg-[#F5F5F7]/94 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-[11px] font-[800] uppercase tracking-[0.2em] text-[#735b25]">Secure checkout</span>
              <h2 className="mt-1 font-['Hanken_Grotesk'] text-[36px] font-[800] tracking-[-0.035em] text-[#111111]">Almost yours.</h2>
            </div>
            <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111111]" type="button">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="mt-8 flex gap-4 rounded-[26px] border border-black/[0.06] bg-white/72 p-4 shadow-sm">
            <img src={artwork.src} alt={artwork.title} className="h-28 w-24 rounded-[18px] object-cover" />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[800] text-[#111111]">{artwork.title}</h3>
                <p className="text-[13px] text-[#6E6E73]">{artwork.artist}</p>
              </div>
              <strong className="text-[16px] text-[#111111]">{artwork.price}</strong>
            </div>
          </div>

          <form className="mt-8 space-y-4">
            {['Full name', 'Email', 'Shipping address', 'City', 'Postal code'].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                <input
                  className="h-14 w-full rounded-full border border-black/10 bg-white/72 px-5 text-[14px] text-[#111111] outline-none transition focus:border-[#111111]"
                  placeholder={label}
                />
              </label>
            ))}
          </form>

          <div className="mt-8 rounded-[28px] border border-black/[0.06] bg-white/72 p-5">
            <div className="flex justify-between text-[14px] text-[#6E6E73]">
              <span>Artwork</span>
              <span>{artwork.price}</span>
            </div>
            <div className="mt-3 flex justify-between text-[14px] text-[#6E6E73]">
              <span>Insured shipping</span>
              <span>$240</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-black/[0.06] pt-4 font-['Hanken_Grotesk'] text-[26px] font-[800] text-[#111111]">
              <span>Total</span>
              <span>${(priceValue(artwork.price) + 240).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="mt-7 w-full rounded-full bg-[#111111] px-7 py-4 text-[14px] font-[800] text-white transition active:scale-95"
            type="button"
          >
            Complete Purchase
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function Marketplace() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Curated');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [checkoutArtwork, setCheckoutArtwork] = useState(null);
  const [saved, setSaved] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const heroArtwork = artworks[0];

  const visibleArtworks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const selectedCategory = categoryMap[activeFilter];

    const filtered = artworks.filter((art) => {
      const matchesFilter = activeFilter === 'All' || art.category === selectedCategory;
      const matchesSearch =
        !query ||
        art.title.toLowerCase().includes(query) ||
        art.artist.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query) ||
        art.mood.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'Price high') return priceValue(b.price) - priceValue(a.price);
      if (sortBy === 'Price low') return priceValue(a.price) - priceValue(b.price);
      if (sortBy === 'Newest') return b.title.localeCompare(a.title);
      return artworks.indexOf(a) - artworks.indexOf(b);
    });
  }, [activeFilter, searchQuery, sortBy]);

  const toggleSave = (id) => {
    setSaved((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const purchaseArtwork = (artwork) => {
    setSelectedArtwork(null);
    setConfirmed(false);
    setCheckoutArtwork(artwork);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F5F7] font-['Inter'] text-[#111111]">
      <Navbar />

      <main className="pt-20">
        <section className="relative min-h-[calc(100vh-80px)] px-5 py-12 md:px-[80px] md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,169,107,0.13),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.9),transparent_24%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-190px)] max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
              <span className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[#735b25]">Artohie marketplace</span>
              <h1 className="mt-6 font-['Hanken_Grotesk'] text-[58px] font-[800] leading-[0.95] tracking-[-0.055em] text-[#111111] md:text-[104px]">
                Collect Exceptional Art.
              </h1>
              <p className="mt-7 max-w-md text-[19px] leading-[1.7] text-[#6E6E73]">
                Discover curated artwork from world-class creators.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <PrimaryButton onClick={() => document.getElementById('marketplace-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Art
                </PrimaryButton>
                <PrimaryButton subtle onClick={() => document.getElementById('featured-artists')?.scrollIntoView({ behavior: 'smooth' })}>
                  Featured Artists
                </PrimaryButton>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => setSelectedArtwork(heroArtwork)}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-[760px] text-left"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-[42px] border border-white/60 bg-white/46 p-4 shadow-[0_54px_150px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
              >
                <div className="rounded-[32px] border-[14px] border-[#171717] bg-white p-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
                  <img src={heroArtwork.src} alt={heroArtwork.title} className="aspect-[4/5] w-full rounded-[18px] object-cover" />
                </div>
                <div className="flex items-end justify-between gap-5 px-3 pb-2 pt-5">
                  <div>
                    <p className="text-[13px] font-[700] text-[#6E6E73]">{heroArtwork.artist}</p>
                    <h2 className="mt-1 font-['Hanken_Grotesk'] text-[30px] font-[800] tracking-[-0.03em] text-[#111111]">{heroArtwork.title}</h2>
                  </div>
                  <p className="text-[17px] font-[800] text-[#111111]">{heroArtwork.price}</p>
                </div>
              </motion.div>
            </motion.button>
          </div>
        </section>

        <section className="sticky top-20 z-40 px-5 md:px-[80px]">
          <div className="mx-auto max-w-[1440px] rounded-full border border-black/[0.06] bg-white/72 px-3 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.075)] backdrop-blur-2xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 rounded-full px-5 py-3 text-[13px] font-[800] transition duration-300 ${
                      activeFilter === filter
                        ? 'bg-[#111111] text-white shadow-[0_14px_34px_rgba(0,0,0,0.16)]'
                        : 'text-[#6E6E73] hover:bg-white hover:text-[#111111]'
                    }`}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="relative min-w-0 sm:w-[260px]">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-[#6E6E73]">search</span>
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-12 w-full rounded-full border border-black/[0.06] bg-[#F5F5F7]/78 pl-11 pr-4 text-[14px] outline-none transition focus:border-black/20"
                    placeholder="Search"
                    type="text"
                  />
                </label>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-12 rounded-full border border-black/[0.06] bg-[#F5F5F7]/78 px-5 pr-10 text-[14px] font-[700] text-[#111111] outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace-grid" className="px-5 pb-20 pt-20 md:px-[80px] md:pb-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Curated works</span>
                <h2 className="mt-2 font-['Hanken_Grotesk'] text-[42px] font-[800] tracking-[-0.045em] text-[#111111] md:text-[64px]">Quietly rare.</h2>
              </div>
              <p className="hidden max-w-sm text-right text-[15px] leading-[1.7] text-[#6E6E73] md:block">
                Minimal presentation for works that deserve room to breathe.
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              className="columns-1 gap-8 md:columns-2 xl:columns-3"
            >
              {visibleArtworks.map((art, index) => (
                <ArtworkCard
                  key={art.id}
                  art={art}
                  index={index}
                  onOpen={setSelectedArtwork}
                  onSave={toggleSave}
                  saved={saved.includes(art.id)}
                />
              ))}
            </motion.div>

            {visibleArtworks.length === 0 && (
              <div className="rounded-[30px] border border-black/[0.06] bg-white/72 p-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.045)]">
                <h3 className="font-['Hanken_Grotesk'] text-[30px] font-[800] tracking-[-0.03em] text-[#111111]">No artworks found</h3>
                <p className="mt-3 text-[#6E6E73]">Try a different filter or search.</p>
              </div>
            )}
          </div>
        </section>

        <section id="featured-artists" className="bg-[#eeeeef] px-5 py-20 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Featured artists</span>
                <h2 className="mt-2 font-['Hanken_Grotesk'] text-[40px] font-[800] tracking-[-0.04em] text-[#111111] md:text-[58px]">Creators to follow.</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {creators.map((creator, index) => (
                <motion.article
                  key={creator.name}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  whileHover={{ y: -7 }}
                  className="rounded-[28px] border border-black/[0.06] bg-white/72 p-5 shadow-[0_22px_56px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <div className="flex items-center gap-4">
                    <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-['Hanken_Grotesk'] text-[23px] font-[800] tracking-[-0.025em] text-[#111111]">{creator.name}</h3>
                      <p className="mt-1 truncate text-[12px] font-[800] uppercase tracking-[0.14em] text-[#735b25]">{creator.badge}</p>
                    </div>
                  </div>
                  <button className="mt-6 w-full rounded-full border border-black/10 bg-white/60 px-5 py-3 text-[13px] font-[800] text-[#111111] transition hover:bg-white" type="button">
                    Follow
                  </button>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto max-w-[1120px] rounded-[36px] border border-black/[0.06] bg-white/72 p-8 text-center shadow-[0_28px_80px_rgba(0,0,0,0.055)] backdrop-blur-xl md:p-14"
          >
            <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Private curation</span>
            <h2 className="mx-auto mt-4 max-w-3xl font-['Hanken_Grotesk'] text-[42px] font-[800] leading-[1.03] tracking-[-0.045em] text-[#111111] md:text-[64px]">
              Find the piece that makes the room feel complete.
            </h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PrimaryButton onClick={() => document.getElementById('marketplace-grid')?.scrollIntoView({ behavior: 'smooth' })}>Explore Collection</PrimaryButton>
              <PrimaryButton subtle onClick={() => setSelectedArtwork(heroArtwork)}>View Featured Work</PrimaryButton>
            </div>
          </motion.div>
        </section>
      </main>

      <ProductModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onPurchase={purchaseArtwork}
        onSave={toggleSave}
        saved={selectedArtwork ? saved.includes(selectedArtwork.id) : false}
      />
      <CheckoutDrawer
        artwork={checkoutArtwork}
        onClose={() => setCheckoutArtwork(null)}
        onComplete={() => {
          setConfirmed(true);
          setCheckoutArtwork(null);
        }}
      />

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[130] w-[calc(100%-32px)] max-w-[460px] -translate-x-1/2 rounded-full border border-black/[0.06] bg-white/86 px-5 py-4 text-center text-[14px] font-[800] text-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
          >
            Purchase request received. Artohie will confirm availability.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full border border-black/[0.06] bg-white/78 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.10)] backdrop-blur-2xl md:hidden">
        {[
          ['storefront', 'marketplace-grid'],
          ['person', 'featured-artists'],
          ['bookmark', 'marketplace-grid'],
        ].map(([icon, target]) => (
          <button
            key={icon}
            onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#111111] transition active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[21px]">{icon}</span>
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
}
