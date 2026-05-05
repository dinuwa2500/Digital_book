import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, Info } from 'lucide-react';

const AboutContact = () => {
  useEffect(() => {
    document.title = 'About & Contact | Digital Exercise Book';
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1917] p-8 font-serif">
      <div className="max-w-3xl mx-auto bg-stone-50 p-12 rounded-lg shadow-2xl border-l-8 border-stone-800">
        <Link to="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-8 transition-colors italic text-sm">
          <ChevronLeft className="w-4 h-4" /> Return Home
        </Link>
        
        <h1 className="text-4xl text-stone-800 mb-6 border-b border-stone-200 pb-4">About the Project</h1>
        
        <div className="space-y-8 text-stone-700 leading-relaxed">
          <section>
            <div className="flex items-center gap-3 mb-4 text-stone-900">
              <Info className="w-6 h-6" />
              <h2 className="text-2xl italic">Our Mission</h2>
            </div>
            <p>
              The Digital Exercise Book was born out of a simple need: to bring the discipline and tactile joy of physical note-taking into the digital age. In a world of cluttered productivity apps, we strive for minimalism, focus, and elegance.
            </p>
            <p className="mt-4">
              Our platform is designed specifically for students, researchers, and anyone who values the organized structure of a traditional notebook but requires the accessibility and security of the cloud.
            </p>
          </section>

          <section className="bg-stone-100 p-8 rounded-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-4 text-stone-900">
              <Mail className="w-6 h-6" />
              <h2 className="text-2xl italic">Contact Us</h2>
            </div>
            <p className="mb-6">
              We value your feedback and are always here to help you with your digital archive. Whether you have technical questions or suggestions for new features, please reach out.
            </p>
            <div className="space-y-2">
              <p className="font-bold text-stone-900">General Support:</p>
              <p className="italic underline">support@digitalexercisebook.com</p>
            </div>
            <div className="mt-6 space-y-2">
              <p className="font-bold text-stone-900">Partnerships & Media:</p>
              <p className="italic underline">hello@digitalexercisebook.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Office Location</h2>
            <p>
              While our platform is global, our hearts are in the academic spirit of innovation. 
              Digital Exercise Book HQ<br />
              Innovation Drive, Suite 400<br />
              Palo Alto, CA 94301
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

export default AboutContact;
