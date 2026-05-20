import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import PortfolioGenerator from './pages/PortfolioGenerator';
import ArtistProfile from './pages/ArtistProfile';
import ArtistRank from './pages/ArtistRank';
import CommunityFeed from './pages/CommunityFeed';
import CommissionArt from './pages/CommissionArt';
import SignIn from './pages/SignIn';
import CreateAccount from './pages/CreateAccount';
import JoinArtohie from './pages/JoinArtohie';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { supabase } from './utils/supabaseClient';
import { api } from './utils/api';

export default function App() {
  useEffect(() => {
    const syncSupabaseSession = async () => {
      const isSupabaseConfigured = 
        import.meta.env.VITE_SUPABASE_URL && 
        !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
        import.meta.env.VITE_SUPABASE_ANON_KEY &&
        !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

      if (!isSupabaseConfigured) return;

      const handleProfileSync = async (session) => {
        if (!session) return;
        const token = session.access_token;
        api.setToken(token);
        
        try {
          // Attempt to fetch existing profile details
          const profile = await api.getMe();
          api.setArtist(profile);
        } catch (err) {
          console.warn("Profile not found in backend SQLite DB. Auto-registering from Supabase identity...", err);
          const user = session.user;
          const userMetadata = user.user_metadata || {};
          
          try {
            const registerRes = await api.register({
              userId: user.id,
              email: user.email,
              displayName: userMetadata.full_name || userMetadata.name || user.email.split('@')[0],
              tagline: user.email,
              specialty: 'Digital Visual Creator',
              role: 'artist'
            });
            if (registerRes.artist) {
              api.setArtist(registerRes.artist);
            }
          } catch (regErr) {
            console.error("Failed to automatically synchronize profile:", regErr);
          }
        }
      };

      // 1. Check existing session on mount
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await handleProfileSync(session);
        }
      } catch (err) {
        console.error("Error retrieving Supabase session on mount:", err);
      }

      // 2. Set up listener for future auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          await handleProfileSync(session);
        } else if (event === 'SIGNED_OUT') {
          api.logout();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    let cleanup;
    syncSupabaseSession().then(unsub => {
      cleanup = unsub;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/portfolio-generator" element={<PortfolioGenerator />} />
        <Route path="/artist-profile" element={<ArtistProfile />} />
        <Route path="/rankings" element={<ArtistRank />} />
        <Route path="/feed" element={<CommunityFeed />} />
        <Route path="/commission" element={<CommissionArt />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/join" element={<JoinArtohie />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}
