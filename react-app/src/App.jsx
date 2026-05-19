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
export default function App() {
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
