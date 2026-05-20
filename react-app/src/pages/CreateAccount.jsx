import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { supabase } from '../utils/supabaseClient';

export default function CreateAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'artist';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      setError('Please fill in all required fields.');
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

      let userId;
      let sessionToken;

      if (isSupabaseConfigured) {
        // 1. Sign up user via Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        if (!authData?.user) {
          throw new Error('Supabase registration succeeded but user details were not returned.');
        }

        userId = authData.user.id;
        sessionToken = authData.session?.access_token;
      } else {
        // Local-only development fallback: Generate a random UUID locally
        userId = window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }

      // 2. Synchronize profile creation to backend database
      const registerRes = await api.register({
        userId,
        email,
        password, // For local fallback credentials hashing
        displayName: fullName,
        tagline: email,
        specialty: role === 'artist' ? (category || 'Digital Visual Creator') : 'Art Collector',
        role
      });

      // 3. Save active auth token and profile locally
      if (sessionToken) {
        api.setToken(sessionToken);
      } else if (registerRes.token) {
        api.setToken(registerRes.token);
      }

      // Save artist details locally
      if (registerRes.artist) {
        api.setArtist(registerRes.artist);
      }

      navigate('/');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
        setError('Connection Refused: Unable to connect to the backend API. Please ensure your Express backend server is running on port 5000 (locally) or your production backend URL is updated in vercel.json.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] selection:bg-[#fedb99]">
      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Left: Cinematic Visual */}
        <section className="hidden md:flex md:w-1/2 relative items-center justify-center bg-black overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 1.2 }}
              alt="Artohie Studio Atmosphere" 
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE1zLD8_rGJFq2uk7FDI1Pi76VkMdo0YbRW5Opz36ZYdch2ctC01FVqSlM-puJzAY5jkBZRPwiL66m_8Fp0jqRTESkwsn3q5upamAY48p1kV9aASlayHcnpKGTo_BlcEC-xI3ZTjVnOX0-S90WBAFRcrXUXiU-6-_xD-YLCfBRvmZB6-toEXznxHMLVLaqksHxbUzxImy1Pb9dwO60ZxWlgom0h0dhInMQGFGH2STOmCIkLD04vhWUwCCcHQ8j1RuCAut7QyOuYxw" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="relative z-10 px-[80px] text-white">
            <div className="mb-8">
              <Link to="/" className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter">Artohie</Link>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-['Hanken_Grotesk'] text-[64px] font-bold leading-[1.1] tracking-[-0.04em] max-w-md"
            >
              Where creators define the future.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 font-['Inter'] text-[18px] text-white/70 max-w-sm"
            >
              Join a community of elite artists and visionary collectors in an ecosystem designed for excellence.
            </motion.p>
          </div>
        </section>

        {/* Right: Signup Form */}
        <section className="flex-1 flex items-center justify-center p-6 md:p-[80px] bg-[#f9f9fb] relative">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#735b25]/10 rounded-full blur-[120px] -z-10"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card w-full max-w-[520px] rounded-xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="md:hidden flex justify-center mb-10">
              <Link to="/" className="font-['Hanken_Grotesk'] text-[24px] font-bold tracking-tighter text-black">Artohie</Link>
            </div>
            <div className="mb-10 text-center md:text-left">
              <Link to="/" className="inline-flex items-center gap-2 text-[#444748] hover:text-black transition-colors font-['Inter'] text-[14px] font-[600] mb-6">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Home
              </Link>
              <h1 className="font-['Hanken_Grotesk'] text-[32px] font-[600] leading-[1.2] text-black mb-2">Create Your Artohie Account</h1>
              <p className="font-['Inter'] text-[16px] text-[#444748]">
                {role === 'collector' ? 'Discover and collect creative masterpieces.' : 'Build your identity as an artist.'}
              </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] block uppercase tracking-widest" htmlFor="full-name">Full Name</label>
                  <input 
                    className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white/50 focus:ring-0 focus:border-black transition-all font-['Inter'] text-[16px] outline-none" 
                    id="full-name" 
                    placeholder="Alexander Arto" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] block uppercase tracking-widest" htmlFor="username">Username</label>
                  <input 
                    className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white/50 focus:ring-0 focus:border-black transition-all font-['Inter'] text-[16px] outline-none" 
                    id="username" 
                    placeholder="@alex_arto" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] block uppercase tracking-widest" htmlFor="email">Email Address</label>
                <input 
                  className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white/50 focus:ring-0 focus:border-black transition-all font-['Inter'] text-[16px] outline-none" 
                  id="email" 
                  placeholder="alexander@artohie.com" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] block uppercase tracking-widest" htmlFor="password">Password</label>
                <div className="relative">
                  <input 
                    className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white/50 focus:ring-0 focus:border-black transition-all font-['Inter'] text-[16px] outline-none" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPass ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444748] hover:text-black transition-colors" type="button" onClick={() => setShowPass(!showPass)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {role === 'artist' && (
                <div className="space-y-2">
                  <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] block uppercase tracking-widest" htmlFor="category">Primary Art Category (Optional)</label>
                  <select 
                    className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white/50 focus:ring-0 focus:border-black transition-all font-['Inter'] text-[16px] outline-none cursor-pointer" 
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="digital">Digital Surrealism</option>
                    <option value="minimal">Minimalist Photography</option>
                    <option value="sculpture">3D & Sculpture</option>
                    <option value="fine-art">Fine Art Painting</option>
                    <option value="motion">Motion Design</option>
                  </select>
                </div>
              )}
              <div className="pt-4 space-y-4">
                <button 
                  className="w-full h-14 bg-black text-white rounded-lg font-['Inter'] text-[14px] font-[500] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-black/5 flex-1"></div>
                  <span className="font-['Inter'] text-[12px] font-[600] text-[#444748]/60">OR</span>
                  <div className="h-px bg-black/5 flex-1"></div>
                </div>
                <button className="w-full h-14 border border-black/10 bg-white rounded-lg font-['Inter'] text-[14px] font-[500] text-black hover:bg-[#f3f3f5] hover:scale-98 active:scale-95 transition-all flex items-center justify-center gap-3" type="button">
                  <img alt="Google" className="w-5 h-5 grayscale hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzu_QbUAeWF9TDLR8aes1taKwpPF67ulsYVrm4e1bglCXSSvFdf7k5WeKQrEo1QsaZFGRH9YcIp4VXoIRB-TsZcTmJhztxhIQbdjSRZ8XsizgL21gjSfKbNmzK8OJ7_eDj2j6g5Dcchz2rz5XwpsYZ7dx-oCzQPLxGq61LA2639TAVV-Q5ICFZiwfAql2-tagfZ1fhicXIMu5TLfutBVmOcuBWW7mOvhsugUDP3sh2sJBt3tJ3Vo_Xue9n81PWMUNwv7fACiSP98w" />
                  Continue with Google
                </button>
              </div>
            </form>
            <div className="mt-10 text-center">
              <p className="font-['Inter'] text-[16px] text-[#444748]">
                Already have an account?
                <Link className="text-[#735b25] font-semibold hover:underline underline-offset-4 ml-1" to="/signin">Sign In</Link>
              </p>
            </div>
            <div className="mt-8 text-center">
              <p className="font-['Inter'] text-[12px] font-[600] text-[#444748]/40 leading-relaxed max-w-[300px] mx-auto">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
