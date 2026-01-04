
import React, { useState } from 'react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Get the dynamic password from localStorage, default to 'Godpassage'
    const storedPassword = localStorage.getItem('rtwh_admin_password') || 'Godpassage';

    // Simulate a gentle authentication check
    setTimeout(() => {
      if (password === storedPassword) {
        onLoginSuccess();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-md w-full glass-card p-8 md:p-12 rounded-[3rem] border border-white/10 text-center space-y-8 relative overflow-hidden mx-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 mb-6">
            <span className="text-2xl animate-pulse">🌙</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Scribe Portal</h2>
          <p className="text-slate-500 text-sm serif italic">Enter the access key to wake the hub.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access Key..."
              className={`w-full bg-slate-900/50 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-white text-center tracking-[0.5em] transition-all`}
            />
            {error && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-2 animate-bounce">
                The key does not fit.
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-950 py-4 rounded-2xl font-bold transition-all hover:bg-indigo-400 hover:text-white shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <button 
          onClick={onCancel}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-[0.2em] font-bold"
        >
          Return to silence
        </button>

        <div className="pt-8 opacity-20 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-slate-500" />
          <span className="text-[8px] uppercase tracking-tighter">ReadyToWriteHub Scribe Access</span>
          <div className="h-px w-8 bg-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default LoginView;
