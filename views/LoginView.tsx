
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
    <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 px-4">
      <div className="max-w-md w-full glass-card p-10 md:p-16 rounded-[3rem] border border-slate-100 text-center space-y-10 relative overflow-hidden bg-white/80 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent" />
        
        <div className="space-y-4">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto border border-indigo-100 mb-6 shadow-inner">
            <span className="text-3xl animate-float">✨</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Portal</h2>
          <p className="text-slate-500 text-sm serif italic font-medium px-4">The scribe's key is required to wake the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access Key..."
              className={`w-full bg-slate-50 border ${error ? 'border-red-400 ring-2 ring-red-400/10' : 'border-slate-100'} rounded-2xl px-8 py-5 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 text-slate-900 text-center tracking-[0.4em] transition-all text-lg shadow-inner font-bold`}
            />
            {error && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-4 animate-bounce">
                The key does not fit.
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-full font-bold transition-all hover:bg-indigo-700 shadow-2xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
          >
            {loading ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>

        <button 
          onClick={onCancel}
          className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] font-bold border-b border-transparent hover:border-indigo-200 pb-0.5"
        >
          Return to silence
        </button>

        <div className="pt-10 opacity-30 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-slate-300" />
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Encrypted Connection</span>
          <div className="h-px w-8 bg-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default LoginView;
