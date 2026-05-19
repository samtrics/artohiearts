import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-20 bg-[#f9f9fb] border-t border-black/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-5 md:px-[80px] max-w-[1440px] mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="font-['Hanken_Grotesk'] text-[24px] font-bold text-black">Artohie</Link>
          <p className="font-['Inter'] text-[16px] text-[#444748]">Elevating digital identity through curation.</p>
        </div>
        <div className="flex gap-10">
          <Link className="font-['Inter'] text-[12px] font-[600] text-[#444748] hover:text-[#735b25] transition-colors" to="/blog">Blog</Link>
          <Link className="font-['Inter'] text-[12px] font-[600] text-[#444748] hover:text-[#735b25] transition-colors" to="/terms">Terms</Link>
          <Link className="font-['Inter'] text-[12px] font-[600] text-[#444748] hover:text-[#735b25] transition-colors" to="/privacy">Privacy</Link>
          <Link className="font-['Inter'] text-[12px] font-[600] text-[#444748] hover:text-[#735b25] transition-colors" to="/support">Support</Link>
          <Link className="font-['Inter'] text-[12px] font-[600] text-[#444748] hover:text-[#735b25] transition-colors" to="/contact">Contact</Link>
        </div>
        <div className="font-['Inter'] text-[12px] font-[600] text-[#444748]">
          © 2024 Artohie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
