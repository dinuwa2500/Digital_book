import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Edit3, Shield, Zap, ChevronRight } from 'lucide-react';
import Adsterra from '../components/Ads/Adsterra';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'Digital Exercise Book | The Premium Academic Notebook';
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1917] text-stone-300 font-serif overflow-x-hidden">
      {/* Top Ad Unit - 728x90 */}
      <Adsterra id="29308150" format="728x90" className="bg-black/20 py-2 border-b border-white/5" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-800 border border-stone-600 rounded flex items-center justify-center shrink-0">
            <Book className="w-5 h-5 text-stone-100" />
          </div>
          <span className="text-lg sm:text-xl tracking-tight text-white italic">Digital Archive</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm uppercase tracking-widest italic">
          <Link to="/about" className="hidden sm:inline hover:text-white transition-colors">About</Link>
          <Link
            to="/login"
            className="px-4 sm:px-6 py-2 bg-stone-800 text-stone-100 rounded-sm hover:bg-stone-700 transition-all border border-stone-600 whitespace-nowrap"
          >
            Enter Library
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-32 text-center">
        <h1 className="hero-title text-5xl sm:text-7xl md:text-8xl text-white mb-6 sm:mb-8 leading-tight">
          Write with <span className="italic text-stone-500">Intent.</span><br />
          Organize with <span className="italic text-stone-500">Ease.</span>
        </h1>
        <p className="hero-subtitle text-base sm:text-xl text-stone-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          The high-fidelity digital exercise book designed for scholars, researchers, and creators. 
          A tactile writing experience meeting the power of the modern cloud.
        </p>
        <div className="hero-cta flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4 sm:px-0">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-stone-100 text-stone-900 rounded-sm font-bold hover:bg-white transition-all shadow-xl"
          >
            Begin Your Archive <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-transparent text-stone-300 rounded-sm border border-stone-600 hover:border-stone-400 hover:text-white transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* In-content Ad Unit - Native */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Adsterra id="29308151" format="native" />
      </div>

      {/* Feature Section */}
      <section className="bg-stone-900 py-16 sm:py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-16">
          {[
            {
              icon: <Edit3 className="w-6 h-6 text-stone-300" />,
              title: 'Tactile Editor',
              desc: 'Experience a writing interface that respects the tradition of pen-on-paper. Our 32px grid system and focus-mode typography ensure your best work.'
            },
            {
              icon: <Zap className="w-6 h-6 text-stone-300" />,
              title: 'Cloud Sync',
              desc: 'Your research is instantly preserved across all devices. Never worry about manual saving again with our background auto-save technology.'
            },
            {
              icon: <Shield className="w-6 h-6 text-stone-300" />,
              title: 'Secure Archive',
              desc: 'Academic privacy is our priority. Your notes are encrypted and stored in a private, dedicated archive accessible only by you.'
            }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="space-y-4">
              <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                {icon}
              </div>
              <h3 className="text-xl sm:text-2xl text-white italic">{title}</h3>
              <p className="text-stone-500 leading-relaxed text-sm sm:text-base">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-footer Ad Unit - 468x60 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Adsterra id="29308148" format="468x60" />
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Book className="w-5 h-5 text-stone-100" />
              <span className="text-base sm:text-lg text-white italic">Digital Exercise Book</span>
            </div>
            <p className="text-sm text-stone-500 max-w-sm mb-6">
              The premier digital workspace for academic and personal growth. 
              Built with love for the scholars of the future.
            </p>
            
            {/* Smartlink Support Button */}
            <a 
              href="https://highperformanceformat.com/29308153" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded text-xs text-stone-400 hover:text-white hover:bg-white/10 transition-all font-serif italic"
            >
              <Zap className="w-3 h-3 text-yellow-500" /> Support the Library
            </a>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-4 sm:mb-6 font-bold">Platform</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm italic text-stone-500">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-4 sm:mb-6 font-bold">Legal</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm italic text-stone-500">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About & Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/5 text-center text-xs text-stone-600 uppercase tracking-widest">
          &copy; 2026 Digital Exercise Book. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
