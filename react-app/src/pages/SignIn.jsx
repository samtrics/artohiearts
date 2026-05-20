import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { supabase } from '../utils/supabaseClient';

export default function SignIn() {
  const navigate = useNavigate();
  // Spotlight Hover state: null, 0, 1, or 2
  const [hoveredPicIndex, setHoveredPicIndex] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const isSupabaseConfigured = 
        import.meta.env.VITE_SUPABASE_URL && 
        !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
        import.meta.env.VITE_SUPABASE_ANON_KEY &&
        !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

      if (isSupabaseConfigured) {
        // 1. Sign in via Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        if (!authData?.session) {
          throw new Error('Supabase login succeeded but no session returned.');
        }

        // Save token locally
        const token = authData.session.access_token;
        api.setToken(token);

        // 2. Retrieve local database profile using the authenticated session token
        const profile = await api.getMe();
        api.setArtist(profile);
      } else {
        // Local fallback: login directly using Express credential database
        const loginRes = await api.login({ email, password });
        if (loginRes.token) {
          api.setToken(loginRes.token);
        }
        if (loginRes.artist) {
          api.setArtist(loginRes.artist);
        }
      }

      navigate('/');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
        setError('Connection Refused: Unable to connect to the backend API. Please ensure your Express backend server is running on port 5000 (locally) or your production backend URL is updated in vercel.json.');
      } else {
        setError(err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Dynamic animation and layout calculations based on hover spotlight state
  const getPicVariants = (idx, defaultZ) => {
    const isHovered = hoveredPicIndex === idx;

    return {
      opacity: isHovered ? 1 : 0.85,
      scale: isHovered ? 1.18 : 1,
      zIndex: isHovered ? 50 : defaultZ,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    };
  };

  return (
    <div className="bg-[#f9f9fb] font-['Inter'] text-[#1a1c1d] antialiased overflow-hidden">
      <main className="flex min-h-screen">
        {/* Left: Cinematic Art Showcase */}
        <section className="hidden lg:flex flex-1 relative bg-[#f3f3f5] overflow-hidden items-center justify-center cinematic-glow select-none">
          <div className="absolute top-10 left-[80px] z-20">
            <Link to="/" className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter text-black hover:opacity-80 transition-opacity">Artohie</Link>
          </div>
          <div className="relative w-full max-w-4xl px-[80px] z-10">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#735b25]/5 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-black/3 rounded-full blur-[120px]"></div>
            
            <div className="relative h-[600px] flex items-center justify-center">
              
              {/* Picture 1 */}
              <motion.div 
                animate={getPicVariants(0, 0)}
                onMouseEnter={() => setHoveredPicIndex(0)}
                onMouseLeave={() => setHoveredPicIndex(null)}
                className="absolute transform -translate-x-12 -translate-y-8 rotate-[-2deg] cursor-pointer"
              >
                {/* Independent vertical floating loop */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-56 h-80 rounded-xl overflow-hidden art-shadow inner-border bg-white shadow-xl">
                    <img className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuAUvAQ9VAPhAGZg1jgrSC_yCjzV_Wi04quP6_mf2qTWwF0k-5KNd86jl33qvZVKjQ3vuFAzvckDQ5FsKP81vc5LHd9W_qXSzsoSUZq-42obc7W1t0rj696TZD50tIR9i_usp97eaivmE-GchlbX4L7Mc-ElFUWHmXxczfmEZuJjb-bKC6XqOGDIACr3T2sLWBCSPEll6QNVzYWsBCH_zaE2Or_xgcWLv50OGS4hagCdWidr7gHOLBd7m1VJC7YNOl4XOjZ6iit2I"
                      alt="Art 1" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Picture 2 */}
              <motion.div 
                animate={getPicVariants(1, 10)}
                onMouseEnter={() => setHoveredPicIndex(1)}
                onMouseLeave={() => setHoveredPicIndex(null)}
                className="absolute transform translate-x-16 translate-y-12 rotate-[3deg] cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="w-64 h-[340px] rounded-xl overflow-hidden art-shadow inner-border bg-white shadow-2xl">
                    <img className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeT2pd2DtCNILPWtwpygEcdEYM22dNjZ1iEyPtJfkkqsLjm1pt2fBpFXit8f0XUHlVwxkFzwrwW0G504ATR8RT28WaWjS-s6kNnK7TYjV8cXJ-1teeAXdvlmeVDC1LBA5rZShq7cCdy3WrBtNoCstrVRVQNtNPxIm75Ho427-F8uKvOV654wspnWOaWGaFErH3JlbgDnHCaH6t9u_PqHIaRUk1MLayH89NaHs0dfqnB2u6NvZd-FmtqYWFYgP9FVmyrtOPkLjaUeQ"
                      alt="Art 2" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Picture 3 */}
              <motion.div 
                animate={getPicVariants(2, 20)}
                onMouseEnter={() => setHoveredPicIndex(2)}
                onMouseLeave={() => setHoveredPicIndex(null)}
                className="absolute transform -translate-x-32 translate-y-32 -rotate-[6deg] cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="w-36 h-36 rounded-xl overflow-hidden art-shadow border-4 border-white glass-card shadow-xl">
                    <img className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAqbGGC7zC3_ghZlCXjATDUMnibGyYuQQQ4WThBNn6E0EF7Y9BPbCOPsUQyPyG1AkB4nghSrNphuayqOl1r6X1zlDcQZAMqMX_TMoQywPdlghh1qYAl-dQ992cVli11BmcwnepxSJ4zyhVF_gjrytlVH-gvwUExcO9c84iAba-qCT1EDRHtlKiL9IJ2ndWDELRkD4FUqaTzJez_Fx_PobjA0hj3goO9V2yW-4BjanqEDCrALJTKoImGOA9WPNKgMuZtM3s6PmAy0M"
                      alt="Art 3" />
                  </div>
                </motion.div>
              </motion.div>

            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 text-left"
            >
              <h1 className="font-['Hanken_Grotesk'] text-[64px] font-bold leading-[1.1] tracking-[-0.04em] text-black mb-4">Where Artists<br />Build Identity.</h1>
              <p className="font-['Inter'] text-[18px] text-[#444748] max-w-md">The world's most sophisticated platform for creators to showcase, connect, and scale their digital legacy.</p>
            </motion.div>
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-[40px] lg:p-[80px] bg-[#f9f9fb] relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[480px] glass-card rounded-[32px] p-8 sm:p-12 relative z-10"
          >
            {/* Mobile Centered Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
                </div>
                <span className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter text-black">Artohie</span>
              </Link>
            </div>

            <div className="mb-10">
              <Link to="/" className="inline-flex items-center gap-2 text-[#444748] hover:text-black transition-colors font-['Inter'] text-[14px] font-[600] mb-6">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Home
              </Link>
              <h2 className="font-['Hanken_Grotesk'] text-[32px] font-[600] leading-[1.2] text-black mb-2">Welcome Back</h2>
              <p className="font-['Inter'] text-[16px] text-[#444748]">Continue your creative journey</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 font-['Inter'] text-[14px] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                <span>{error}</span>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider block" htmlFor="email">Email Address</label>
                <input 
                  className="w-full h-14 bg-white/50 border border-black/10 rounded-xl px-4 font-['Inter'] text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#785f29] focus:border-transparent transition-all" 
                  id="email" 
                  placeholder="artist@artohie.com" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider block" htmlFor="password">Password</label>
                  <a className="font-['Inter'] text-[12px] font-[600] text-[#735b25] hover:text-[#785f29] transition-colors" href="#">Forgot Password?</a>
                </div>
                <input 
                  className="w-full h-14 bg-white/50 border border-black/10 rounded-xl px-4 font-['Inter'] text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#785f29] focus:border-transparent transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                className="w-full h-14 bg-black text-white font-['Inter'] text-[14px] font-[500] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Continue'}
              </button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/5"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-transparent px-4 text-[#444748]/60 font-['Inter'] text-[12px] font-[600] uppercase">Or continue with</span>
                </div>
              </div>
              <button className="w-full h-14 bg-white border border-black/10 text-black font-['Inter'] text-[14px] font-[500] rounded-xl hover:bg-[#f3f3f5] hover:scale-98 active:scale-95 transition-all flex items-center justify-center gap-3" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </form>
            <div className="mt-12 text-center">
              <p className="font-['Inter'] text-[16px] text-[#444748]">
                Don't have an account?
                <Link className="text-black font-semibold hover:underline underline-offset-4 ml-1" to="/create-account">Create Account</Link>
              </p>
            </div>
          </motion.div>
          <div className="absolute bottom-10 right-10 text-[10px] uppercase tracking-widest text-[#444748]/30 font-semibold pointer-events-none">
          </div>
        </section>
      </main>
      <footer className="fixed bottom-0 w-full z-10 px-[80px] py-8 hidden lg:block">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto text-[#444748]/40">
          <div className="font-['Inter'] text-[12px] font-[600]">© 2024 Artohie. All rights reserved.</div>
          <div className="flex gap-8 font-['Inter'] text-[12px] font-[600]">
            {['Terms', 'Privacy', 'Support', 'Contact'].map((l) => (
              <a key={l} className="hover:text-black transition-colors" href="#">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
