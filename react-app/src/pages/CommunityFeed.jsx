import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Combined database of pre-loaded premium posts (including interactive videos)
const initialPosts = [
  {
    id: 101,
    name: 'AMARA OKAFOR',
    role: 'Fluid Simulation Designer',
    discipline: 'digital',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-fluid-colors-flowing-in-water-43301-large.mp4',
    title: 'Chromatic Liquefaction No. 1',
    desc: 'An interactive high-fidelity video rendering exploring variable gravitational pulls on colored ink suspended in light oil medium. Hover or click to play fluid currents.',
    aspect: 'aspect-video',
    likes: 3820,
    comments: [
      { id: 1, author: 'Sophia Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2t6sT7R2JjtmXM5okA3BAFL4xMgd-By5z-7Gc9E_nUtgbQyF0T7Jk6kb5Oacc5-l6vOCBIQYSLN4qwD8MHwVmyxn9SPcPlY1ml0xZnizDtPmJPM7gV-ifsKuwvSchIl9Vfhyzi04rrRciBf12f2dEybzPSAg5vSAhkIaJMTO4bsLabtUPQKk-KeB0JSE6aNAbYWExheM3gcJWUXtErRFcdsqKf3GNJF00er135XumPcVNASKem4_wI7R0La7DgAt7rLZmOZB15GA', text: 'This liquid flow is incredibly soothing. Love the organic mixing patterns!' }
    ],
    followed: false,
    isVideo: true
  },
  {
    id: 1,
    name: 'ELARA VANCE',
    role: 'Digital Abstractionist',
    discipline: 'digital',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_iQKQx1cLJAa9BWFTZNNXZfZ-turJCD2CZ_b2pwMICaYN1yNEt2uSKQmVHii9OomVl56iXJKakzS0q7FTlRO9toJZ03l_Ufn7zCcG0wVp9q6hr4BcUoT7JsKhU6aQ1Jyn2WIJhZLwIqYrDBJ1LMsHSgMygaHtUs341_TVilhsB16jD7EGq-fSypHXeJHHjOLtxxZOpNJhXXbbNyWPfHFzi_6gbK1wvSBimpruB0n5ulkhw7ufpDxPoNXt0uSglWFXyYrhYAqxTAg',
    artSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c',
    title: 'Ethereal Displacement No. 4',
    desc: 'An exploration of fluid dynamics translated into static digital forms. Part of the \'Quietude\' series, focusing on the intersection of artificial intelligence and human intuition.',
    aspect: 'aspect-[4/5]',
    likes: 2400,
    comments: [
      { id: 1, author: 'Sora Kim', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgxvIYYLoByUbtr0QEsK0GPDwKZPY-rbU7cGz7hRiHTRFmpzBSpIDk9WcyH3TceSh8CZ9qTEDoDFgbsXaffv0v-4e2tsnOvGytwtObDX8XpSb_U_NQ_Qw6Dq3FQ1T-gu7t3ysvWMKL6oVLe43b5gEaRuoorZPciOuQbhDHrk4X6YxPISFFoB4Z0dJkENB_FGSbA9ZnqEU40fcKqEXBRFXbANOBqexHoP3GzJ2bkZPQog4230ocAAJxIu0K0S7_oQY4-UpPcoa6JY', text: 'This is absolutely breathtaking, Elara! The balance of lavender tones is magnificent.' }
    ],
    followed: false
  },
  {
    id: 102,
    name: 'JULIAN CHEN',
    role: 'Generative Particle Architect',
    discipline: '3d',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgxvIYYLoByUbtr0QEsK0GPDwKZPY-rbU7cGz7hRiHTRFmpzBSpIDk9WcyH3TceSh8CZ9qTEDoDFgbsXaffv0v-4e2tsnOvGytwtObDX8XpSb_U_NQ_Qw6Dq3FQ1T-gu7t3ysvWMKL6oVLe43b5gEaRuoorZPciOuQbhDHrk4X6YxPISFFoB4Z0dJkENB_FGSbA9ZnqEU40fcKqEXBRFXbANOBqexHoP3GzJ2bkZPQog4230ocAAJxIu0K0S7_oQY4-UpPcoa6JY',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-glowing-gold-particles-moving-in-slow-motion-44443-large.mp4',
    title: 'Quantum Gold Suspension',
    desc: 'A procedural particle loop rendering 400,000 active nodes behaving under artificial magnetic waves. Press play to view the interactive timeline.',
    aspect: 'aspect-video',
    likes: 4290,
    comments: [],
    followed: true,
    isVideo: true
  },
  {
    id: 2,
    name: 'MARCUS KAI',
    role: 'Architectural Photographer',
    discipline: 'photography',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkfhfsm-Bto6C2bsqlrduAUcffFzFpgwvDcF6qEoIL_5j-j1BpjZPdgTLW7MHRuZnUn-SdG4SXrg11o0M2ZX8BMldkjMzLDwI_1hzdMIxI4MbEpXwUEePXlcVJJRUHsu90WRKrVimiLDxqki5OI1Km-UYPBVYZZFQQGXmR_egutPUjCk-zz7QcUzCCljEocfwlb0Cj_jJkWS8GAGbwEvht9vDlbnl2cziluEP5Hf5Dj7t3i6-jME6uCdA_y_tt4E31NhQfofYtSBE',
    artSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3XvOV9Z7d-mdBz0QTdWNiofitVuL3n5pdix-PtmGQcGpogXrLvDb9lNMb1jfZ1RIVUoHi-rVbVOWdT9HYEHHWXeXvKTz8ISC_OuEpAFvqRiJ4rzVY36i-eBXMTZEq5h8i4ZV3HZhjh-3gy15KrK1KxJFegPuF46RD7zzULER667MT265ipe2wmsd9xtWbP4ZCMVG_Thv0Vu7_9IcQbrBGqGx1NYCPeMncOtRn_shLfT9v3Ax-ibFEqMRcM9GiR0X0-QXhckGIF7w',
    title: 'Geometric Ascent',
    desc: 'Captured at the golden hour, this piece examines the intersection of urban density and atmospheric light. Minimalist framing allows the structure to breathe within the frame.',
    aspect: 'aspect-video',
    likes: 1900,
    comments: [
      { id: 1, author: 'Elena Vance', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_iQKQx1cLJAa9BWFTZNNXZfZ-turJCD2CZ_b2pwMICaYN1yNEt2uSKQmVHii9OomVl56iXJKakzS0q7FTlRO9toJZ03l_Ufn7zCcG0wVp9q6hr4BcUoT7JsKhU6aQ1Jyn2WIJhZLwIqYrDBJ1LMsHSgMygaHtUs341_TVilhsB16jD7EGq-fSypHXeJHHjOLtxxZOpNJhXXbbNyWPfHFzi_6gbK1wvSBimpruB0n5ulkhw7ufpDxPoNXt0uSglWFXyYrhYAqxTAg', text: 'Stunning framing, Marcus! The contrast of hard geometric lines with the warm sky is absolute perfection.' }
    ],
    followed: true
  },
  {
    id: 3,
    name: 'SOPHIA CHEN',
    role: '3D Sculptor',
    discipline: '3d',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2t6sT7R2JjtmXM5okA3BAFL4xMgd-By5z-7Gc9E_nUtgbQyF0T7Jk6kb5Oacc5-l6vOCBIQYSLN4qwD8MHwVmyxn9SPcPlY1ml0xZnizDtPmJPM7gV-ifsKuwvSchIl9Vfhyzi04rrRciBf12f2dEybzPSAg5vSAhkIaJMTO4bsLabtUPQKk-KeB0JSE6aNAbYWExheM3gcJWUXtErRFcdsqKf3GNJF00er135XumPcVNASKem4_wI7R0La7DgAt7rLZmOZB15GA',
    artSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkTjQxpbb7Wq1k3K4ugqnA3lfbGfTZhRicYKzq4JpP5L_EN5x5_k5uXMj_IHFE6RrgYPFDrvlSIj4Ds9r7L4QbQ8SIQE7iCFGYw96SXwjtWFlW5TajbZTbrvKJ1rMTOhjU9jk7WgOSzAqZg8kcm0tmT-9r2dLQ4BFtGik5VlqYBUIQHV5mBjoEhdS8pftq3E0LjZcexb9NGLkpfM31ZDShZuLWvgIN4sXq_X4mTs_oCGf2l7CD1c6grMLYQIqEjTK_9-Ni-6sVR2U',
    title: 'Luminescence Spiral',
    desc: 'A study in light diffraction and non-Euclidean geometry. This sculpture was generated using custom procedural nodes and manually refined for rhythmic balance.',
    aspect: 'aspect-square',
    likes: 3100,
    comments: [
      { id: 1, author: 'Elena Rossi', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgxvIYYLoByUbtr0QEsK0GPDwKZPY-rbU7cGz7hRiHTRFmpzBSpIDk9WcyH3TceSh8CZ9qTEDoDFgbsXaffv0v-4e2tsnOvGytwtObDX8XpSb_U_NQ_Qw6Dq3FQ1T-gu7t3ysvWMKL6oVLe43b5gEaRuoorZPciOuQbhDHrk4X6YxPISFFoB4Z0dJkENB_FGSbA9ZnqEU40fcKqEXBRFXbANOBqexHoP3GzJ2bkZPQog4230ocAAJxIu0K0S7_oQY4-UpPcoa6JY', text: 'The refractive index properties on this render are masterfully set up. Breathtaking details!' }
    ],
    followed: false
  }
];

// Interactive Stories/Highlights circular items
const storiesData = [
  { 
    id: 1, 
    name: 'Elena Rossi', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgxvIYYLoByUbtr0QEsK0GPDwKZPY-rbU7cGz7hRiHTRFmpzBSpIDk9WcyH3TceSh8CZ9qTEDoDFgbsXaffv0v-4e2tsnOvGytwtObDX8XpSb_U_NQ_Qw6Dq3FQ1T-gu7t3ysvWMKL6oVLe43b5gEaRuoorZPciOuQbhDHrk4X6YxPISFFoB4Z0dJkENB_FGSbA9ZnqEU40fcKqEXBRFXbANOBqexHoP3GzJ2bkZPQog4230ocAAJxIu0K0S7_oQY4-UpPcoa6JY', 
    art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrYISug61K96Z6dTOg2pJqVt23Nmy54Cq90WwDIZr02-AvEBqvtQ-2D1VdJlaCEwm_mHrnodSu_wzjbBy_ceGvAGmLs0hMIgUggD1k_2tN3D_6XY5eB_Yz095QiEfeG1MmfYuPKsvm9QvN_v49KIR22cSW50lNID-GeNY90Q-Ykm2bMWgDOL8N1mdObtS4dLJvp2h2Tf7tv8kTbkG26JrHqP1q5oysHNSrzzNWgrHIOsLGDq7BiRanwUFKjS4SKZI-ktWDuB-goyg', 
    tagline: 'Florence Studio: Live Oil Pouring' 
  },
  { 
    id: 2, 
    name: 'Sora Kim', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE1zLD8_rGJFq2uk7FDI1Pi76VkMdo0YbRW5Opz36ZYdch2ctC01FVqSlM-puJzAY5jkBZRPwiL66m_8Fp0jqRTESkwsn3q5upamAY48p1kV9aASlayHcnpKGTo_BlcEC-xI3ZTjVnOX0-S90WBAFRcrXUXiU-6-_xD-YLCfBRvmZB6-toEXznxHMLVLaqksHxbUzxImy1Pb9dwO60ZxWlgom0h0dhInMQGFGH2STOmCIkLD04vhWUwCCcHQ8j1RuCAut7QyOuYxw', 
    art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqNElWTpqdNoetCIhK8iYGFM3cKXu5S6hG1hMcixLGsEQ3KXgi9BQ9WnFkqFvlbYlZ6nnEBkNn_Zt9sNjt8jyXMUtZy2551YUBFk1-vDfT42IX1issvfXz9LJrLYURIdHp4ktTWBEFQ9JJQWL0XoekgwOHtKaCjGiHAgPbIi7psHlmV2Tmmsi-47f5lYLP-ShdxUpryp_xqCqlRJlSGcYvDuIq8PJ4HAVB_BuyGYp5HRYvVEGyvJ1fvLcZptVCeYGIYjjO0JSH4Jo', 
    tagline: 'Vector Drafts: Infinite Scale' 
  },
  { 
    id: 3, 
    name: 'Marcus Kai', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkfhfsm-Bto6C2bsqlrduAUcffFzFpgwvDcF6qEoIL_5j-j1BpjZPdgTLW7MHRuZnUn-SdG4SXrg11o0M2ZX8BMldkjMzLDwI_1hzdMIxI4MbEpXwUEePXlcVJJRUHsu90WRKrVimiLDxqki5OI1Km-UYPBVYZZFQQGXmR_egutPUjCk-zz7QcUzCCljEocfwlb0Cj_jJkWS8GAGbwEvht9vDlbnl2cziluEP5Hf5Dj7t3i6-jME6uCdA_y_tt4E31NhQfofYtSBE', 
    art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3XvOV9Z7d-mdBz0QTdWNiofitVuL3n5pdix-PtmGQcGpogXrLvDb9lNMb1jfZ1RIVUoHi-rVbVOWdT9HYEHHWXeXvKTz8ISC_OuEpAFvqRiJ4rzVY36i-eBXMTZEq5h8i4ZV3HZhjh-3gy15KrK1KxJFegPuF46RD7zzULER667MT265ipe2wmsd9xtWbP4ZCMVG_Thv0Vu7_9IcQbrBGqGx1NYCPeMncOtRn_shLfT9v3Ax-ibFEqMRcM9GiR0X0-QXhckGIF7w', 
    tagline: 'Golden Hour: Brute Geometric Angles' 
  },
  { 
    id: 4, 
    name: 'Sarah Miller', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c', 
    art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0l6F7tntS3Y_zipxrn6EHWw7FxWnaWCKgH_ehXrkXI4KHcnaltcp3WBNZi0CxXyz3m77Nn57-5o3TVf1VaLfATRbGHmj0AeolMlpT0hfIs1N4fxq2b6MVgRox79TX6njXEsjXQAnQdV6HijKdjNy2EkjPqd_T9vwE_CyoZaAr--mGPTeU8AlL92-PvuP1AUCl6NEWD1fMPsRdRpJw4Z-3ihjj_0ejwBPxVbBkNWW0ABzuLCcjaqR-w7iB_slgCJOE5Kj6uPtGDQ0', 
    tagline: 'Refractive Index Node Layout' 
  },
  { 
    id: 5, 
    name: 'Amara Okafor', 
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c', 
    art: 'https://assets.mixkit.co/videos/preview/mixkit-fluid-colors-flowing-in-water-43301-large.mp4', 
    tagline: 'Chromatic Oil Dispersion' 
  }
];

export default function CommunityFeed() {
  const [feedPosts, setFeedPosts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Real-time Search State (filters artists/creators and posts)
  const [searchQuery, setSearchQuery] = useState('');

  // Custom interactive modals state
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Floating heart particles (double-tap animation)
  const [floatingHearts, setFloatingHearts] = useState([]);

  // Post Composer State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDiscipline, setNewDiscipline] = useState('digital');
  const [composerOpen, setComposerOpen] = useState(false);

  // Likes, Bookmarks & Comments expand states
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [shareToastId, setShareToastId] = useState(null);

  // Auto close story overlay after 5 seconds
  useEffect(() => {
    if (selectedStory) {
      const timer = setTimeout(() => {
        setSelectedStory(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedStory]);

  // Handle follow toggle
  const handleToggleFollow = (postId) => {
    setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, followed: !p.followed } : p));
  };

  // Handle like toggle with animation triggers
  const handleToggleLike = (postId) => {
    const isCurrentlyLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  // Instagram-style double-tap to heart
  const handleDoubleTap = (e, postId) => {
    // Check if it was a double tap
    if (e.detail === 2) {
      if (!likedPosts[postId]) {
        handleToggleLike(postId);
      }
      
      // Spawn floating heart particle
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newHeart = { id: Date.now(), x, y };
      setFloatingHearts(prev => [...prev, newHeart]);

      // Remove particle after animation ends
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    }
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (postId) => {
    setBookmarkedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Delete post created by the user
  const handleDeletePost = (postId) => {
    setFeedPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Handle commenting
  const handleSubmitComment = (e, postId) => {
    e.preventDefault();
    const currentInput = commentInputs[postId] || '';
    if (!currentInput.trim()) return;

    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextId = p.comments.length + 1;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: nextId,
              author: 'You (Artist Curator)',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c',
              text: currentInput
            }
          ]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Handle sharing
  const handleShareClick = (postId) => {
    setShareToastId(postId);
    setTimeout(() => {
      setShareToastId(null);
    }, 2500);
  };

  // Publish dynamic new post to top of the feed
  const handlePublishPost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTgXL-hpfX-jDMkPVMeLRZi_CBJDQiagi5E2qvtdqeuPCWCsQNxrikj79eSNG-I1MXSg21_oA2iyoW4yEEe4xcSwjMSiRJwDD_FlNZHqqY-3qZOkhyENhiqlVhYOQR6R3LkjW6LacQOpdNR-EllGk8ngHaZV2A6MpSr2uMDvrADRP2rvTm9MHIC_NT-NK7uuZY9bJCdvJUCQd2tTEn1CTwfsefNEG8RKA6G_i0Ua2_NbAbgVV7tAjxn2t7_Yva6NNdwHr8CYsU1j8';
    const postImage = newImage.trim() || defaultImage;

    const newPost = {
      id: Date.now(),
      name: 'YOU (ARTIST CURATOR)',
      role: 'Elite Visual Creator',
      discipline: newDiscipline,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c',
      artSrc: postImage,
      title: newTitle,
      desc: newDesc,
      aspect: 'aspect-video',
      likes: 1,
      comments: [],
      followed: false,
      isUserGenerated: true
    };

    setFeedPosts(prev => [newPost, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setNewImage('');
    setComposerOpen(false);
  };

  // Real-time search calculations filtering by Artist Name or Post Title
  const matchedStories = storiesData.filter(story => 
    story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchedPosts = feedPosts.filter(post => 
    post.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter posts based on active discipline chip selection
  const filteredPosts = activeFilter === 'all' 
    ? matchedPosts 
    : matchedPosts.filter(p => p.discipline === activeFilter);

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] font-['Inter'] min-h-screen overflow-x-hidden pb-32">
      <Navbar />
      <main className="pt-40">
        
        {/* Stream Intro Header */}
        <section className="max-w-[1000px] mx-auto px-5 md:px-0 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-['Hanken_Grotesk'] text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.04em] text-black"
            >
              The Curated Stream.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-['Inter'] text-[18px] text-[#444748] mt-4 max-w-xl leading-relaxed"
            >
              A quiet space for high-fidelity inspiration. Search elite creators, view looping process videos, and share your visual legacy.
            </motion.p>
          </div>

          {/* Trigger button for post composer */}
          <motion.button 
            onClick={() => setComposerOpen(!composerOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white px-8 py-4 rounded-full font-['Inter'] text-[14px] font-[600] flex items-center gap-3 shadow-lg hover:shadow-black/10 transition-all outline-none"
          >
            <span className="material-symbols-outlined text-[20px]">{composerOpen ? 'close' : 'add'}</span>
            {composerOpen ? 'Close Composer' : 'Publish Artwork'}
          </motion.button>
        </section>

        {/* Real-time Artist & Artwork Search Input Bar */}
        <section className="max-w-[1000px] mx-auto px-5 md:px-0 mb-12">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#444748]/60 text-[22px]">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists, sculptors, and creative masterpieces..."
              className="w-full h-16 pl-14 pr-12 rounded-full border border-black/10 bg-white/70 backdrop-blur-md focus:ring-1 focus:ring-black focus:bg-white outline-none font-['Inter'] text-[16px] placeholder:text-[#444748]/50 shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-[#444748] hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </section>

        {/* Dynamic Circular Stories/Highlights Bar (Filtered by search) */}
        <section className="max-w-[1000px] mx-auto px-5 md:px-0 mb-16">
          <div className="flex gap-6 overflow-x-auto no-scrollbar py-4 border-b border-black/5">
            {matchedStories.length === 0 ? (
              <p className="font-['Inter'] text-sm text-[#444748]/50 italic">No matching artist highlights online...</p>
            ) : (
              matchedStories.map((story) => (
                <button 
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="flex flex-col items-center gap-2 group outline-none shrink-0"
                >
                  <div className="w-[76px] h-[76px] rounded-full p-1 bg-gradient-to-tr from-[#735b25] to-[#fedb99] group-hover:scale-105 active:scale-95 transition-transform duration-300">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                      <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={story.avatar} alt={story.name} />
                    </div>
                  </div>
                  <span className="font-['Inter'] text-[11px] font-[600] tracking-wider uppercase text-[#444748] group-hover:text-black">
                    {story.name.split(' ')[0]}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Social Feed Discipline Filters */}
        <section className="max-w-[1000px] mx-auto px-5 md:px-0 mb-16 flex items-center gap-3 overflow-x-auto no-scrollbar relative z-10">
          {[
            { id: 'all', label: 'All Stream' },
            { id: 'digital', label: 'Digital surrealism' },
            { id: 'photography', label: 'Photography' },
            { id: '3d', label: '3D & Sculpture' }
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className="px-6 py-3 rounded-full font-['Inter'] text-[13px] font-[600] uppercase tracking-wider relative shrink-0 transition-colors duration-300 outline-none cursor-pointer border border-black/5"
              style={{ 
                color: activeFilter === chip.id ? '#ffffff' : '#444748'
              }}
            >
              {activeFilter === chip.id && (
                <motion.div
                  layoutId="feedFilterPill"
                  className="absolute inset-0 bg-black rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              {chip.label}
            </button>
          ))}
        </section>

        {/* Premium Interactive Post Composer */}
        <AnimatePresence>
          {composerOpen && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-[1000px] mx-auto px-5 md:px-0 mb-16 overflow-hidden"
            >
              <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.04)] space-y-6">
                <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[600] text-black border-b border-black/5 pb-4">
                  Share New Masterpiece
                </h3>
                
                <form onSubmit={handlePublishPost} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider block">Artwork Title</label>
                      <input 
                        required
                        type="text" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Luminescence Displaced No. 9"
                        className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#f9f9fb] focus:ring-1 focus:ring-black outline-none font-['Inter'] text-[15px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider block">Discipline</label>
                      <select
                        value={newDiscipline}
                        onChange={(e) => setNewDiscipline(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#f9f9fb] focus:ring-1 focus:ring-black outline-none font-['Inter'] text-[15px] cursor-pointer"
                      >
                        <option value="digital">Digital Surrealism</option>
                        <option value="photography">Photography</option>
                        <option value="3d">3D & Sculpture</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider block">Artwork Image URL (Optional)</label>
                      <input 
                        type="text" 
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Paste premium image address..."
                        className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#f9f9fb] focus:ring-1 focus:ring-black outline-none font-['Inter'] text-[15px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] uppercase tracking-wider block">Description / Creative Process</label>
                    <textarea 
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      rows="3"
                      placeholder="Explain your procedural coordinates, lighting refraction indices, or painting textures..."
                      className="w-full p-4 rounded-xl border border-black/10 bg-[#f9f9fb] focus:ring-1 focus:ring-black outline-none font-['Inter'] text-[15px] resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-black/5">
                    <button 
                      type="submit" 
                      className="bg-black text-white px-8 py-3.5 rounded-full font-['Inter'] text-[14px] font-[600] hover:scale-98 active:scale-95 transition-all shadow-md"
                    >
                      Publish to Stream
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Dynamic Social Feed Streams */}
        <div className="flex flex-col gap-[120px] pb-[120px]">
          {filteredPosts.length === 0 ? (
            /* No search results fallback */
            <div className="max-w-[1000px] mx-auto text-center py-20 bg-white rounded-3xl border border-black/5 p-10 w-full">
              <span className="material-symbols-outlined text-[48px] text-[#444748] mb-4">find_in_page</span>
              <h3 className="font-['Hanken_Grotesk'] text-[22px] font-[600] text-black mb-2">No Social Posts Found</h3>
              <p className="font-['Inter'] text-[#444748] text-[15px]">We couldn't find any artists or art titles matching "{searchQuery}". Try searching for 'Elara' or 'Marcus'!</p>
            </div>
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              {filteredPosts.map((post) => {
                const hasLiked = likedPosts[post.id];
                const hasBookmarked = bookmarkedPosts[post.id];
                const showComments = expandedComments[post.id];
                const commentInput = commentInputs[post.id] || '';
                const isShareToastActive = shareToastId === post.id;

                return (
                  <motion.article 
                    key={post.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[1000px] mx-auto px-5 md:px-0 w-full"
                  >
                    <div className="flex flex-col gap-8 bg-white p-6 md:p-10 rounded-[32px] border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                      
                      {/* User Header Profile */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setSelectedArtist(post)}
                            className="w-12 h-12 rounded-full overflow-hidden border border-black/10 outline-none"
                          >
                            <img alt={post.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" src={post.avatar} />
                          </button>
                          <div>
                            <button 
                              onClick={() => setSelectedArtist(post)}
                              className="font-['Inter'] text-[14px] font-[600] text-black hover:text-[#735b25] transition-colors text-left"
                            >
                              {post.name}
                            </button>
                            <p className="font-['Inter'] text-[12px] font-[500] text-[#444748]">{post.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleFollow(post.id)}
                            className={`font-['Inter'] text-[12px] font-[600] tracking-wider uppercase px-5 py-2 rounded-full border transition-all ${
                              post.followed 
                                ? 'bg-[#eeeef0] border-transparent text-[#444748]' 
                                : 'bg-white border-[#735b25] text-[#735b25] hover:bg-[#735b25] hover:text-white'
                            }`}
                          >
                            {post.followed ? '✓ Following' : 'Follow'}
                          </button>

                          {/* Delete button only for user-generated posts */}
                          {post.isUserGenerated && (
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-[#444748] hover:text-[#ea4335] rounded-full hover:bg-black/5 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Featured Large Media Container (supports looped videos & images) */}
                      {post.isVideo ? (
                        <div className="relative group overflow-hidden rounded-2xl relative inner-border cursor-pointer select-none">
                          <div className="overflow-hidden bg-black aspect-video max-h-[550px] rounded-2xl">
                            {/* Premium Looped Video Showcase */}
                            <video 
                              controls
                              loop
                              muted
                              autoPlay
                              className="w-full h-full object-cover rounded-2xl"
                              src={post.videoSrc}
                            />
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={(e) => handleDoubleTap(e, post.id)}
                          className="relative group overflow-hidden rounded-2xl relative inner-border cursor-pointer select-none"
                        >
                          <div className="overflow-hidden bg-[#f3f3f5] aspect-[16/10] max-h-[550px] rounded-2xl relative">
                            <motion.img 
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              alt={post.title} 
                              className="w-full h-full object-cover" 
                              src={post.artSrc} 
                            />

                            {/* Floating hearts container */}
                            <AnimatePresence>
                              {floatingHearts.map((h) => (
                                <motion.div
                                  key={h.id}
                                  initial={{ opacity: 0, scale: 0.3, x: h.x - 24, y: h.y - 24 }}
                                  animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.4, 1.4, 0.5], y: h.y - 80 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className="absolute z-30 pointer-events-none"
                                >
                                  <span className="material-symbols-outlined text-[48px] text-[#ea4335]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    favorite
                                  </span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* Creative Description content */}
                      <div className="space-y-4">
                        <h2 className="font-['Hanken_Grotesk'] text-[28px] md:text-[34px] font-[600] leading-tight tracking-[-0.02em] text-black">
                          {post.title}
                        </h2>
                        <p className="font-['Inter'] text-[16px] text-[#444748] leading-relaxed">
                          {post.desc}
                        </p>
                      </div>

                      {/* Interactive Button Reactions Row */}
                      <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-4 flex-wrap gap-6 relative">
                        
                        {/* Social Reaction Buttons */}
                        <div className="flex items-center gap-8 md:gap-12">
                          
                          {/* Favorite button toggle */}
                          <button 
                            onClick={() => handleToggleLike(post.id)}
                            className="flex items-center gap-2.5 group cursor-pointer outline-none"
                          >
                            <motion.span 
                              animate={hasLiked ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
                              transition={{ duration: 0.4 }}
                              className="material-symbols-outlined text-[26px] transition-colors"
                              style={{ 
                                color: hasLiked ? '#ea4335' : '#444748',
                                fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0"
                              }}
                            >
                              favorite
                            </motion.span>
                            <span className="font-['Inter'] text-[13px] font-[600] text-[#444748]">
                              {post.likes.toLocaleString()}
                            </span>
                          </button>

                          {/* Expand comments block toggle */}
                          <button 
                            onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !showComments }))}
                            className="flex items-center gap-2.5 group cursor-pointer outline-none"
                          >
                            <span className="material-symbols-outlined text-[26px] group-hover:text-black transition-colors" style={{ color: '#444748' }}>
                              chat_bubble
                            </span >
                            <span className="font-['Inter'] text-[13px] font-[600] text-[#444748]">
                              {post.comments.length}
                            </span>
                          </button>

                          {/* Save/Bookmark button toggle */}
                          <button 
                            onClick={() => handleToggleBookmark(post.id)}
                            className="flex items-center gap-2.5 group cursor-pointer outline-none"
                          >
                            <span 
                              className="material-symbols-outlined text-[26px] transition-colors"
                              style={{ 
                                color: hasBookmarked ? '#735b25' : '#444748',
                                fontVariationSettings: hasBookmarked ? "'FILL' 1" : "'FILL' 0"
                              }}
                            >
                              bookmark
                            </span>
                            <span className="font-['Inter'] text-[13px] font-[600] text-[#444748]">
                              {hasBookmarked ? 'Saved' : 'Save'}
                            </span>
                          </button>

                          {/* Share link button */}
                          <button 
                            onClick={() => handleShareClick(post.id)}
                            className="flex items-center gap-2.5 group cursor-pointer outline-none relative"
                          >
                            <span className="material-symbols-outlined text-[26px] group-hover:text-black transition-colors" style={{ color: '#444748' }}>
                              share
                            </span>
                            <span className="font-['Inter'] text-[13px] font-[600] text-[#444748]">
                              Share
                            </span>

                            {/* Share Clipboard toast indicator overlay */}
                            <AnimatePresence>
                              {isShareToastActive && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: -45, scale: 1 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute bg-black text-white text-[11px] font-['Inter'] font-[600] tracking-wider uppercase px-4 py-2 rounded-lg whitespace-nowrap shadow-lg z-30"
                                >
                                  ✓ Link Copied!
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>

                        </div>
                      </div>

                      {/* Interactive Expandable Comments Drawer Thread */}
                      <AnimatePresence>
                        {showComments && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="border-t border-black/5 mt-6 pt-6 overflow-hidden space-y-6"
                          >
                            {/* Thread list */}
                            <div className="space-y-4">
                              {post.comments.length === 0 ? (
                                <p className="font-['Inter'] text-sm text-[#444748]/60 italic py-2">No comments yet. Be the first to share your thoughts!</p>
                              ) : (
                                post.comments.map((comm) => (
                                  <motion.div 
                                    key={comm.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-start gap-3 bg-[#f9f9fb] p-4 rounded-2xl border border-black/5"
                                  >
                                    <img alt={comm.author} className="w-8 h-8 rounded-full object-cover grayscale border border-black/10" src={comm.avatar} />
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-['Inter'] text-[13px] font-[600] text-black">{comm.author}</span>
                                      </div>
                                      <p className="font-['Inter'] text-[14px] text-[#444748] leading-relaxed">{comm.text}</p>
                                    </div>
                                  </motion.div>
                                ))
                              )}
                            </div>

                            {/* Submit comments form */}
                            <form 
                              onSubmit={(e) => handleSubmitComment(e, post.id)}
                              className="flex items-center gap-3 bg-[#f3f3f5] p-2.5 rounded-full border border-black/5"
                            >
                              <input 
                                required
                                value={commentInput}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                placeholder="Write a supportive comment..."
                                className="flex-1 bg-transparent border-none pl-4 pr-2 py-1 text-sm font-['Inter'] outline-none text-black placeholder:text-[#444748]/50 focus:ring-0"
                              />
                              <button 
                                type="submit" 
                                className="bg-black text-white px-5 py-2.5 rounded-full font-['Inter'] text-[12px] font-[600] hover:scale-95 active:scale-90 transition-all outline-none"
                              >
                                Post
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Older Masterpieces Trigger */}
        <div className="flex justify-center py-24">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 group cursor-pointer border border-black/10 bg-white px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <span className="font-['Inter'] text-[13px] font-[600] tracking-widest uppercase text-black">View Older Masterpieces</span>
            <span className="material-symbols-outlined text-black group-hover:translate-y-1 transition-transform">expand_more</span>
          </motion.button>
        </div>
      </main>

      {/* Full-screen Timed Story Overlay Player */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 flex flex-col justify-between p-6">
              
              {/* Slideshow image or video */}
              {selectedStory.art.endsWith('.mp4') ? (
                <video 
                  controls
                  loop
                  muted
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                  src={selectedStory.art}
                />
              ) : (
                <img className="absolute inset-0 w-full h-full object-cover opacity-90" src={selectedStory.art} alt={selectedStory.name} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
              
              {/* Top Progress bar & User metadata */}
              <div className="relative z-10 space-y-4">
                {/* Horizontal Progress Timeline */}
                <div className="h-1 bg-white/20 rounded-full overflow-hidden w-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                
                {/* User avatar & Name */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img className="w-10 h-10 rounded-full object-cover border border-white/20" src={selectedStory.avatar} alt={selectedStory.name} />
                    <div>
                      <span className="font-['Inter'] text-sm font-[600] text-white block uppercase tracking-wider">{selectedStory.name}</span>
                      <span className="font-['Inter'] text-[11px] text-white/70 block uppercase tracking-widest">Active Story</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center justify-center outline-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              {/* Bottom Tagline dialog details */}
              <div className="relative z-10 text-white space-y-6 mt-auto">
                <p className="font-['Inter'] text-[18px] font-[500] leading-relaxed italic text-white/95">
                  "{selectedStory.tagline}"
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="font-['Inter'] text-[11px] tracking-widest uppercase text-white/50">Est. Artohie Diaries</span>
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="bg-white text-black px-6 py-2.5 rounded-full font-['Inter'] text-[12px] font-[600] hover:scale-95 transition-transform"
                  >
                    Close Story
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artist Quick-View Drawer Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-xl w-full rounded-3xl p-8 border border-black/5 shadow-2xl relative space-y-8"
            >
              <button 
                onClick={() => setSelectedArtist(null)}
                className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors flex items-center justify-center outline-none"
              >
                <span className="material-symbols-outlined text-black text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-6">
                <img className="w-20 h-20 rounded-full object-cover grayscale border-2 border-[#735b25]/20" src={selectedArtist.avatar} alt={selectedArtist.name} />
                <div>
                  <h3 className="font-['Hanken_Grotesk'] text-[28px] font-bold text-black">{selectedArtist.name}</h3>
                  <p className="font-['Inter'] text-sm text-[#735b25] font-[600] uppercase tracking-wider">{selectedArtist.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-b border-black/5 py-4 text-center">
                <div>
                  <span className="block font-['Hanken_Grotesk'] text-[20px] font-bold text-black">1.2k</span>
                  <span className="block font-['Inter'] text-[11px] text-[#444748] uppercase tracking-wider">Followers</span>
                </div>
                <div>
                  <span className="block font-['Hanken_Grotesk'] text-[20px] font-bold text-black">48</span>
                  <span className="block font-['Inter'] text-[11px] text-[#444748] uppercase tracking-wider">Creations</span>
                </div>
                <div>
                  <span className="block font-['Hanken_Grotesk'] text-[20px] font-bold text-black">98%</span>
                  <span className="block font-['Inter'] text-[11px] text-[#444748] uppercase tracking-wider">Satisfaction</span>
                </div>
              </div>

              <div className="space-y-4">
                <span className="font-['Inter'] text-[11px] font-[600] uppercase tracking-widest text-[#444748] block">Featured Creation</span>
                
                {selectedArtist.isVideo ? (
                  <div className="rounded-2xl overflow-hidden aspect-video relative inner-border bg-black">
                    <video controls loop muted autoPlay className="w-full h-full object-cover" src={selectedArtist.videoSrc} />
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden aspect-video relative inner-border">
                    <img className="w-full h-full object-cover" src={selectedArtist.artSrc} alt={selectedArtist.title} />
                  </div>
                )}
                
                <h4 className="font-['Hanken_Grotesk'] text-[18px] font-[600] text-black leading-tight">{selectedArtist.title}</h4>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <button 
                  onClick={() => setSelectedArtist(null)}
                  className="flex-1 bg-[#eeeef0] text-[#444748] font-['Inter'] text-[14px] font-[600] py-3.5 rounded-full hover:bg-black/5 active:scale-95 transition-all outline-none"
                >
                  Close Profile
                </button>
                <button 
                  onClick={() => {
                    handleToggleFollow(selectedArtist.id);
                    setSelectedArtist(null);
                  }}
                  className="flex-1 bg-black text-white font-['Inter'] text-[14px] font-[600] py-3.5 rounded-full hover:scale-95 active:scale-90 transition-all outline-none"
                >
                  {selectedArtist.followed ? '✓ Following' : 'Follow Artist'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
