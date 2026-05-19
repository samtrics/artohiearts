import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="font-['Inter'] text-[#1a1c1d] bg-[#f9f9fb]">
      <Navbar />
      <main className="pt-20 px-5 md:px-[80px] max-w-[1440px] mx-auto">
        <section className="py-20">
          <h1 className="font-['Hanken_Grotesk'] text-[40px] md:text-[56px] font-bold mb-6">Terms of Service</h1>
          <div className="prose max-w-none text-[#444748] bg-white p-8 rounded-xl border border-[#e2e2e4]">
            <p>Welcome to Artohie. These terms govern your use of our platform. This is placeholder content — replace with your full terms of service.</p>
            <h2>Usage</h2>
            <p>Users must comply with applicable laws and our policies when using the service.</p>
            <h2>Accounts</h2>
            <p>Account holders are responsible for keeping their login information secure.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
