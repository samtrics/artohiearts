import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Support() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="font-['Inter'] text-[#1a1c1d] bg-[#f9f9fb]">
      <Navbar />
      <main className="pt-20 px-5 md:px-[80px] max-w-[1440px] mx-auto">
        <section className="min-h-[360px] flex flex-col items-start justify-center py-20">
          <h1 className="font-['Hanken_Grotesk'] text-[40px] md:text-[56px] font-bold mb-4">Support</h1>
          <p className="text-[#444748] max-w-2xl mb-8">Need help with your account, purchases, or technical issues? Our support team is here to help — submit a request through the contact form or email us directly.</p>

          <div className="bg-white rounded-xl p-6 border border-[#e2e2e4] w-full md:w-2/3">
            <h2 className="font-['Hanken_Grotesk'] text-[18px] font-[600] mb-2">How to reach us</h2>
            <ul className="list-disc pl-5 text-[#444748] space-y-2">
              <li>Email: hello@artohie.com</li>
              <li>Typical response time: 24–48 business hours</li>
              <li>For urgent platform outages, include "URGENT" in the subject</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
