import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Terminal, Mail, Lock } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0f0f1a] border border-cyan-400/20 flex items-center justify-center">
            <Terminal size={18} className="text-cyan-400" />
          </div>
          <span className="font-mono text-sm text-white/50 tracking-widest uppercase">Admin / Login</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">E-Mail</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                  <Mail size={13} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#12122a] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Passwort</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                  <Lock size={13} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#12122a] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-400 text-[#05050f] font-mono font-bold text-sm rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
