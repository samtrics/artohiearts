import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function JoinArtohie() {
  const [selected, setSelected] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f9f9fb] font-['Inter'] text-[#1a1c1d] antialiased overflow-hidden">
      {/* Top Nav overlay */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-20 px-6 md:px-[80px] pointer-events-none">
        <div className="lg:hidden pointer-events-auto"></div>
        <div className="flex items-center gap-8 pointer-events-auto">
          <button className="font-['Inter'] text-[14px] font-[500] text-[#1a1c1d] hover:text-black transition-colors">Help Center</button>
        </div>
      </nav>

      <main className="flex h-screen w-full">
        {/* Left: Immersive Visual */}
        <section className="hidden lg:flex lg:w-1/2 relative h-full bg-black overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZlp7JBo5eIk5MNA7_mmMvfm5kqqEAqsj51LdU6HF6Y5wE9ryc1FO_HxfExFTTEcmXhow5qz4D9wuocSeCe9ILQtxd9jK1mUKRJ-x-v9oTnn7PANungIBCWTi-bKUyZGLTV_M-CLXnrx591j6ztHxqUYHYayVsL2UqDjpry8-4UKI2d83XN8MgKTjqxAdxzYITe-RpTFSJjlkQPMnYgquYMoGa7CVMm_w-ZTC-SpDmpl24u25_Nzqc2r733I40YBtpoIpmyBghcUc"
              alt="Gallery" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 p-[80px] flex flex-col justify-between w-full h-full">
            <Link to="/" className="flex items-center gap-2 group pointer-events-auto">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-black" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
              </div>
              <span className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter text-white">Artohie</span>
            </Link>
            <div className="max-w-md">
              <h2 className="font-['Hanken_Grotesk'] text-[64px] font-bold leading-[1.1] tracking-[-0.04em] text-white mb-6">The future of curation.</h2>
              <p className="font-['Inter'] text-[18px] text-white/70">
                Join an exclusive community of creators and visionaries defining the next era of digital and physical art.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Auth Card */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-5 md:p-[40px] lg:p-[80px] bg-[#f9f9fb] overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[520px] py-10"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-12">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
                </div>
                <span className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter text-black">Artohie</span>
              </Link>
            </div>

            <header className="mb-12">
              <Link to="/" className="inline-flex items-center gap-2 text-[#444748] hover:text-black transition-colors font-['Inter'] text-[14px] font-[600] mb-6">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Home
              </Link>
              <h1 className="font-['Hanken_Grotesk'] text-[32px] font-[600] leading-[1.2] text-black mb-2">Join Artohie</h1>
              <p className="font-['Inter'] text-[16px] text-[#444748]">Choose your role in the ecosystem</p>
            </header>

            {/* Selection Cards */}
            <div className="space-y-6 mb-12">
              {/* Artist */}
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative block cursor-pointer" 
                onClick={() => setSelected('artist')}
              >
                <div className={`glass-card selection-glow-artist p-8 rounded-xl transition-all duration-300 ${selected === 'artist' ? 'ring-2 ring-[#735b25] bg-white' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#e3c282]/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#735b25]" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
                        </div>
                      </div>
                      <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[600] text-black mb-1">Artist</h3>
                      <p className="font-['Inter'] text-[16px] text-[#444748]">Showcase and sell your artwork.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selected === 'artist' ? 'bg-[#735b25] border-[#735b25]' : 'border-[#c4c7c7] group-hover:border-[#735b25]'}`}>
                      {selected === 'artist' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </div>
              </motion.label>

              {/* Collector */}
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative block cursor-pointer" 
                onClick={() => setSelected('collector')}
              >
                <div className={`glass-card selection-glow-collector p-8 rounded-xl transition-all duration-300 ${selected === 'collector' ? 'ring-2 ring-black bg-white' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#e2e2e4] flex items-center justify-center">
                          <span className="material-symbols-outlined text-black">auto_awesome_motion</span>
                        </div>
                      </div>
                      <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[600] text-black mb-1">Collector</h3>
                      <p className="font-['Inter'] text-[16px] text-[#444748]">Discover and collect creative masterpieces.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selected === 'collector' ? 'bg-black border-black' : 'border-[#c4c7c7] group-hover:border-black'}`}>
                      {selected === 'collector' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </div>
              </motion.label>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <Link
                to={`/create-account?role=${selected}`}
                className={`w-full h-[56px] rounded-lg font-['Inter'] text-[14px] font-[500] transition-all flex items-center justify-center ${selected
                  ? 'bg-black text-white hover:scale-[0.98] active:scale-95'
                  : 'bg-black/20 text-white cursor-not-allowed pointer-events-none'}`}
              >
                Continue
              </Link>
              <div className="flex justify-center">
                <p className="font-['Inter'] text-[16px] text-[#444748]">
                  Already have an account?{' '}
                  <Link className="text-black font-semibold hover:underline decoration-1 underline-offset-4" to="/signin">Sign In</Link>
                </p>
              </div>
            </div>

            <footer className="mt-20 pt-8 border-t border-black/5 text-center">
              <p className="font-['Inter'] text-[12px] font-[600] text-[#444748]/60 leading-relaxed uppercase tracking-widest">
                Artohie © 2024 •{' '}
                <a className="hover:text-black transition-colors" href="#">Privacy</a>
                {' '}•{' '}
                <a className="hover:text-black transition-colors" href="#">Terms</a>
              </p>
            </footer>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
