import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Shield, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VisitorStats = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/stats/count`);
        setCount(res.data.uniqueVisitors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 font-serif">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">System Archive</h1>
              <p className="text-xs text-stone-500 uppercase tracking-widest">Internal Access Only</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 border border-white/5 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-stone-400">Unique Visitors</span>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {loading ? '...' : count}
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-stone-400">Last Updated</span>
              </div>
              <div className="text-sm font-mono text-stone-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-10 w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm text-stone-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] text-stone-600 uppercase tracking-[0.3em]">
        Digital Book Analytics v1.0
      </p>
    </div>
  );
};

export default VisitorStats;
