import  { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Digital Exercise Book';
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1917] p-8 font-serif">
      <div className="max-w-3xl mx-auto bg-stone-50 p-12 rounded-lg shadow-2xl border-l-8 border-stone-800">
        <Link to="/login" className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-8 transition-colors italic text-sm">
          <ChevronLeft className="w-4 h-4" /> Return to Archive
        </Link>
        
        <h1 className="text-4xl text-stone-800 mb-6 border-b border-stone-200 pb-4">Privacy Policy</h1>
        <p className="text-stone-500 italic mb-8">Effective Date: May 5, 2024</p>

        <div className="space-y-8 text-stone-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">1. Information Collection</h2>
            <p>
              We collect information you provide directly to us when you create an account, such as your name and email address. 
              Crucially, we store the content you create within your digital notebooks, including text, dates, formatting choices, and images.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">2. Use of Information</h2>
            <p>
              The information we collect is used primarily to provide, maintain, and improve the Digital Exercise Book services. 
              Your data is stored securely to allow you to access your archive from any compatible device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information and scholarly content. 
              However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">4. Cookies and Advertising</h2>
            <p>
              We may use cookies to personalize your experience and analyze our traffic. 
              We also use third-party advertising services (such as Google AdSense) which may collect data about your visits to this and other websites in order to provide relevant advertisements about goods and services of interest to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us through the official support channels.
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

export default PrivacyPolicy;
