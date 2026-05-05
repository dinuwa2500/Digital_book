import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Edit3, Shield, Zap, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'Digital Exercise Book | The Premium Academic Notebook';
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1917] text-stone-300 font-serif overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-800 border border-stone-600 rounded flex items-center justify-center">
            <Book className="w-5 h-5 text-stone-100" />
          </div>
          <span className="text-xl tracking-tight text-white italic">Digital Archive</span>
        </div>
        <div className="flex items-center gap-8 text-sm uppercase tracking-widest italic">
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/login" className="px-6 py-2 bg-stone-800 text-stone-100 rounded-sm hover:bg-stone-700 transition-all border border-stone-600">Enter Library</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 py-32 text-center">
        <h1 className="text-7xl md:text-8xl text-white mb-8 leading-tight">
          Write with <span className="italic text-stone-500">Intent.</span><br />
          Organize with <span className="italic text-stone-500">Ease.</span>
        </h1>
        <p className="text-xl text-stone-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The high-fidelity digital exercise book designed for scholars, researchers, and creators. 
          A tactile writing experience meeting the power of the modern cloud.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/register" className="px-10 py-4 bg-stone-100 text-stone-900 rounded-sm font-bold hover:bg-white transition-all shadow-xl flex items-center gap-2">
            Begin Your Archive <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Feature Section (Rich Content for AdSense) */}
      <section className="bg-stone-900 py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-6">
              <Edit3 className="w-6 h-6 text-stone-300" />
            </div>
            <h3 className="text-2xl text-white italic">Tactile Editor</h3>
            <p className="text-stone-500 leading-relaxed">
              Experience a writing interface that respects the tradition of pen-on-paper. Our 32px grid system and focus-mode typography ensure your best work.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-stone-300" />
            </div>
            <h3 className="text-2xl text-white italic">Cloud Sync</h3>
            <p className="text-stone-500 leading-relaxed">
              Your research is instantly preserved across all devices. Never worry about manual saving again with our background auto-save technology.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-stone-300" />
            </div>
            <h3 className="text-2xl text-white italic">Secure Archive</h3>
            <p className="text-stone-500 leading-relaxed">
              Academic privacy is our priority. Your notes are encrypted and stored in a private, dedicated archive accessible only by you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer (Essential Links for AdSense) */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Book className="w-5 h-5 text-stone-100" />
              <span className="text-lg text-white italic">Digital Exercise Book</span>
            </div>
            <p className="text-sm text-stone-500 max-w-sm">
              The premier digital workspace for academic and personal growth. 
              Built with love for the scholars of the future.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-bold">Platform</h4>
            <ul className="space-y-4 text-sm italic text-stone-500">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-bold">Legal</h4>
            <ul className="space-y-4 text-sm italic text-stone-500">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About & Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-xs text-stone-600 uppercase tracking-widest">
          &copy; 2026 Digital Exercise Book. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
