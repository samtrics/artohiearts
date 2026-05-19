import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const imageHover = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -10,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="font-['Inter'] text-[#1a1c1d] selection:bg-[#ffdea0] selection:text-[#261a00]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-20 px-5 md:px-[80px] max-w-[1440px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="z-10"
            >
              <motion.h1 
                variants={fadeInUp}
                className="font-['Hanken_Grotesk'] text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.04em] mb-8 max-w-xl"
              >
                Where Artists Build Identity
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="font-['Inter'] text-[18px] leading-[1.6] text-[#444748] mb-12 max-w-lg"
              >
                A premium digital platform where creators showcase, connect, and sell their artwork globally.
              </motion.p>
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link to="/join" className="bg-black text-white px-8 py-4 font-['Inter'] text-[14px] font-[500] rounded-full shadow-lg hover:bg-black/90 hover:scale-95 transition-all duration-200">
                  Start Creating
                </Link>
                <Link to="/marketplace" className="border border-black px-8 py-4 font-['Inter'] text-[14px] font-[500] rounded-full hover:bg-black/5 hover:scale-95 transition-all duration-200">
                  View Gallery
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[600px] flex items-center justify-center"
            >
              {/* Animated Floating cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.12, rotate: 0, zIndex: 50, y: -25 }}
                className="absolute w-64 h-80 rounded-2xl overflow-hidden art-shadow rotate-[-6deg] translate-x-[-25px] translate-y-[-20px] z-10 inner-border cursor-pointer"
                style={{ transformOrigin: "center center" }}
              >
                <img alt="Abstract Art 1" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2k-8r00SUTv-sooR8OaU99EH1LHJClP1K40Pme-qZr5Ngwj2hZqqKHXcr6yuSulbaxmlzo24CSayPZ8T8K-wu1FKI8to0qlTZhORMVeJyebOKl9mp_hazrZvFHG58GutWfiwJNKDgvJ2Sv88vJevvjhaKvU4AR6xsMD3R3wf67REyRsrFA-F7SgWpBqXqsvhX900FkwirE7JA3ALONkA-dADC0DWiTFzErieLZXDWYhWrsx0N-xJtTr-3Lh6oUXG9NvtS3FbAJSM" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                whileHover={{ scale: 1.12, rotate: 0, zIndex: 50, y: -25 }}
                className="absolute w-72 h-96 rounded-2xl overflow-hidden art-shadow rotate-[2deg] z-20 inner-border cursor-pointer"
                style={{ transformOrigin: "center center" }}
              >
                <img alt="Abstract Art 2" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeT2pd2DtCNILPWtwpygEcdEYM22dNjZ1iEyPtJfkkqsLjm1pt2fBpFXit8f0XUHlVwxkFzwrwW0G504ATR8RT28WaWjS-s6kNnK7TYjV8cXJ-1teeAXdvlmeVDC1LBA5rZShq7cCdy3WrBtNoCstrVRVQNtNPxIm75Ho427-F8uKvOV654wspnWOaWGaFErH3JlbgDnHCaH6t9u_PqHIaRUk1MLayH89NaHs0dfqnB2u6NvZd-FmtqYWFYgP9FVmyrtOPkLjaUeQ" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.12, rotate: 0, zIndex: 50, y: -25 }}
                className="absolute w-64 h-80 rounded-2xl overflow-hidden art-shadow rotate-[8deg] translate-x-[25px] translate-y-[25px] z-10 inner-border cursor-pointer"
                style={{ transformOrigin: "center center" }}
              >
                <img alt="Abstract Art 3" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyZmrR8AyE_FSr3ZZ-G72_1tbnvjw-Imbq-RVco80I8ko3w_i07E0NTzMRQ1WPpjiBy5wQcxXwJoa7EQe6uUmEFxU0AExUL8Ny2yWYIGZ10vnEfegUvvpaR5FFlaCm8Qsjcu6hm3cTqLSCk_hRS4DsWJzk1ReokENA8eSyyqwQYd4LoQ91xVhrwQZAoZ4Hy20Rb4IbbNtdlH7w43BwJgDc1ODmYUxHtq61UJS1gYboBQq-NQYWc4bYz_GlKe1d-ugN8dEmbMbcFAU" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Trending Artworks */}
        <section className="py-[160px] px-5 md:px-[80px] max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <span className="font-['Inter'] text-[12px] font-[600] text-[#735b25] tracking-[0.2em] uppercase">Curated</span>
              <h2 className="font-['Hanken_Grotesk'] text-[32px] font-[600] leading-[1.2] tracking-[-0.02em] mt-2">Trending Artworks</h2>
            </div>
            <Link to="/marketplace" className="text-[#735b25] font-['Inter'] text-[14px] font-[500] border-b border-transparent hover:border-[#735b25] transition-all">
              Explore All
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="columns-1 md:columns-2 lg:columns-3 gap-[32px] space-y-[32px]"
          >
            {[
              { title: 'Ethereal Form I', artist: 'Elena Rostova', likes: '1.2k', aspect: 'aspect-[4/5]', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6XlS1DEDynwhfwXqi-2-tS0xPKtdLHXYrdSaEsGpShfFmFwk-8jFb6qRw-KZaJqW-F1aIRMwKqUAGlF6acgqFOHEn7F-Z8ohftTKIo8BFjUsKU7ULIzMXnTVFm7g59buFdvWlp1C0VCZ-yVporlSro8p1pTkve_CltJSx8nk63bIWzd4pwugAqfV-toZO60z7muSXcT2IrUIKBPUzHR3NsLVZnkOTMc0uFt19S1zZeGyY94Tah-bU9a1LS_cF2VVVfYu3uMoN7xA' },
              { title: 'Shadow Geometry', artist: 'Julian Chen', likes: '840', aspect: 'aspect-[1/1]', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbnbeIYWukBqCwd4S5wNCfQhymybh0rSJR0_fq57-d8pdfulCxhIINNcKW-u0twmCw-vTnt_oHqPaL6a7JleLUvQ2BaNJYcMJzvD8kksnGyuUJ5N3W-iBBYDad-WWDeBpFUcgd5qYaehOdiaIcRx5kpZ1yEtcptTiPUu_zqeWPFu2xcW5XJ8luLDxXmMET6bvnyku04Brugk-ZVBKt6WDEQIbS1D1pg35vWzZaQdJI_YjKbRsoQmE8mqZhMP_pkqC1fQs4myqSKxI' },
              { title: 'Luminous Void', artist: 'Sarah Miller', likes: '2.4k', aspect: 'aspect-[3/4]', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0l6F7tntS3Y_zipxrn6EHWw7FxWnaWCKgH_ehXrkXI4KHcnaltcp3WBNZi0CxXyz3m77Nn57-5o3TVf1VaLfATRbGHmj0AeolMlpT0hfIs1N4fxq2b6MVgRox79TX6njXEsjXQAnQdV6HijKdjNy2EkjPqd_T9vwE_CyoZaAr--mGPTeU8AlL92-PvuP1AUCl6NEWD1fMPsRdRpJw4Z-3ihjj_0ejwBPxVbBkNWW0ABzuLCcjaqR-w7iB_slgCJOE5Kj6uPtGDQ0' },
            ].map((art, idx) => (
              <motion.div 
                key={art.title} 
                variants={fadeInUp}
                whileHover="hover"
                initial="rest"
                className="break-inside-avoid bg-white p-4 rounded-3xl shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500 group"
              >
                <div className={`rounded-2xl overflow-hidden ${art.aspect} relative inner-border`}>
                  <motion.img 
                    variants={imageHover}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0" 
                    src={art.src} 
                    alt={art.title} 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button className="bg-white/90 backdrop-blur-md p-3 rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                    <button className="bg-white/90 backdrop-blur-md p-3 rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                      <span className="material-symbols-outlined">bookmark</span>
                    </button>
                  </div>
                </div>
                <div className="mt-6 px-2 flex justify-between items-center">
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-[18px] font-[600]">{art.title}</p>
                    <p className="font-['Inter'] text-[12px] font-[600] text-[#444748]">by {art.artist}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#444748]">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span className="font-['Inter'] text-[12px] font-[600]">{art.likes}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Artists */}
        <section className="py-[160px] bg-[#f3f3f5] border-y border-black/5" id="profiles">
          <div className="px-5 md:px-[80px] max-w-[1440px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <span className="font-['Inter'] text-[12px] font-[600] text-[#735b25] tracking-[0.2em] uppercase">Profiles</span>
              <h2 className="font-['Hanken_Grotesk'] text-[32px] font-[600] leading-[1.2] tracking-[-0.02em] mt-2">Featured Artists</h2>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { name: 'Elena Rostova', role: 'Elite Creator', bio: 'Specializing in fluid generative forms and monochromatic light installations.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqgzW8g9vVev-WhVxsFTg0GBOtCmwxFJvPrQoekQ5Jx3_IKhwE_9VfKIVBlVeylflV4ZK5uCxB5PB7bJrZ2ClBti-JXhT4eXq4UVIwgNDz7iuMqnGkSadQJla_o9GsGzE1Sas0CjHWiVfqI8_f6bL0Zol1l4s_OTXhiRSD9OxRTRXF6dNRSTBzhB74aoJYhVR20dYarOPCCnRKquVyfcb4zSU8YVNwbRR43lV0Bzm4azbwv8bTr3XnNMes5QzYq39lzqUah3tQ2ak' },
                { name: 'Julian Chen', role: 'Pro Curator', bio: 'Architectural photographer exploring the intersection of light and concrete.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjBVm5Jd-JOCSrI1lCCvBabEssgkz25-QOzgnrSW81ECjPjfjOVfBygD6RhGHjoXZ1-DfD1FLvMvfuYadQfZsF1cYi5DL9S-Gsgxz_fI6sNVPOwLVcU2mry92aQtd19Jc-eR2gBvJ7yOZKmHBLoGVfway_SA3UtJoGKE06hA4KZ67_cQOpP2ELy3xeGTldekvB5ufk7RN13TW7OM5yO2E6uerKSWDO61QQ5H4WvMWk1dCl3jjSwnUE52e2OVH2iJ28Vw-aXzqhDQ' },
                { name: 'Sarah Miller', role: 'Master Artisan', bio: '3D installation artist creating immersive virtual glass environments.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9kcp8OUR1CIPaxguLwsVXXheH1hauur8XQ_DOR6rF9VImjSO0pmf4xdFBgFuANMLfODYgyGFDHt3WpZku0NcUzX7FFO_Y025R0rB2zdD9XqweSefG5vNJKdZ_RBnQko8W8ZG5O3bCSoCs7aSUC15tHLvd1o9kuSFgGPvHJ8Gh2YQzbwzMwmbRuCFHzCpwMngt2DvlbAN0mEWmHgxYpIeccOfFyudiGfd37FYGoyxd93iawQNqGcuMRBS9wQQhDEi3gM_5JEidios' },
                { name: 'David Arto', role: 'Rising Talent', bio: 'Digital sculptor pushing the boundaries of algorithmic organic structures.', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChZiYP1nB4BKEqAkl-F8mkNQILGkYezXpzor0Lf9--AV26xWx6H6GsYK9VInzGO028xLtO4vGypVZQrjt81_mvHe8zHAit29_eJTfFZ8uNZ_xotu2oHwXnvzVh7dZGltNDwbiBtpzI18AmNchAvEbgUuMeOwyTcJBTQCFsnE6EaYR-Vbe-q9Jh-VA89MueKfYQZD38tRSxjRVV29BU44hfgthPaHeq1vMj0kCfzTF1EatA0gvlnoIPn3qTPqL6RXXKIFGX-0P7O1w' },
              ].map((artist) => (
                <motion.div 
                  key={artist.name} 
                  variants={fadeInUp}
                  whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0, 0, 0, 0.08)" }}
                  className="glass-card p-8 rounded-[40px] text-center flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 p-1 border-2 border-[#735b25]/20 group-hover:border-[#735b25] transition-colors duration-300">
                    <img className="w-full h-full object-cover rounded-full" src={artist.src} alt={artist.name} />
                  </div>
                  <h3 className="font-['Hanken_Grotesk'] text-[20px] font-[600]">{artist.name}</h3>
                  <div className="flex items-center gap-1 mt-2 text-[#735b25] font-['Inter'] text-[12px] font-[600] uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    {artist.role}
                  </div>
                  <p className="mt-4 font-['Inter'] text-[16px] text-[#444748] text-center text-sm">{artist.bio}</p>
                  <button className="mt-8 bg-black text-white px-10 py-3 rounded-full font-['Inter'] text-[14px] font-[500] w-full hover:scale-95 active:scale-90 transition-transform duration-200">Follow</button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-[160px] px-5 md:px-[80px] max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-black text-white p-20 md:p-32 rounded-[60px] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#735b25]/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#735b25]/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-['Hanken_Grotesk'] text-[40px] md:text-[64px] font-bold leading-tight mb-8">Join The Future Of Art</h2>
              <p className="font-['Inter'] text-[18px] text-white/80 mb-12">
                Be part of an exclusive ecosystem designed for the world's most innovative creators and discerning collectors.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/join" className="bg-white text-black px-10 py-5 rounded-full font-['Inter'] text-[14px] font-[500] hover:scale-95 active:scale-90 transition-all duration-200">
                  Start Creating
                </Link>
                <Link to="/feed" className="border border-white/30 text-white px-10 py-5 rounded-full font-['Inter'] text-[14px] font-[500] hover:bg-white/10 hover:scale-95 active:scale-90 transition-all duration-200">
                  Explore Community
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
