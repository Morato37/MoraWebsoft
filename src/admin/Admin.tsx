import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const ADMIN_USER_ID = '053bdf71-bd10-4589-bd9a-4d0dac1a3053';

export default function Admin() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const isAdmin = data.session?.user.id === ADMIN_USER_ID;
      if (data.session && !isAdmin) {
        await supabase.auth.signOut();
      }
      setSession(isAdmin);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      const isAdmin = s?.user.id === ADMIN_USER_ID;
      setSession(isAdmin);
      if (s && !isAdmin) {
        void supabase.auth.signOut();
      }
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
    return <div className="admin-area"><AdminLogin /></div>;
  }

  return <div className="admin-area"><AdminDashboard onLogout={() => setSession(false)} /></div>;
}
