import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Customers from './Customers';
import Orders from './Orders';
import Invoices from './Invoices';
import CvRequests from './CvRequests';
import Crm from './Crm';
import { Users, ClipboardList, FileText, LogOut, Terminal, FolderOpen, LayoutDashboard } from 'lucide-react';

type Tab = 'crm' | 'customers' | 'orders' | 'invoices' | 'cv';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'crm', label: 'CRM', icon: <LayoutDashboard size={15} /> },
  { id: 'customers', label: 'Kunden', icon: <Users size={15} /> },
  { id: 'orders', label: 'Aufträge', icon: <ClipboardList size={15} /> },
  { id: 'invoices', label: 'Rechnungen', icon: <FileText size={15} /> },
  { id: 'cv', label: 'CV-Anfragen', icon: <FolderOpen size={15} /> },
];

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('crm');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="admin-shell min-h-screen bg-[#070b14] text-slate-100">
      {/* Topbar */}
      <div className="sticky top-0 z-40 border-b border-slate-700 bg-[#0b1220]/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0f0f1a] border border-cyan-400/20 flex items-center justify-center">
              <Terminal size={13} className="text-cyan-400" />
            </div>
            <span className="font-mono text-xs text-white/40 tracking-widest uppercase">Admin</span>
          </div>

          <div className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-0.5 lg:order-2 lg:w-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  tab === t.id
                    ? 'border border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
                    : 'border border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="order-2 flex items-center gap-1.5 text-xs font-mono text-slate-300 transition-colors hover:text-white lg:order-3"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'crm' && <Crm />}
        {tab === 'customers' && <Customers />}
        {tab === 'orders' && <Orders />}
        {tab === 'invoices' && <Invoices />}
        {tab === 'cv' && <CvRequests />}
      </div>
    </div>
  );
}
