import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/signin" className="font-['Inter'] text-[14px] font-[500] text-black hover:text-[#735b25] transition-colors">
              Sign In
            </Link>
            <Link to="/join" className="bg-black text-white font-['Inter'] text-[14px] font-[500] px-7 py-3 rounded-full hover:scale-95 transition-transform duration-200 inline-block">
              Get Started
            </Link>
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
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center border border-black/10 rounded-full font-['Inter'] text-[16px] font-[600] text-black hover:bg-black/5 transition-colors">
                  Sign In
                </Link>
                <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center bg-black text-white rounded-full font-['Inter'] text-[16px] font-[600] active:scale-95 transition-transform">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
