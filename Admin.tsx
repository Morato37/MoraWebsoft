import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      (() => { setSession(!!s); })();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return (
      <div className="admin-area min-h-screen bg-[#05050f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <div className="admin-area"><AdminLogin onLogin={() => setSession(true)} /></div>;
  }

  return <div className="admin-area"><AdminDashboard onLogout={() => setSession(false)} /></div>;
}
