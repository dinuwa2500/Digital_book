import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsOfService = () => {
  useEffect(() => {
    document.title = 'Terms of Service | Digital Exercise Book';
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1917] p-8 font-serif">
      <div className="max-w-3xl mx-auto bg-stone-50 p-12 rounded-lg shadow-2xl border-l-8 border-stone-800">
        <Link to="/login" className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-8 transition-colors italic text-sm">
          <ChevronLeft className="w-4 h-4" /> Return to Archive
        </Link>
        
        <h1 className="text-4xl text-stone-800 mb-6 border-b border-stone-200 pb-4">Terms of Service</h1>
        <p className="text-stone-500 italic mb-8">Last Updated: May 5, 2024</p>

        <div className="space-y-8 text-stone-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Digital Exercise Book, you agree to be bound by these Terms of Service. If you do not agree to all of the terms, you may not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">3. Content Ownership</h2>
            <p>
              You retain all rights to the text, images, and other content you create or upload to the platform. By using the platform, you grant us a license to host and store this content for the purpose of providing the service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">4. Prohibited Conduct</h2>
            <p>
              Users are prohibited from using the service for any illegal activities or to store content that violates intellectual property rights. We reserve the right to suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">5. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" and "as available". We make no warranties regarding the uptime, accuracy, or reliability of the digital archive.
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-stone-200 text-center text-stone-400 text-sm italic">
          &copy; 2024 Digital Exercise Book Archive
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;
