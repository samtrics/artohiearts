import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Combined High-Fidelity Articles Database
const articlesData = {
  journal: [
    {
      id: 1,
      category: 'Art Business',
      title: 'Monetizing Minimalism: The Gallery Paradox',
      excerpt: 'How young artists are balancing creative purity with the demands of the digital market.',
      content: 'Minimalism, as a philosophy, calls for the removal of the superfluous. Yet in the digital economy, this restraint operates within a paradox: how do you sell less for more? This deep dive explores the mechanics of high-key conceptual galleries, the scarcity value of blank spaces, and how pioneering collectors validate silent, sculptural, digital creations over busy, hyper-detailed renderings.',
      author: 'Elena Vance',
      readTime: '8 Min Read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrYISug61K96Z6dTOg2pJqVt23Nmy54Cq90WwDIZr02-AvEBqvtQ-2D1VdJlaCEwm_mHrnodSu_wzjbBy_ceGvAGmLs0hMIgUggD1k_2tN3D_6XY5eB_Yz095QiEfeG1MmfYuPKsvm9QvN_v49KIR22cSW50lNID-GeNY90Q-Ykm2bMWgDOL8N1mdObtS4dLJvp2h2Tf7tv8kTbkG26JrHqP1q5oysHNSrzzNWgrHIOsLGDq7BiRanwUFKjS4SKZI-ktWDuB-goyg',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 2,
      category: 'Ecosystem & Tech',
      title: 'The Rise of Digital Provenance',
      excerpt: 'How blockchain technology is creating permanent digital legacy, protecting artist copyright, and revolutionizing historical provenance verification.',
      content: 'Historically, the journey of an artwork from a studio to a private gallery left a paper trail fraught with risk, forgery, and lost records. Modern cryptographic hashes solve this permanently. By nesting smart contract signatures right into the media metadata, digital provenance systems ensure artists receive a lifetime of secondary royalties while giving discerning collectors transparent, unalterable proof of original ownership.',
      author: 'Elena Rostova',
      readTime: '6 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6XlS1DEDynwhfwXqi-2-tS0xPKtdLHXYrdSaEsGpShfFmFwk-8jFb6qRw-KZaJqW-F1aIRMwKqUAGlF6acgqFOHEn7F-Z8ohftTKIo8BFjUsKU7ULIzMXnTVFm7g59buFdvWlp1C0VCZ-yVporlSro8p1pTkve_CltJSx8nk63bIWzd4pwugAqfV-toZO60z7muSXcT2IrUIKBPUzHR3NsLVZnkOTMc0uFt19S1zZeGyY94Tah-bU9a1LS_cF2VVVfYu3uMoN7xA',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 3,
      category: 'Ecosystem & Tech',
      title: 'Behind the Stepper: Dynamic Commissioning',
      excerpt: 'Understanding the proprietary algorithm that underpins the safe, encrypted interactions between elite collectors and global abstract artisans.',
      content: 'Artohies proprietary multi-step commissioning stepper is not just a UI element—it is powered by escrow-secured milestone locks. This article breaks down the mathematical verification that matches artist schedules with collector milestones, eliminating transaction friction and ensuring absolute satisfaction on both sides of custom artistic transactions.',
      author: 'Sarah Miller',
      readTime: '5 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0l6F7tntS3Y_zipxrn6EHWw7FxWnaWCKgH_ehXrkXI4KHcnaltcp3WBNZi0CxXyz3m77Nn57-5o3TVf1VaLfATRbGHmj0AeolMlpT0hfIs1N4fxq2b6MVgRox79TX6njXEsjXQAnQdV6HijKdjNy2EkjPqd_T9vwE_CyoZaAr--mGPTeU8AlL92-PvuP1AUCl6NEWD1fMPsRdRpJw4Z-3ihjj_0ejwBPxVbBkNWW0ABzuLCcjaqR-w7iB_slgCJOE5Kj6uPtGDQ0',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 4,
      category: "Editor's Exclusive",
      title: 'The Sculptural Silence of Digital Spaces',
      excerpt: 'An interview with architect turned digital artist, Sarah Kaine, on the evolution of structural beauty in non-physical realms.',
      content: 'Can silence have architectural weight? In Sarah Kaines latest exhibition, monumental white monolithic frames intersect within high-key endless voids. Sarah shares her journey from classical physical geometry to fluid non-physical spaces, detailing how virtual renders allow her to build impossible structures that ignore gravitational limitations but preserve spatial awe.',
      author: 'Sarah Kaine',
      readTime: '15 Min Read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBczcj2kEXq2xEeJ0rNh3goLWqZ2rFoDZJWtFo0UzKBe8Z4gD8St1QvOgIH6Jd9eFVf-nXe_eR9zDH_aYOE0b8kw25Au0BFE-oE0NHvKWQcy2txaAyleYe3EVsRFW2nhiTgH4iQ6zN5Tv-HZZLuskXy3-Qay7F2kRGxdX48F6QoRyG6-sjh27SowJ21aCXb_9Rsv8NkQaHx0_7E4YuOdeKuRXXgxx3v5s9zlD701Gf8SeB9lCiaBC4fjwu1_PgdLxsvovGaGGPi8ls',
      isBento: true
    },
    {
      id: 5,
      category: 'Art Philosophy',
      title: 'Minimalism as a Creative Paradigm',
      excerpt: 'A deep-dive discussion into quiet luxury visual aesthetics, geometric rhythm, and fluid design spaces in the 21st-century architectural stream.',
      content: 'Luxury is no longer loud. The modern paradigm centers on breathing space, structural clarity, and subtle, tactile materials. We discuss how geometric grids, monochromatic textures, and high-end typography interact to form modern aesthetic spaces that emphasize deep mental focus over brief visual noise.',
      author: 'Julian Voss',
      readTime: '10 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk4TG6SwjPv6r4zOdcFdZ2LRTzTg8riweVT7aVNH_pSFmznp8bD32BMNkDv1jcAKVjAKiYO7otR-ybdrsO2vkTAcQV2re-2N5qAqXTUcU19Wr_OGhYrM61wIGz0Zlaf3SsOXxuUDtDXLtluqOBH9z4hpG5YnkTDfYSTpBBCpJ9ra60MtDqfQAlhsWrcEiH3bJIWb5B9gLMGUfz-Pdwho0vJpfYiC6DjN3RqeiZ79NZHAfGkwmvaSoJxbX8ExyBcFmt1B1Vo4Qdg_U',
      aspect: 'aspect-[4/5]'
    }
  ],
  artists: [
    {
      id: 6,
      category: 'Featured Creator',
      title: 'Elena Rossi: The Quiet Vanguard of Monet',
      excerpt: 'An exploration of Elena’s fluid impressionism, detailing how she marries classic brushwork with procedural generative code structures.',
      content: 'Elena Rossi represents the modern synthesis of old and new. In her studio in Florence, classic oils are paired with high-performance laptops processing fluid-dynamic equations. Elena breaks down how she programs visual weight, allowing color channels to pool and mix algorithmically to create a physical-digital blend that is truly unique.',
      author: 'David Chen',
      readTime: '7 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgxvIYYLoByUbtr0QEsK0GPDwKZPY-rbU7cGz7hRiHTRFmpzBSpIDk9WcyH3TceSh8CZ9qTEDoDFgbsXaffv0v-4e2tsnOvGytwtObDX8XpSb_U_NQ_Qw6Dq3FQ1T-gu7t3ysvWMKL6oVLe43b5gEaRuoorZPciOuQbhDHrk4X6YxPISFFoB4Z0dJkENB_FGSbA9ZnqEU40fcKqEXBRFXbANOBqexHoP3GzJ2bkZPQog4230ocAAJxIu0K0S7_oQY4-UpPcoa6JY',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 7,
      category: 'Curator Talks',
      title: 'Curating the Future: Virtual Environments',
      excerpt: 'An inside look at how masters of 3D and generative installation space are rendering virtual ecosystems that simulate realistic light refraction.',
      content: 'With the emergence of premium spatial displays, the virtual gallery is no longer a static webpage. Curators are constructing immersive 3D installations where the lighting changes based on the user’s local clock. Julian Chen explores the technical layers of real-time ray-traced ambient lighting inside digital sanctuaries.',
      author: 'Julian Chen',
      readTime: '8 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbnbeIYWukBqCwd4S5wNCfQhymybh0rSJR0_fq57-d8pdfulCxhIINNcKW-u0twmCw-vTnt_oHqPaL6a7JleLUvQ2BaNJYcMJzvD8kksnGyuUJ5N3W-iBBYDad-WWDeBpFUcgd5qYaehOdiaIcRx5kpZ1yEtcptTiPUu_zqeWPFu2xcW5XJ8luLDxXmMET6bvnyku04Brugk-ZVBKt6WDEQIbS1D1pg35vWzZaQdJI_YjKbRsoQmE8mqZhMP_pkqC1fQs4myqSKxI',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 8,
      category: 'Interviews',
      title: 'Interstellar Rhythms: An Interview with Sora Kim',
      excerpt: 'We sit down with vector artist Sora Kim in her Seoul studio to talk about computational vector generation, procedural node systems, and the future of community-driven design curation.',
      content: 'Sora Kim’s fluid vectors feel organic yet mathematically perfect. She details her procedural workflow—translating natural mathematical algorithms like Fibonacci spirals into pure, resolution-independent digital canvases. Sora believes code is the ultimate brush of the 21st century.',
      author: 'Sora Kim',
      readTime: '9 Min Read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE1zLD8_rGJFq2uk7FDI1Pi76VkMdo0YbRW5Opz36ZYdch2ctC01FVqSlM-puJzAY5jkBZRPwiL66m_8Fp0jqRTESkwsn3q5upamAY48p1kV9aASlayHcnpKGTo_BlcEC-xI3ZTjVnOX0-S90WBAFRcrXUXiU-6-_xD-YLCfBRvmZB6-toEXznxHMLVLaqksHxbUzxImy1Pb9dwO60ZxWlgom0h0dhInMQGFGH2STOmCIkLD04vhWUwCCcHQ8j1RuCAut7QyOuYxw',
      aspect: 'aspect-[4/5]'
    }
  ],
  tutorials: [
    {
      id: 9,
      category: 'Tutorials',
      title: 'Mastering the Fluid State: Layering Techniques',
      excerpt: 'A masterclass in organic abstraction and the chemistry of metallic acrylics.',
      content: 'Metallic paints behave differently due to the suspension of real mineral particulates in acrylic medium. This tutorial lists exactly how to optimize dry times, create natural metallic currents, and seal finished high-contrast canvases with crystal-clear archival resin to ensure maximum depth.',
      author: 'Marcus Thorne',
      readTime: '12 Min Read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTgXL-hpfX-jDMkPVMeLRZi_CBJDQiagi5E2qvtdqeuPCWCsQNxrikj79eSNG-I1MXSg21_oA2iyoW4yEEe4xcSwjMSiRJwDD_FlNZHqqY-3qZOkhyENhiqlVhYOQR6R3LkjW6LacQOpdNR-EllGk8ngHaZV2A6MpSr2uMDvrADRP2rvTm9MHIC_NT-NK7uuZY9bJCdvJUCQd2tTEn1CTwfsefNEG8RKA6G_i0Ua2_NbAbgVV7tAjxn2t7_Yva6NNdwHr8CYsU1j8',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 10,
      category: 'Technical Guide',
      title: 'Mastering Light: Procedural Node Guide',
      excerpt: 'A comprehensive step-by-step tutorial on building atmospheric volume rendering and physically-correct glass shadows using dynamic Blender cycles nodes.',
      content: 'Rendering glass is notoriously difficult. This step-by-step tutorial explains the math behind Snell’s law, how to bypass refractive caustics using a Light Path node structure, and how to combine volumetric scatter layers to render breathtaking atmospheric shafts that look photorealistic.',
      author: 'Sarah Miller',
      readTime: '12 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0l6F7tntS3Y_zipxrn6EHWw7FxWnaWCKgH_ehXrkXI4KHcnaltcp3WBNZi0CxXyz3m77Nn57-5o3TVf1VaLfATRbGHmj0AeolMlpT0hfIs1N4fxq2b6MVgRox79TX6njXEsjXQAnQdV6HijKdjNy2EkjPqd_T9vwE_CyoZaAr--mGPTeU8AlL92-PvuP1AUCl6NEWD1fMPsRdRpJw4Z-3ihjj_0ejwBPxVbBkNWW0ABzuLCcjaqR-w7iB_slgCJOE5Kj6uPtGDQ0',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 11,
      category: 'Ecosystem & Tech',
      title: 'Vector Art: Scalability & Dynamic Formats',
      excerpt: 'Learn the architectural workflow to draft resolution-independent shapes, optimize SVG parameters, and package curated collections for web display.',
      content: 'Dynamic SVG formatting is the backbone of high-resolution screen displays. This tutorial covers dynamic viewBox parameters, line-weight scaling scripts, and modular node grouping that allows designers to deploy large-scale, interactive vectors without overloading client browsers.',
      author: 'Amara Okafor',
      readTime: '9 min read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqNElWTpqdNoetCIhK8iYGFM3cKXu5S6hG1hMcixLGsEQ3KXgi9BQ9WnFkqFvlbYlZ6nnEBkNn_Zt9sNjt8jyXMUtZy2551YUBFk1-vDfT42IX1issvfXz9LJrLYURIdHp4ktTWBEFQ9JJQWL0XoekgwOHtKaCjGiHAgPbIi7psHlmV2Tmmsi-47f5lYLP-ShdxUpryp_xqCqlRJlSGcYvDuIq8PJ4HAVB_BuyGYp5HRYvVEGyvJ1fvLcZptVCeYGIYjjO0JSH4Jo',
      aspect: 'aspect-[4/5]'
    },
    {
      id: 12,
      category: "Editor's Exclusive",
      title: 'Atmospheric Volume Rendering & Glass Caustics',
      excerpt: 'A masterclass in rendering physically-correct light transmissions, glass caustics, and volume scatter arrays in modern computational engines.',
      content: 'This advanced course unpacks architectural lighting dynamics. We learn how to build complex refraction arrays, configure procedural node coordinates, and execute pristine renderings that simulate luxury glass refraction under variable natural sun directions.',
      author: 'Sarah Miller',
      readTime: '15 Min Read',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBczcj2kEXq2xEeJ0rNh3goLWqZ2rFoDZJWtFo0UzKBe8Z4gD8St1QvOgIH6Jd9eFVf-nXe_eR9zDH_aYOE0b8kw25Au0BFE-oE0NHvKWQcy2txaAyleYe3EVsRFW2nhiTgH4iQ6zN5Tv-HZZLuskXy3-Qay7F2kRGxdX48F6QoRyG6-sjh27SowJ21aCXb_9Rsv8NkQaHx0_7E4YuOdeKuRXXgxx3v5s9zlD701Gf8SeB9lCiaBC4fjwu1_PgdLxsvovGaGGPi8ls',
      isBento: true
    }
  ]
};

const trendingArticles = [
  { rank: '01', title: 'The Rise of Neo-Brutalism in Interface Design', readTime: '5 min read' },
  { rank: '02', title: 'Finding Color in a Greyscale World', readTime: '8 min read' },
  { rank: '03', title: 'Why Physical Galleries are Adapting to AR', readTime: '10 min read' }
];

// Slidable Multi-image Hero slides database
const heroSlides = [
  {
    id: 1,
    tag: 'Featured Article',
    title: 'The Ethereal Future',
    description: 'Explore how digital dreamscapes are redefining the boundaries of fine art in the modern creator\'s landscape.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnO_s0I_RuCHVX9p3tVsifBoi1AMTj_dfVnLzNgLsD1qSTWVITwg-aSo8hgbySmZiNiXJKPX7ZC7GqBAFffrx2U1Obu8Q_tRgtVc55g0zEMQuLMEXo6C_mjwpWd7bzMZEhC5QqRO3azsSyJQ1MxAEakAKuR9dlu2N4zeZ19FK5LcXVijogaNRq94baQ1kfkpxXpXsfdqgLnvPOEnvMkD9dxDjSgybPf7Nd0veQArkqDCLyzr3pflFNq3MfWIAuW5G9TNXt5EZ9C2M',
  },
  {
    id: 2,
    tag: 'Art Philosophy',
    title: 'Minimalism As Paradigm',
    description: 'A deep-dive discussion into quiet luxury visual aesthetics, geometric rhythm, and fluid design spaces in the 21st-century architectural stream.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk4TG6SwjPv6r4zOdcFdZ2LRTzTg8riweVT7aVNH_pSFmznp8bD32BMNkDv1jcAKVjAKiYO7otR-ybdrsO2vkTAcQV2re-2N5qAqXTUcU19Wr_OGhYrM61wIGz0Zlaf3SsOXxuUDtDXLtluqOBH9z4hpG5YnkTDfYSTpBBCpJ9ra60MtDqfQAlhsWrcEiH3bJIWb5B9gLMGUfz-Pdwho0vJpfYiC6DjN3RqeiZ79NZHAfGkwmvaSoJxbX8ExyBcFmt1B1Vo4Qdg_U',
  },
  {
    id: 3,
    tag: 'Organic Abstraction',
    title: 'Fluid Acrylic Mastery',
    description: 'A masterclass in organic abstraction, metallic mineral dynamics, and the chemistry of acrylic pouring layering techniques.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTgXL-hpfX-jDMkPVMeLRZi_CBJDQiagi5E2qvtdqeuPCWCsQNxrikj79eSNG-I1MXSg21_oA2iyoW4yEEe4xcSwjMSiRJwDD_FlNZHqqY-3qZOkhyENhiqlVhYOQR6R3LkjW6LacQOpdNR-EllGk8ngHaZV2A6MpSr2uMDvrADRP2rvTm9MHIC_NT-NK7uuZY9bJCdvJUCQd2tTEn1CTwfsefNEG8RKA6G_i0Ua2_NbAbgVV7tAjxn2t7_Yva6NNdwHr8CYsU1j8',
  }
];

export default function Blog() {
  const [activeTab, setActiveTab] = useState('journal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Slider Carousel States
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = Next, -1 = Prev

  const [email, setEmail] = useState('');
  const [wideEmail, setWideEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [wideSubscribed, setWideSubscribed] = useState(false);

  // Auto cycle hero images every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  const handleNextSlide = () => {
    setSlideDirection(1);
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setSlideDirection(-1);
    setCurrentSlideIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleWideSubscribe = (e) => {
    e.preventDefault();
    if (wideEmail) {
      setWideSubscribed(true);
      setWideEmail('');
    }
  };

  // Filter combined data based on active tab and search query
  const rawArticles = articlesData[activeTab] || [];
  const filteredArticles = rawArticles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const fadeInScale = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // Carousel sliding animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.03
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.7 },
        scale: { duration: 0.7 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.7 },
        scale: { duration: 0.7 }
      }
    })
  };

  const activeSlide = heroSlides[currentSlideIndex];

  return (
    <div className="font-['Inter'] text-[#1a1c1d] bg-[#f9f9fb] selection:bg-[#ffdea0] selection:text-[#261a00] min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        
        {/* Cinematic Slidable Multi-image Hero Section */}
        <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.img 
                key={activeSlide.id}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover" 
                src={activeSlide.src} 
                alt={activeSlide.title}
              />
            </AnimatePresence>
          </div>

          {/* Glowing Arrow Navigation Controls */}
          <button 
            onClick={handlePrevSlide}
            className="absolute left-4 md:left-12 z-40 p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/15 hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">chevron_left</span>
          </button>
          
          <button 
            onClick={handleNextSlide}
            className="absolute right-4 md:right-12 z-40 p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/15 hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">chevron_right</span>
          </button>

          {/* Animated Hero Texts Overlay */}
          <div className="relative z-20 max-w-[1440px] px-10 md:px-20 text-white w-full mx-auto flex flex-col justify-between h-[65%] mt-10">
            <div className="max-w-2xl mt-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-['Inter'] text-[12px] font-[600] uppercase tracking-widest mb-6 block text-white/80">
                    {activeSlide.tag}
                  </span>
                  
                  <h1 className="font-['Hanken_Grotesk'] text-[50px] md:text-[76px] font-bold leading-none mb-8 tracking-tighter">
                    {activeSlide.title}
                  </h1>
                  
                  <p className="font-['Inter'] text-[18px] mb-10 text-white/90 max-w-lg leading-relaxed">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div>
                <a className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-['Inter'] text-[14px] font-[600] hover:scale-105 active:scale-95 transition-all shadow-lg" href="#content">
                  Read the Journal
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Bottom Progress Bar indicators */}
            <div className="flex gap-4 items-center justify-center sm:justify-start mt-12 z-20">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setSlideDirection(idx > currentSlideIndex ? 1 : -1);
                    setCurrentSlideIndex(idx);
                  }}
                  className="relative h-1 w-16 bg-white/20 rounded-full overflow-hidden transition-all outline-none"
                >
                  {currentSlideIndex === idx && (
                    <motion.div 
                      layoutId="activeSlideProgress"
                      className="absolute inset-0 bg-[#fedb99] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 6, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Categories Tab Bar & Interactive Real-time Search Box */}
        <section className="relative z-30 -mt-10 px-5 md:px-[80px]" id="content">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-4 rounded-3xl border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            
            {/* Sliding highlight tabs */}
            <div className="flex gap-1.5 bg-[#eeeef0] p-1.5 rounded-full relative w-full md:w-auto">
              {['journal', 'artists', 'tutorials'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery('');
                  }}
                  className="flex-1 md:flex-initial px-8 py-3 rounded-full font-['Inter'] text-[14px] font-[600] uppercase tracking-wider relative transition-colors duration-300 z-10 outline-none"
                  style={{ color: activeTab === tab ? '#ffffff' : '#444748' }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="blogHighlightPill"
                      className="absolute inset-0 bg-black rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            {/* Premium Dynamic Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#444748] text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-[#f3f3f5] border border-transparent rounded-full pl-11 pr-5 py-3 text-sm placeholder:text-[#444748]/50 focus:ring-1 focus:ring-black focus:bg-white outline-none font-['Inter'] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#444748] text-[18px] hover:text-black"
                >
                  close
                </button>
              )}
            </div>

          </div>
        </section>

        {/* Main Content Area: Editorial Grid + Sidebar */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-[80px] py-24 md:py-32 flex flex-col lg:flex-row gap-20">
          
          {/* Dynamic Grid Column */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-['Hanken_Grotesk'] text-[32px] font-[600] tracking-[-0.02em] text-black capitalize">
                {searchQuery ? `Search Results in ${activeTab}` : `Latest ${activeTab}`}
              </h2>
              <span className="font-['Inter'] text-[14px] font-[500] text-[#735b25]">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              /* No search results fallback */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-black/5 p-10"
              >
                <span className="material-symbols-outlined text-[48px] text-[#444748] mb-4">find_in_page</span>
                <h3 className="font-['Hanken_Grotesk'] text-[20px] font-[600] text-black mb-2">No Articles Found</h3>
                <p className="font-['Inter'] text-[#444748] text-sm">We couldn't find any articles matching your search query. Try checking another category.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab + searchQuery}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <AnimatePresence mode="popLayout">
                  {filteredArticles.map((art) => (
                    art.isBento ? (
                      /* Bento style card spanning 2 columns */
                      <motion.article 
                        key={art.id}
                        variants={fadeInScale}
                        layout
                        onClick={() => setSelectedArticle(art)}
                        className="md:col-span-2 group cursor-pointer flex flex-col md:flex-row gap-10 items-center bg-white p-8 rounded-3xl border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.02)]"
                      >
                        <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-2xl relative inner-border">
                          <img className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" src={art.src} alt={art.title} />
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                          <span className="font-['Inter'] text-[12px] font-[600] uppercase tracking-widest text-[#735b25]">{art.category}</span>
                          <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[600] leading-tight text-black group-hover:text-[#735b25] transition-colors">{art.title}</h3>
                          <p className="font-['Inter'] text-[16px] text-[#444748] leading-relaxed line-clamp-3">{art.excerpt}</p>
                          <div className="pt-4 flex items-center justify-between border-t border-black/5">
                            <span className="font-['Inter'] text-[14px] font-[600] text-black">By {art.author}</span>
                            <span className="font-['Inter'] text-[12px] text-[#444748] font-[500]">{art.readTime}</span>
                          </div>
                        </div>
                      </motion.article>
                    ) : (
                      /* Dynamic Vertical Card */
                      <motion.article 
                        key={art.id}
                        variants={fadeInScale}
                        layout
                        onClick={() => setSelectedArticle(art)}
                        whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0, 0, 0, 0.06)" }}
                        className="group cursor-pointer bg-white p-5 rounded-3xl border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative inner-border">
                            <img className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" src={art.src} alt={art.title} />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[#444748] font-['Inter'] text-[12px] font-[600] uppercase tracking-wider">
                              <span>{art.category}</span>
                              <span className="w-1 h-1 bg-[#444748]/30 rounded-full"></span>
                              <span>{art.readTime}</span>
                            </div>
                            <h3 className="font-['Hanken_Grotesk'] text-[22px] font-[600] text-black group-hover:text-[#735b25] transition-colors leading-[1.3]">{art.title}</h3>
                            <p className="font-['Inter'] text-[15px] text-[#444748] leading-relaxed line-clamp-2">{art.excerpt}</p>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-black/5 mt-6 flex items-center justify-between">
                          <span className="font-['Inter'] text-[14px] font-[600] text-black">By {art.author}</span>
                          <span className="material-symbols-outlined text-[#735b25] group-hover:translate-x-1.5 transition-transform text-[18px]">arrow_forward</span>
                        </div>
                      </motion.article>
                    )
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Elegant Sidebar */}
          <aside className="w-full lg:w-80 space-y-20">
            {/* Trending Now */}
            <section>
              <h4 className="font-['Inter'] text-[12px] font-[600] uppercase tracking-widest mb-10 text-[#444748] border-b border-black/5 pb-4">Trending Now</h4>
              <div className="space-y-10">
                {trendingArticles.map((trend) => (
                  <div key={trend.rank} className="flex gap-6 group cursor-pointer">
                    <span className="font-['Hanken_Grotesk'] text-[32px] font-bold text-black/15 leading-none transition-colors group-hover:text-[#735b25]/30">{trend.rank}</span>
                    <div>
                      <h5 className="font-['Inter'] text-[14px] font-[600] text-black leading-snug mb-2 group-hover:text-[#735b25] transition-colors">{trend.title}</h5>
                      <span className="font-['Inter'] text-[12px] text-[#444748]">{trend.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Newsletter Subscription Card */}
            <section className="bg-black text-white p-10 rounded-3xl space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#735b25]/15 blur-[50px] rounded-full"></div>
              <span className="material-symbols-outlined text-4xl text-[#fedb99] block" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              <h4 className="font-['Hanken_Grotesk'] text-[24px] font-[600] leading-tight text-white">Get inspired by the world’s most creative minds.</h4>
              <p className="font-['Inter'] text-[15px] text-white/70 leading-relaxed">A weekly curation of the finest art, insights, and creative tools delivered to your inbox.</p>
              
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#fedb99]/10 text-[#fedb99] p-4 rounded-xl text-center text-sm font-['Inter']"
                >
                  ✓ Thank you for subscribing!
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4 pt-4">
                  <input 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:ring-1 focus:ring-[#fedb99] focus:border-[#fedb99] outline-none font-['Inter'] text-sm" 
                    placeholder="Email Address" 
                    type="email"
                  />
                  <button type="submit" className="w-full bg-[#fedb99] text-[#261a00] font-['Inter'] text-[14px] font-[600] py-3.5 rounded-xl hover:bg-white hover:text-black transition-colors duration-200">
                    Join the Journal
                  </button>
                </form>
              )}
            </section>

            {/* Editor's Pick */}
            <section>
              <h4 className="font-['Inter'] text-[12px] font-[600] uppercase tracking-widest mb-10 text-[#444748] border-b border-black/5 pb-4">Editor's Pick</h4>
              <article className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden aspect-video mb-4 relative inner-border">
                  <img className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbsT2zpEUo-331TmmoqUHF4M5O7VloTk82g57W5W2k68Grh78Sp6J8QRfFSuo7MbK-7MNG2hWszNLduYuUF1yhjxPbRIM3s4LHMVSQzBVIu3M6kaPvLNmL9_4w75g1fOVR7H0Xh35jwf-y62KAyF23DLcFIusPmFrOA3dwtAVsfdzWk0eCQzRMQk0ajuBUv3T7C1cDjAyF5CyRUQpYGAjm_Ld9yX9pSf-WxtPzi7e0nuFK31VZZr8qDkTVIe64vCFdf5gDv6tuLpY" alt="Minimalist desk setup" />
                </div>
                <h5 className="font-['Hanken_Grotesk'] text-[18px] font-[600] mb-2 text-black group-hover:text-[#735b25] transition-colors leading-[1.3]">Curating Your Sanctuary: The Desk Setup</h5>
                <p className="font-['Inter'] text-[14px] text-[#444748] leading-relaxed">The psychological impact of workspace curation on artistic output.</p>
              </article>
            </section>
          </aside>
        </section>

        {/* Wide Interactive Newsletter Section */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-[80px] mb-40">
          <div className="bg-[#eeeef0] rounded-[2.5rem] p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
            <div className="max-w-xl relative z-10">
              <h2 className="font-['Hanken_Grotesk'] text-[40px] md:text-[56px] font-bold leading-tight mb-6 text-black">
                Stay Ahead of the <br/><span className="text-[#735b25] italic">Curve</span>
              </h2>
              <p className="font-['Inter'] text-[18px] text-[#444748] leading-relaxed">Join 20k+ creators receiving our monthly 'Deep Dive' on the state of global art culture.</p>
            </div>
            
            <div className="w-full lg:w-auto relative z-10">
              {wideSubscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 backdrop-blur-md text-black px-10 py-6 rounded-3xl border border-black/5 font-['Inter'] text-[16px] font-[600] text-center"
                >
                  ✓ Welcome! Check your inbox for our next deep-dive.
                </motion.div>
              ) : (
                <form onSubmit={handleWideSubscribe} className="flex flex-col sm:flex-row gap-4 w-full">
                  <input 
                    required
                    value={wideEmail}
                    onChange={(e) => setWideEmail(e.target.value)}
                    className="min-w-[300px] px-8 py-5 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-black outline-none font-['Inter'] text-[16px]" 
                    placeholder="Enter your email" 
                    type="email"
                  />
                  <button type="submit" className="bg-black text-white px-10 py-5 rounded-full font-['Inter'] text-[14px] font-[600] whitespace-nowrap hover:shadow-xl hover:scale-95 active:scale-90 transition-all">
                    Sign Up Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Spectacular "Read Article" Glassmorphism Overlay Drawer */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-full bg-[#f9f9fb] shadow-2xl p-8 md:p-12 overflow-y-auto flex flex-col justify-between border-l border-black/5 relative"
            >
              <div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 p-3 bg-black/5 hover:bg-black/10 rounded-full transition-colors flex items-center justify-center outline-none"
                >
                  <span className="material-symbols-outlined text-black text-[20px]">close</span>
                </button>

                <span className="font-['Inter'] text-[12px] font-[600] uppercase tracking-widest text-[#735b25] mb-4 block">
                  {selectedArticle.category}
                </span>

                <h2 className="font-['Hanken_Grotesk'] text-[32px] md:text-[42px] font-bold text-black leading-tight mb-6">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-4 text-[#444748] font-['Inter'] text-[13px] font-[600] mb-8 border-b border-black/5 pb-6">
                  <span>By {selectedArticle.author}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#444748]/30"></span>
                  <span>{selectedArticle.readTime}</span>
                </div>

                <div className="rounded-2xl overflow-hidden aspect-video mb-8 relative inner-border">
                  <img className="w-full h-full object-cover" src={selectedArticle.src} alt={selectedArticle.title} />
                </div>

                <p className="font-['Inter'] text-[18px] text-[#444748] leading-relaxed mb-6 font-[500] italic">
                  "{selectedArticle.excerpt}"
                </p>

                <p className="font-['Inter'] text-[16px] text-black leading-relaxed whitespace-pre-line">
                  {selectedArticle.content || 'This curated piece brings unique viewpoints from our elite creative ecosystem, detailing spatial rhythm, procedural generation, and global secondary marketplace models.'}
                </p>
              </div>

              <div className="mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-['Inter'] text-[12px] text-[#444748] font-[500]">© 2026 Artohie Editorial. All rights reserved.</span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-black text-white px-8 py-3.5 rounded-full font-['Inter'] text-[14px] font-[600] hover:scale-95 transition-transform"
                >
                  Close Article
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
