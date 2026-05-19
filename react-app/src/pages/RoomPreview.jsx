import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { artworks } from '../data/artohieEcosystem';

const wallColors = ['#E9E4DB', '#F5F5F7', '#D8DEE3', '#DDD3C4'];
const frames = [
  { name: 'Gallery Black', border: '#111111' },
  { name: 'Champagne Gold', border: '#C8A96B' },
  { name: 'Natural Oak', border: '#C7A77E' },
  { name: 'Floating White', border: '#ffffff' },
];

export default function RoomPreview() {
  const [roomImage, setRoomImage] = useState('');
  const [selectedArt, setSelectedArt] = useState(artworks[0]);
  const [wallColor, setWallColor] = useState(wallColors[0]);
  const [frame, setFrame] = useState(frames[0]);
  const [scale, setScale] = useState(44);
  const [shadow, setShadow] = useState(24);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) setRoomImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-['Inter'] text-[#111111]">
      <Navbar />
      <main className="pt-20">
        <section className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-[1fr_380px]">
          <div className="relative overflow-hidden" style={{ backgroundColor: wallColor }}>
            {roomImage ? (
              <img src={roomImage} alt="Uploaded room" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),rgba(0,0,0,0.04)),radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_28%)]" />
                <div className="absolute bottom-0 h-[26%] w-full bg-[linear-gradient(90deg,#d7c8b5,#f1eadf,#d8cbbb)]" />
                <div className="absolute bottom-[23%] left-0 h-px w-full bg-black/10" />
              </>
            )}

            <div className="absolute left-6 top-6 z-10 rounded-full border border-black/10 bg-white/70 px-5 py-3 text-[12px] font-[800] uppercase tracking-[0.16em] text-black backdrop-blur-xl">
              AI Room Preview
            </div>

            <motion.div
              drag
              dragMomentum={false}
              className="absolute left-1/2 top-[42%] cursor-grab active:cursor-grabbing"
              style={{ width: `${scale}%`, x: '-50%', y: '-50%' }}
            >
              <div
                className="rounded-[18px] bg-white p-3"
                style={{
                  border: `14px solid ${frame.border}`,
                  boxShadow: `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.28)`,
                }}
              >
                <img src={selectedArt.src} alt={selectedArt.title} className="aspect-[4/5] w-full rounded-[8px] object-cover" />
              </div>
            </motion.div>

            <div className="absolute bottom-6 left-6 right-6 rounded-[30px] border border-white/50 bg-white/70 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl md:right-auto md:w-[520px]">
              <h1 className="font-['Hanken_Grotesk'] text-[34px] font-[800] tracking-[-0.03em] text-black">Place art before you purchase.</h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6E6E73]">Upload a room, drag the artwork, resize it, test frames, and tune realistic shadow depth.</p>
            </div>
          </div>

          <aside className="border-l border-black/10 bg-white/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
            <span className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[#735b25]">Smart visualization</span>
            <h2 className="mt-2 font-['Hanken_Grotesk'] text-[38px] font-[800] tracking-[-0.04em] text-black">Room controls</h2>

            <label className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-black/20 bg-[#F5F5F7] p-8 text-center transition hover:bg-white">
              <span className="material-symbols-outlined text-[34px] text-[#735b25]">upload</span>
              <span className="mt-3 text-[13px] font-[800] text-black">Upload room photo</span>
              <span className="mt-1 text-[12px] text-[#6E6E73]">JPG or PNG mockup</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>

            <div className="mt-7 space-y-6">
              <div>
                <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Artwork</span>
                <div className="grid grid-cols-3 gap-3">
                  {artworks.slice(0, 6).map((art) => (
                    <button
                      key={art.id}
                      onClick={() => setSelectedArt(art)}
                      className={`overflow-hidden rounded-[18px] border p-1 ${selectedArt.id === art.id ? 'border-black bg-black' : 'border-black/10 bg-white'}`}
                    >
                      <img src={art.src} alt={art.title} className="aspect-[4/5] rounded-[14px] object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Wall color match</span>
                <div className="flex gap-3">
                  {wallColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setWallColor(color)}
                      className={`h-11 w-11 rounded-full border ${wallColor === color ? 'border-black ring-4 ring-black/10' : 'border-black/10'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Frame style</span>
                <div className="grid grid-cols-2 gap-3">
                  {frames.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => setFrame(option)}
                      className={`rounded-[18px] px-4 py-3 text-[12px] font-[800] ${frame.name === option.name ? 'bg-black text-white' : 'border border-black/10 bg-white text-black'}`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Smart scale</span>
                <input type="range" min="24" max="66" value={scale} onChange={(event) => setScale(event.target.value)} className="w-full accent-black" />
              </label>

              <label className="block">
                <span className="mb-3 block text-[11px] font-[800] uppercase tracking-[0.16em] text-[#6E6E73]">Realistic shadow</span>
                <input type="range" min="8" max="42" value={shadow} onChange={(event) => setShadow(Number(event.target.value))} className="w-full accent-black" />
              </label>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

