import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Customers from './Customers';
import Orders from './Orders';
import Invoices from './Invoices';
import { Users, ClipboardList, FileText, LogOut, Terminal } from 'lucide-react';

type Tab = 'customers' | 'orders' | 'invoices';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'customers', label: 'Kunden', icon: <Users size={15} /> },
  { id: 'orders', label: 'Aufträge', icon: <ClipboardList size={15} /> },
  { id: 'invoices', label: 'Rechnungen', icon: <FileText size={15} /> },
];

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('customers');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#05050f]">
      {/* Topbar */}
      <div className="border-b border-white/8 bg-[#0a0a18]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0f0f1a] border border-cyan-400/20 flex items-center justify-center">
              <Terminal size={13} className="text-cyan-400" />
            </div>
            <span className="font-mono text-xs text-white/40 tracking-widest uppercase">Admin</span>
          </div>

          <div className="flex items-center gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  tab === t.id
                    ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                    : 'text-white/35 hover:text-white/60 border border-transparent'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'customers' && <Customers />}
        {tab === 'orders' && <Orders />}
        {tab === 'invoices' && <Invoices />}
      </div>
    </div>
  );
}
