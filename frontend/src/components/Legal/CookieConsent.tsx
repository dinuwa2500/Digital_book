import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-700 p-6 z-[9999] shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-stone-300 font-serif italic text-sm">
          We use cookies to enhance your scholarly experience and analyze our archive traffic. 
          By continuing to browse, you agree to our use of cookies. 
          View our <Link to="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link> for more details.
        </div>
        <div className="flex gap-4">
          <button 
            onClick={acceptConsent}
            className="px-8 py-2 bg-stone-100 text-stone-900 rounded-sm font-bold hover:bg-white transition-all text-sm uppercase tracking-widest"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
