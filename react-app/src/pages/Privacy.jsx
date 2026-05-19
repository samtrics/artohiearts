import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="font-['Inter'] text-[#1a1c1d] bg-[#f9f9fb]">
      <Navbar />
      <main className="pt-20 px-5 md:px-[80px] max-w-[1440px] mx-auto">
        <section className="py-20">
          <h1 className="font-['Hanken_Grotesk'] text-[40px] md:text-[56px] font-bold mb-6">Privacy Policy</h1>
          <div className="prose max-w-none text-[#444748] bg-white p-8 rounded-xl border border-[#e2e2e4]">
            <p>We respect your privacy. This is placeholder content — replace with your full privacy policy text before publishing.</p>
            <h2>Information Collected</h2>
            <p>We collect information necessary to operate and improve our services.</p>
            <h2>Data Rights</h2>
            <p>Users can request access, correction, or deletion of their data where applicable.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
