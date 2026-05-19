import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CommissionArt() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState('Marcus Vane');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Artist' },
    { num: 3, label: 'Details' },
    { num: 4, label: 'Payment' },
  ];

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] selection:bg-[#735b25]/30">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <header className="pt-32 pb-24 px-8 md:px-20 max-w-[1440px] mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-['Inter'] text-[12px] font-[600] text-[#735b25] uppercase tracking-widest mb-6 block"
          >
            Artistic Commission
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Hanken_Grotesk'] text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.04em] text-black mb-8 max-w-4xl mx-auto"
          >
            Start Your Vision
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Inter'] text-[18px] text-[#444748] max-w-2xl mx-auto"
          >
            From conceptual sketches to finished masterpieces. Collaborate with the world's most talented creators to bring your unique ideas to life.
          </motion.p>
        </header>

        {/* Stepper */}
        <section className="max-w-4xl mx-auto px-8 mb-20">
          <div className="flex justify-between items-center relative">
            <div className="absolute h-[1px] bg-[#c4c7c7] w-full top-1/2 -translate-y-1/2 z-0"></div>
            {/* Animated Progress Bar */}
            <motion.div 
              className="absolute h-[1px] bg-[#735b25] top-1/2 -translate-y-1/2 z-0 left-0"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {steps.map((step) => (
              <button 
                key={step.num} 
                onClick={() => setCurrentStep(step.num)}
                className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group outline-none"
              >
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-['Inter'] text-[14px] font-[500] ${
                    currentStep >= step.num 
                      ? 'bg-black text-white' 
                      : 'bg-[#e8e8ea] border border-[#c4c7c7] text-[#444748]'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {step.num}
                </motion.div>
                <span className={`font-['Inter'] text-[12px] font-[600] transition-colors ${
                  currentStep >= step.num ? 'text-black' : 'text-[#444748]'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Main Form */}
        <section className="max-w-[1440px] mx-auto px-8 md:px-20 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
            {/* Step 1 Upload */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 bg-white p-12 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-black/5"
            >
              <div className="flex items-center gap-4 mb-10">
                <span className="material-symbols-outlined text-black">cloud_upload</span>
                <h2 className="font-['Hanken_Grotesk'] text-[32px] font-[600] leading-[1.2]">1. Reference Material</h2>
              </div>
              <motion.div 
                whileHover={{ borderColor: "#735b25" }}
                className="aspect-video bg-[#f3f3f5] border-2 border-dashed border-[#c4c7c7] rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer group"
              >
                <motion.div 
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined text-[#444748]">add</span>
                </motion.div>
                <p className="font-['Inter'] text-[16px] text-[#444748]">Drag and drop images or <span className="text-[#735b25] font-semibold">browse files</span></p>
                <p className="font-['Inter'] text-[12px] font-[600] text-[#444748]/60">Supports JPG, PNG, PDF up to 20MB</p>
              </motion.div>
              <div className="mt-8">
                <label className="font-['Inter'] text-[12px] font-[600] text-[#444748] block uppercase mb-4">Vision Description</label>
                <textarea className="w-full bg-[#f9f9fb] border border-[#c4c7c7] rounded-lg p-6 font-['Inter'] text-[16px] focus:ring-0 focus:border-black transition-all min-h-[160px]" placeholder="Describe the mood, style, and essential elements of your vision..."></textarea>
              </div>
            </motion.div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {/* Suggested Artists */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-black/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-['Hanken_Grotesk'] text-[24px] font-[600]">Suggested Artists</h2>
                  <button className="font-['Inter'] text-[12px] font-[600] text-[#735b25] hover:underline uppercase">View All</button>
                </div>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  {[
                    { name: 'Elena Rossi', role: 'Digital Oil & Impressionism', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7NvFQJym9_r1U0pYNMjMzqiQGmefadcXx6AystLyYB1EDbzOyO2SeIISwrsAMZCcyys2McaCuo8osIoX_b8FQM2qbWUobXMuwXORdjuVMkamN2ECkp6P4OUv8SlgXAJgZ9rmH0Zd0p4aveoeIVDMY3tJeUZQ-GP-oZKUTOOrf2PpNBVADRbn3lU2yHcdTIWDocdQZrAJ2a2ti-Uwf0CeVnpdA1I0tjoFKmnGxlSV0AHCUCjNao_Me_gSGEHzmaaiCgxeh15-3Rn4' },
                    { name: 'Marcus Vane', role: 'Surrealist Concept Art', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASiCcWfvHE5zpkHUi-ultRIICh2HWCjtMXmZBHKw4KMCc3DpaUxmfGJxnYujKXVUbkjvgmAC2MVs-eDU-wXVUrAhvS9N3kFBv9UBAtz_A0ir9K2F47b83sacy9Xd58YyK0jNi67PWsRcQLi-nY4x6HqY62ayMwpPv6yLwGnmEwnXp11ylDPWmqwCWzUgRpHz-kjCJXYcg3sjjGLSl4uu5AX1eCXSRysl9LHnZ6q7k-7KjkbgGb8SWPAC1c8Qm2KF58xvmV7cNZjjo' },
                    { name: 'Sora Kim', role: 'Minimalist Vector Art', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9YUlnhgGFNCNxkl-eGBuU7TdJ6STGZmFNYGOWqApLT0fQhwCh3k-q_Ut8uqIgDNwC1BCBOV-zVTZC0mAWv5ZJ0lMW0e6i150X7c7sN8aqSHTFf0jyiHfv2i8aib41eH8ms6zhyG4Tyw0nubLrSJVhLU3gzne_tMLJZLtzYQUH7VsZdXjr_P2qkDLJhfWhAla_iqbv3wf6JHSNdfpU3gO0VQSxRuUBbqH1Vcu5yp23WhHyddgADtQyZ9GcV9PqEj2YZz8y7JpqYLs' },
                  ].map((artist) => (
                    <motion.div 
                      key={artist.name} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedArtist(artist.name)}
                      className={`flex items-center gap-5 p-4 rounded-lg transition-colors cursor-pointer group ${
                        selectedArtist === artist.name ? 'border border-black/10 bg-black/5' : 'hover:bg-[#f3f3f5]'
                      }`}
                    >
                      <img className={`w-16 h-16 rounded-full object-cover transition-all ${selectedArtist !== artist.name ? 'grayscale group-hover:grayscale-0' : ''}`} src={artist.src} alt={artist.name} />
                      <div>
                        <h4 className="font-['Inter'] text-[14px] font-[500] text-black">{artist.name}</h4>
                        <p className="font-['Inter'] text-[12px] font-[600] text-[#444748]">{artist.role}</p>
                      </div>
                      <span className={`material-symbols-outlined ml-auto ${selectedArtist === artist.name ? 'text-black' : 'text-[#c4c7c7] group-hover:text-black'}`} style={selectedArtist === artist.name ? { fontVariationSettings: "'FILL' 1" } : {}}>{selectedArtist === artist.name ? 'check_circle' : 'chevron_right'}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Guarantee card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-black text-white p-10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              >
                <h3 className="font-['Hanken_Grotesk'] text-[24px] font-[600] mb-4">The Vision Guarantee</h3>
                <p className="font-['Inter'] text-[16px] opacity-70 mb-8">Every commission on Artohie is protected by our secure escrow system. Your funds are only released when you are 100% satisfied with the final masterpiece.</p>
                <button className="w-full bg-white text-black py-4 rounded-lg font-['Inter'] text-[14px] font-[500] hover:scale-95 active:scale-90 transition-transform duration-200">Continue to Timeline</button>
              </motion.div>
            </div>
          </div>

          {/* Future Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] mt-[160px]">
            {[
              { icon: 'schedule', title: '3. Timeline & Details', desc: 'Set your delivery dates, revision cycles, and specify technical requirements like canvas size and resolution.' },
              { icon: 'lock', title: '4. Secure Payment', desc: 'Finalize your commission with encrypted payments via Stripe or Crypto. Automated contracts protect both parties.' },
            ].map((step) => (
              <div key={step.title} className="bg-[#eeeef0] border border-[#c4c7c7] p-12 rounded-xl opacity-60">
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-[#747878]">{step.icon}</span>
                  <h2 className="font-['Hanken_Grotesk'] text-[24px] font-[600] text-[#444748]">{step.title}</h2>
                </div>
                <p className="font-['Inter'] text-[16px] text-[#444748]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
