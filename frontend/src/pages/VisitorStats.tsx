import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Shield, Clock, ArrowLeft, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VisitorStats = () => {
  const [count, setCount] = useState<number | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessKey, setAccessKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Change this to your desired secret key
  const SECRET_KEY = 'ADMIN2026';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === SECRET_KEY) {
      setIsAuthorized(true);
      fetchAllStats();
    } else {
      setError('Invalid Access Key');
      setAccessKey('');
    }
  };

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const [countRes, countryRes] = await Promise.all([
        axios.get(`${apiUrl}/stats/count`),
        axios.get(`${apiUrl}/stats/countries`)
      ]);
      setCount(countRes.data.uniqueVisitors);
      setCountries(countryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If not authorized, show the Lock Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-serif">
        <div className="max-w-md w-full bg-[#111] border border-white/5 rounded-2xl p-10 shadow-2xl text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
           
           <div className="mb-8 flex justify-center">
             <div className="p-4 bg-white/5 rounded-full border border-white/10">
               <Shield className="w-8 h-8 text-indigo-400 animate-pulse" />
             </div>
           </div>

           <h1 className="text-2xl font-bold mb-2">Restricted Access</h1>
           <p className="text-stone-500 text-sm mb-8 italic">Enter the decryption key to view archive metrics.</p>

           <form onSubmit={handleVerify} className="space-y-4">
             <input
               type="password"
               value={accessKey}
               onChange={(e) => setAccessKey(e.target.value)}
               placeholder="Access Key"
               autoFocus
               className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-center tracking-[0.5em] focus:border-indigo-500/50 outline-none transition-all"
             />
             {error && <p className="text-red-500 text-xs mt-2 uppercase tracking-widest">{error}</p>}
             <button 
               type="submit"
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
             >
               Verify Identity
             </button>
           </form>

           <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 text-xs text-stone-600 hover:text-stone-400 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-6 font-serif">
      <div className="max-w-2xl w-full">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">System Analytics</h1>
              <p className="text-xs text-stone-500 uppercase tracking-[0.3em] font-bold">Encrypted Archive Access</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-sm text-stone-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-24 h-24 text-white" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-stone-500 text-sm uppercase tracking-widest font-bold">Total Reach</span>
            </div>
            <div className="text-5xl font-bold font-mono text-white">
              {loading ? '...' : count}
              <span className="text-stone-700 text-sm ml-2 font-serif font-normal italic">Unique souls</span>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-24 h-24 text-white" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-stone-500 text-sm uppercase tracking-widest font-bold">Last Sync</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white pt-2">
              {new Date().toLocaleTimeString()}
              <div className="text-stone-600 text-xs mt-1 font-serif font-normal italic uppercase tracking-widest">
                Real-time Monitoring Active
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Breakdown */}
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold">Global Presence</h2>
            </div>
            <span className="text-[10px] text-stone-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Breakdown by Country
            </span>
          </div>
          
          <div className="p-4 sm:p-8">
            {loading ? (
              <div className="py-20 text-center text-stone-600 italic">Decrypting geographic data...</div>
            ) : countries.length === 0 ? (
              <div className="py-20 text-center text-stone-600 italic">No geographic data recorded yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {countries.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-black/40 rounded-lg border border-white/5 text-lg shadow-inner group-hover:border-indigo-500/30 transition-colors">
                        {getFlagEmoji(c.code)}
                      </div>
                      <div>
                        <p className="font-bold text-stone-200">{c._id}</p>
                        <p className="text-[10px] text-stone-600 uppercase tracking-widest">{c.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-bold text-indigo-400">{c.count}</div>
                      <div className="text-[9px] text-stone-600 uppercase tracking-widest">Visitors</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-stone-700 uppercase tracking-[0.5em] mb-4">
            Secured and Encrypted by Archive Sentinel v2.4
          </p>
          <div className="flex justify-center gap-4">
             <div className="w-1 h-1 rounded-full bg-stone-800" />
             <div className="w-1 h-1 rounded-full bg-stone-800" />
             <div className="w-1 h-1 rounded-full bg-stone-800" />
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper for flag emojis
function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode === '??' || countryCode === 'LH') return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default VisitorStats;
