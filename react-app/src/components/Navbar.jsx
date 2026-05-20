import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    setArtist(api.getArtist());
    const handleAuthChange = () => {
      setArtist(api.getArtist());
    };
    window.addEventListener('artohie-auth', handleAuthChange);
    return () => {
      window.removeEventListener('artohie-auth', handleAuthChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const isSupabaseConfigured = 
        import.meta.env.VITE_SUPABASE_URL && 
        !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
        import.meta.env.VITE_SUPABASE_ANON_KEY &&
        !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Supabase signOut error:", err);
    } finally {
      api.logout();
      setArtist(null);
      navigate('/');
      window.dispatchEvent(new Event('artohie-auth'));
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  const navLinks = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/portfolio-generator', label: 'Portfolio' },
    { to: '/#profiles', label: 'Creators' },
    { to: '/feed', label: 'Feed' },
    { to: '/rankings', label: 'Rankings' },
    { to: '/commission', label: 'Commission' },
    { to: '/blog', label: 'Blog' },
  ];

  const isActive = (to) => {
    if (to === '/marketplace') return path === '/marketplace';
    if (to === '/portfolio-generator') return path === '/portfolio-generator';
    if (to === '/#profiles') return false;
    if (to === '/feed') return path === '/feed';
    if (to === '/rankings') return path === '/rankings';
    if (to === '/commission') return path === '/commission';
    if (to === '/blog') return path === '/blog';
    return false;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[60] bg-white/70 backdrop-blur-xl border-b border-black/10 shadow-[0_20px_40px_rgba(0,0,0,0.04)] h-20">
        <div className="flex justify-between items-center h-full px-5 md:px-[80px] max-w-[1440px] mx-auto">
          <Link to="/" className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter text-black hover:opacity-80 transition-opacity">
            Artohie
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              link.to === '/#profiles'
                ? <a
                    key={link.to}
                    href="/#profiles"
                    className="font-['Inter'] text-[14px] font-[500] text-[#444748] hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                : <Link
                    key={link.to}
                    to={link.to}
                    className={`font-['Inter'] text-[14px] font-[500] transition-colors ${
                      isActive(link.to)
                        ? 'text-black border-b border-black pb-1'
                        : 'text-[#444748] hover:text-black'
                    }`}
                  >
                    {link.label}
                  </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {artist ? (
              <>
                <Link to={`/artist-profile?id=${artist.id}`} className="font-['Inter'] text-[14px] font-[600] text-[#735b25] hover:text-black transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  {artist.displayName}
                </Link>
                <button onClick={handleSignOut} className="bg-black text-white font-['Inter'] text-[14px] font-[500] px-6 py-2.5 rounded-full hover:scale-95 transition-transform duration-200 inline-block">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="font-['Inter'] text-[14px] font-[500] text-black hover:text-[#735b25] transition-colors">
                  Sign In
                </Link>
                <Link to="/join" className="bg-black text-white font-['Inter'] text-[14px] font-[500] px-7 py-3 rounded-full hover:scale-95 transition-transform duration-200 inline-block">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="lg:hidden p-2 text-black focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-white pt-24 px-6 pb-6 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.to === '/#profiles'
                  ? <a
                      key={link.to}
                      href="/#profiles"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-['Hanken_Grotesk'] text-[24px] font-[600] text-black border-b border-black/5 pb-4"
                    >
                      {link.label}
                    </a>
                  : <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-['Hanken_Grotesk'] text-[24px] font-[600] border-b border-black/5 pb-4 transition-colors ${
                        isActive(link.to) ? 'text-[#735b25]' : 'text-black'
                      }`}
                    >
                      {link.label}
                    </Link>
              ))}
              
              <div className="flex flex-col gap-4 mt-8">
                {artist ? (
                  <>
                    <Link to={`/artist-profile?id=${artist.id}`} onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center border border-black/10 rounded-full font-['Inter'] text-[16px] font-[600] text-[#735b25] hover:bg-black/5 transition-colors flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      {artist.displayName}'s Studio
                    </Link>
                    <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} className="w-full py-4 text-center bg-black text-white rounded-full font-['Inter'] text-[16px] font-[600] active:scale-95 transition-transform">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center border border-black/10 rounded-full font-['Inter'] text-[16px] font-[600] text-black hover:bg-black/5 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center bg-black text-white rounded-full font-['Inter'] text-[16px] font-[600] active:scale-95 transition-transform">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
