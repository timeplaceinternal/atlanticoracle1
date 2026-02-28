import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, LogOut } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cosmic123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid cosmic frequency.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-cosmic-800/40 backdrop-blur-3xl border border-cosmic-gold/20 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-12">
          <div className="text-center space-y-4">
            <ShieldCheck className="w-16 h-16 text-cosmic-gold mx-auto mb-6" />
            <h1 className="text-3xl font-cinzel text-white uppercase tracking-widest">Admin Sanctuary</h1>
            <p className="text-cosmic-silver italic font-playfair">Enter the sacred frequency.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">Sacred Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cosmic-gold/40 hover:text-cosmic-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-transform">Unlock Portal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-cinzel text-white uppercase tracking-widest">Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Exit Sanctuary
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
          <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Total Consultations</h4>
          <p className="text-4xl font-cinzel text-cosmic-gold">1,234</p>
        </div>
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
          <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Active Users</h4>
          <p className="text-4xl font-cinzel text-cosmic-gold">567</p>
        </div>
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
          <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Revenue (MTD)</h4>
          <p className="text-4xl font-cinzel text-cosmic-gold">€5,670</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
