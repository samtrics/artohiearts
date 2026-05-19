import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { artworks, creators } from '../data/artohieEcosystem';

const styles = [
  'Minimal Gallery',
  'Luxury Editorial',
  'Cinematic Portfolio',
  'Modern Creator',
  'Dark Luxury',
  'Apple Minimal',
  'Fashion Editorial',
  'Digital Exhibition',
];

const themes = [
  { name: 'Gallery White', surface: '#F8F8FA', ink: '#111111', accent: '#C8A96B', mood: 'Museum quiet' },
  { name: 'Collector Noir', surface: '#111111', ink: '#FFFFFF', accent: '#C8A96B', mood: 'Private exhibition' },
  { name: 'Soft Atelier', surface: '#F3ECE2', ink: '#17130D', accent: '#9B7444', mood: 'Warm editorial' },
];

const steps = [
  'Choose Portfolio Style',
  'Select Theme',
  'Upload Featured Artworks',
  'Customize Branding',
  'Preview Website',
  'Publish Portfolio',
];

const sections = [
  'Hero Section',
  'Featured Artworks',
  'Collections',
  'About Artist',
  'Commission Section',
  'Testimonials',
  'Blog',
  'Contact Section',
  'Social Links',
  'Footer',
];

const devices = ['Desktop', 'Tablet', 'Mobile'];

const analytics = [
  ['Portfolio visits', '48.2K', '+18%'],
  ['Artwork views', '216K', '+32%'],
  ['Commission requests', '84', '+12%'],
  ['Sales attributed', '$42K', '+21%'],
];

const aiTools = [
  ['AI portfolio generation', 'Create an entire branded structure from your artwork mood, bio, and goals.'],
  ['Auto layout suggestions', 'Rebalance galleries when you add new pieces or change the hero artwork.'],
  ['Smart artwork arrangement', 'Group works by color, mood, category, collector behavior, and edition status.'],
  ['AI color matching', 'Build a luxury palette from your featured pieces.'],
  ['SEO optimization', 'Generate metadata, social previews, alt text, sitemap notes, and titles.'],
];

const domainRows = [
  ['Artohie subdomain', 'elena-ro.artohie.com', 'Connected'],
  ['Artohie path', 'artohie.com/elena-ro', 'Live'],
  ['Custom domain', 'elenarostova.studio', 'Ready for DNS'],
];

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

function ActionButton({ children, dark = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-[800] transition duration-300 active:scale-95 ${
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

function PreviewWindow({ theme, device, style }) {
  const isDark = theme.surface === '#111111';
  const widthClass = device === 'Mobile' ? 'max-w-[330px]' : device === 'Tablet' ? 'max-w-[620px]' : 'max-w-[960px]';
  const gallery = artworks.slice(0, device === 'Mobile' ? 3 : 5);

  return (
    <motion.div
      key={`${theme.name}-${device}-${style}`}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`mx-auto w-full ${widthClass}`}
    >
      <div className="overflow-hidden rounded-[34px] border border-black/[0.06] shadow-[0_46px_130px_rgba(0,0,0,0.16)]" style={{ backgroundColor: theme.surface, color: theme.ink }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className={`rounded-full px-4 py-2 text-[11px] font-[800] uppercase tracking-[0.14em] ${isDark ? 'bg-white/10 text-white/65' : 'bg-black/5 text-[#6E6E73]'}`}>
            elena-ro.artohie.com
          </span>
        </div>

        <div className={`grid min-h-[620px] grid-cols-1 ${device === 'Desktop' ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''}`}>
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div>
              <span className="text-[12px] font-[800] uppercase tracking-[0.22em]" style={{ color: theme.accent }}>{style}</span>
              <h3 className="mt-5 font-['Hanken_Grotesk'] text-[46px] font-[800] leading-[0.95] tracking-[-0.055em] md:text-[72px]">
                Elena Rostova
              </h3>
              <p className={`mt-6 max-w-md text-[15px] leading-[1.8] ${isDark ? 'text-white/62' : 'text-[#6E6E73]'}`}>
                Fluid generative forms, collectible light studies, and private commissions for calm architectural spaces.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full px-6 py-3 text-[13px] font-[800] text-black" style={{ backgroundColor: theme.accent }} type="button">
                Explore Gallery
              </button>
              <button className={`rounded-full border px-6 py-3 text-[13px] font-[800] ${isDark ? 'border-white/18 text-white' : 'border-black/10 text-[#111111]'}`} type="button">
                Commission Artist
              </button>
            </div>
          </div>

          <div className={`grid gap-3 p-5 ${device === 'Mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {gallery.map((art, index) => (
              <motion.div
                key={art.id}
                animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0] }}
                transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
                className={`overflow-hidden rounded-[24px] p-2 ${isDark ? 'bg-white/8' : 'bg-white/68'} shadow-[0_24px_70px_rgba(0,0,0,0.12)]`}
              >
                <img src={art.src} alt={art.title} className={`w-full rounded-[18px] object-cover ${index === 0 ? 'aspect-[4/5]' : 'aspect-[1/1]'}`} />
                <div className="px-2 py-3">
                  <p className="truncate font-['Hanken_Grotesk'] text-[19px] font-[800]">{art.title}</p>
                  <span className={`text-[11px] font-[800] uppercase tracking-[0.12em] ${isDark ? 'text-white/48' : 'text-[#6E6E73]'}`}>{art.edition}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TemplateCard({ style, index, active, onSelect }) {
  const art = artworks[index % artworks.length];

  return (
    <motion.button
      onClick={() => onSelect(style)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, delay: index * 0.035 }}
      whileHover={{ y: -8 }}
      className={`group min-h-[360px] overflow-hidden rounded-[32px] border p-3 text-left shadow-[0_24px_70px_rgba(0,0,0,0.055)] backdrop-blur-xl transition ${
        active ? 'border-[#C8A96B]/50 bg-white/88 shadow-[0_28px_80px_rgba(200,169,107,0.12)]' : 'border-black/[0.06] bg-white/72'
      }`}
      type="button"
    >
      <div className="relative h-[250px] overflow-hidden rounded-[25px]">
        <img src={art.src} alt={style} className="h-full w-full object-cover transition duration-[1100ms] group-hover:scale-[1.045]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(0,0,0,0.44))]" />
        <div className="absolute bottom-4 left-4 right-4 rounded-[20px] border border-white/25 bg-white/72 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[#735b25]">Live template</p>
          <h3 className="mt-1 font-['Hanken_Grotesk'] text-[25px] font-[800] tracking-[-0.035em] text-[#111111]">{style}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 py-5">
        <p className="text-[13px] font-[700] text-[#6E6E73]">Fullscreen preview / responsive / SEO-ready</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-[#111111] text-white' : 'bg-[#F5F5F7] text-[#111111]'}`}>
          <span className="material-symbols-outlined text-[19px]">{active ? 'check' : 'arrow_forward'}</span>
        </span>
      </div>
    </motion.button>
  );
}

export default function PortfolioGenerator() {
  const [activeStyle, setActiveStyle] = useState(styles[1]);
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [device, setDevice] = useState('Desktop');
  const [accent, setAccent] = useState('#C8A96B');
  const [domain, setDomain] = useState('elena-ro.artohie.com');

  const creator = creators[0];
  const selectedTheme = useMemo(() => ({ ...activeTheme, accent }), [activeTheme, accent]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F5F7] font-['Inter'] text-[#111111] selection:bg-[#ffdea0] selection:text-[#261a00]">
      <Navbar />

      <main className="pt-20">
        <section className="relative min-h-[calc(100vh-80px)] px-5 py-14 md:px-[80px] md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,169,107,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.94),transparent_24%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-190px)] max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
              <span className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[#735b25]">Portfolio website generator</span>
              <h1 className="mt-6 font-['Hanken_Grotesk'] text-[56px] font-[800] leading-[0.95] tracking-[-0.06em] text-[#111111] md:text-[106px]">
                Build your luxury digital identity in minutes.
              </h1>
              <p className="mt-7 max-w-xl text-[19px] leading-[1.75] text-[#6E6E73]">
                Generate a cinematic artist website with galleries, collections, commissions, blogs, analytics, marketplace products, and custom domains.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ActionButton dark onClick={() => document.getElementById('generator-flow')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Building
                </ActionButton>
                <ActionButton onClick={() => document.getElementById('live-preview')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Live Preview
                </ActionButton>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[42px] border border-white/60 bg-white/45 p-4 shadow-[0_54px_150px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
              >
                <PreviewWindow theme={selectedTheme} device="Desktop" style={activeStyle} />
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-7 left-6 right-6 rounded-[28px] border border-black/[0.06] bg-white/82 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl md:left-auto md:w-[430px]"
              >
                <div className="flex items-center gap-4">
                  <img src={creator.avatar} alt={creator.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-[24px] font-[800] tracking-[-0.035em] text-[#111111]">{creator.name}</p>
                    <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-[#735b25]">Published at {domain}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="generator-flow" className="px-5 py-20 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Generator flow" title="Six calm steps." copy="A guided premium flow that feels closer to commissioning an identity system than editing a template." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.55, delay: index * 0.04 }}
                  className="rounded-[28px] border border-black/[0.06] bg-white/72 p-5 shadow-[0_22px_56px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-[13px] font-[900] text-white">0{index + 1}</span>
                  <h3 className="mt-6 font-['Hanken_Grotesk'] text-[24px] font-[800] leading-[1.05] tracking-[-0.035em] text-[#111111]">{step}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eeeeef] px-5 py-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Portfolio styles" title="Choose a world." copy="Premium template categories with cinematic previews, subtle motion, and creator-focused structure." />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {styles.map((style, index) => (
                <TemplateCard key={style} style={style} index={index} active={activeStyle === style} onSelect={setActiveStyle} />
              ))}
            </div>
          </div>
        </section>

        <section id="live-preview" className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-7 xl:grid-cols-[390px_1fr]">
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="h-fit rounded-[34px] border border-black/[0.06] bg-white/72 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            >
              <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Customizer</span>
              <h2 className="mt-3 font-['Hanken_Grotesk'] text-[38px] font-[800] leading-[1] tracking-[-0.045em] text-[#111111]">
                Framer-simple, Apple-calm.
              </h2>

              <div className="mt-8 space-y-7">
                <div>
                  <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Theme</span>
                  <div className="space-y-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => {
                          setActiveTheme(theme);
                          setAccent(theme.accent);
                        }}
                        className={`w-full rounded-[22px] border p-4 text-left transition ${
                          activeTheme.name === theme.name ? 'border-black bg-[#111111] text-white' : 'border-black/[0.08] bg-white/70 text-[#111111] hover:bg-white'
                        }`}
                        type="button"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <strong className="font-['Hanken_Grotesk'] text-[22px] font-[800] tracking-[-0.025em]">{theme.name}</strong>
                          <span className="h-7 w-7 rounded-full border border-white/40" style={{ backgroundColor: theme.accent }} />
                        </div>
                        <p className={`mt-2 text-[12px] font-[700] ${activeTheme.name === theme.name ? 'text-white/62' : 'text-[#6E6E73]'}`}>{theme.mood}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Accent color</span>
                  <div className="flex gap-3">
                    {['#C8A96B', '#111111', '#9B7444', '#7C8C83'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAccent(color)}
                        className={`h-11 w-11 rounded-full border ${accent === color ? 'border-black ring-4 ring-black/10' : 'border-black/10'}`}
                        style={{ backgroundColor: color }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Preview device</span>
                  <div className="grid grid-cols-3 gap-2 rounded-full border border-black/[0.06] bg-[#F5F5F7] p-1">
                    {devices.map((item) => (
                      <button
                        key={item}
                        onClick={() => setDevice(item)}
                        className={`rounded-full px-3 py-2.5 text-[12px] font-[800] transition ${device === item ? 'bg-[#111111] text-white' : 'text-[#6E6E73]'}`}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Section order</span>
                  <div className="space-y-2">
                    {sections.slice(0, 6).map((section, index) => (
                      <div key={section} className="flex items-center gap-3 rounded-[18px] border border-black/[0.06] bg-white/70 px-4 py-3">
                        <span className="material-symbols-outlined text-[18px] text-[#6E6E73]">drag_indicator</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F5F7] text-[11px] font-[800] text-[#6E6E73]">{index + 1}</span>
                        <span className="text-[13px] font-[800] text-[#111111]">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>

            <div className="rounded-[38px] border border-black/[0.06] bg-white/52 p-4 shadow-[0_38px_110px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <div className="mb-4 flex flex-col justify-between gap-3 px-2 md:flex-row md:items-center">
                <div>
                  <span className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#735b25]">Realtime preview</span>
                  <h3 className="font-['Hanken_Grotesk'] text-[30px] font-[800] tracking-[-0.035em] text-[#111111]">{activeStyle}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Optimized images', 'SEO metadata', 'Sitemap', 'Social preview'].map((item) => (
                    <span key={item} className="rounded-full border border-black/[0.06] bg-white/72 px-3 py-2 text-[11px] font-[800] uppercase tracking-[0.12em] text-[#6E6E73]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <PreviewWindow theme={selectedTheme} device={device} style={activeStyle} />
            </div>
          </div>
        </section>

        <section className="bg-[#eeeeef] px-5 py-24 md:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle eyebrow="Generated website" title="Everything an artist needs." copy="A complete portfolio structure for identity, sales, commissions, publishing, and collector trust." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              {sections.map((section, index) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.025 }}
                  whileHover={{ y: -6 }}
                  className="rounded-[26px] border border-black/[0.06] bg-white/72 p-5 shadow-[0_20px_54px_rgba(0,0,0,0.04)] backdrop-blur-xl"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8A96B]/15 text-[#735b25]">
                    <span className="material-symbols-outlined text-[19px]">check</span>
                  </span>
                  <h3 className="mt-5 font-['Hanken_Grotesk'] text-[23px] font-[800] leading-[1.05] tracking-[-0.03em] text-[#111111]">{section}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-7 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[36px] border border-black/[0.06] bg-white/72 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-10">
              <SectionTitle eyebrow="Custom domains" title="Publish with a signature." copy="Connect Artohie subdomains, paths, and personal domains through a calm settings flow." />
              <div className="space-y-3">
                {domainRows.map(([label, value, status]) => (
                  <button
                    key={value}
                    onClick={() => setDomain(value)}
                    className={`flex w-full flex-col justify-between gap-3 rounded-[24px] border p-5 text-left transition md:flex-row md:items-center ${
                      domain === value ? 'border-[#C8A96B]/45 bg-[#C8A96B]/10' : 'border-black/[0.06] bg-[#F5F5F7]/75 hover:bg-white'
                    }`}
                    type="button"
                  >
                    <div>
                      <span className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                      <p className="mt-1 font-['Hanken_Grotesk'] text-[26px] font-[800] tracking-[-0.035em] text-[#111111]">{value}</p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-4 py-2 text-[12px] font-[800] uppercase tracking-[0.14em] text-[#735b25]">{status}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-black/[0.06] bg-white/72 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-10">
              <SectionTitle eyebrow="Analytics" title="Know what moves collectors." />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {analytics.map(([label, value, trend], index) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                    transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-[26px] border border-black/[0.06] bg-[#F5F5F7]/78 p-5"
                  >
                    <span className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">{label}</span>
                    <strong className="mt-3 block font-['Hanken_Grotesk'] text-[34px] font-[800] tracking-[-0.035em] text-[#111111]">{value}</strong>
                    <p className="mt-1 text-[13px] font-[800] text-[#735b25]">{trend}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eeeeef] px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionTitle eyebrow="AI tools" title="Your identity, intelligently arranged." copy="Optional AI assists without turning the creator experience into a noisy dashboard." />
              <div className="flex flex-wrap gap-3">
                <ActionButton dark>Generate Portfolio With AI</ActionButton>
                <ActionButton>Optimize SEO</ActionButton>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {aiTools.map(([title, copy], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="rounded-[28px] border border-black/[0.06] bg-white/72 p-6 shadow-[0_22px_56px_rgba(0,0,0,0.045)] backdrop-blur-xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8A96B]/15 text-[#735b25]">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </span>
                  <h3 className="mt-5 font-['Hanken_Grotesk'] text-[25px] font-[800] tracking-[-0.03em] text-[#111111]">{title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.75] text-[#6E6E73]">{copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-[80px]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-7 lg:grid-cols-3">
            {[
              ['Marketplace integration', 'Sell artworks directly, connect products, showcase collections, and sync pricing from Artohie Marketplace.', 'storefront'],
              ['Commission infrastructure', 'Add style selection, pricing, reference upload, timeline, contact, and collector-ready inquiry flows.', 'palette'],
              ['Hosting and storage', 'Designed for Vercel hosting, Cloudinary images, PostgreSQL records, and fast global delivery.', 'cloud_done'],
            ].map(([title, copy, icon], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="rounded-[32px] border border-black/[0.06] bg-white/72 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.055)] backdrop-blur-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                  <span className="material-symbols-outlined">{icon}</span>
                </span>
                <h3 className="mt-7 font-['Hanken_Grotesk'] text-[32px] font-[800] leading-[1.04] tracking-[-0.04em] text-[#111111]">{title}</h3>
                <p className="mt-4 text-[15px] leading-[1.8] text-[#6E6E73]">{copy}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="px-5 pb-24 md:px-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mx-auto max-w-[1120px] rounded-[38px] border border-black/[0.06] bg-white/72 p-8 text-center shadow-[0_34px_100px_rgba(0,0,0,0.075)] backdrop-blur-xl md:p-14"
          >
            <span className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#735b25]">Publish portfolio</span>
            <h2 className="mx-auto mt-4 max-w-3xl font-['Hanken_Grotesk'] text-[44px] font-[800] leading-[1.02] tracking-[-0.05em] text-[#111111] md:text-[72px]">
              Launch a collector-ready website that feels unmistakably yours.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.75] text-[#6E6E73]">
              Portfolio, gallery, commissions, blog, marketplace products, SEO, analytics, and domain publishing in one luxury identity system.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ActionButton dark>Publish Portfolio</ActionButton>
              <ActionButton>Save Draft</ActionButton>
            </div>
          </motion.div>
        </section>
      </main>

      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full border border-black/[0.06] bg-white/78 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.10)] backdrop-blur-2xl md:hidden">
        {[
          ['dashboard_customize', 'generator-flow'],
          ['desktop_windows', 'live-preview'],
          ['rocket_launch', 'live-preview'],
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
