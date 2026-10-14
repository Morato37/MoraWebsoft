import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Customers from './Customers';
import Orders from './Orders';
import Invoices from './Invoices';
import CvRequests from './CvRequests';
import Crm from './Crm';
import Quotes from './Quotes';
import { useNotifications } from './useNotifications';
import { Users, ClipboardList, FileText, FileSignature, LogOut, Terminal, FolderOpen, LayoutDashboard, Bell } from 'lucide-react';

type Tab = 'crm' | 'customers' | 'orders' | 'invoices' | 'quotes' | 'cv';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'crm', label: 'CRM', icon: <LayoutDashboard size={15} /> },
  { id: 'customers', label: 'Kunden', icon: <Users size={15} /> },
  { id: 'quotes', label: 'Offerten', icon: <FileSignature size={15} /> },
  { id: 'orders', label: 'Aufträge', icon: <ClipboardList size={15} /> },
  { id: 'invoices', label: 'Rechnungen', icon: <FileText size={15} /> },
  { id: 'cv', label: 'CV-Anfragen', icon: <FolderOpen size={15} /> },
];

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('crm');
  const notifications = useNotifications();

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
            <div className="relative w-7 h-7 rounded-lg bg-[#0f0f1a] border border-cyan-400/20 flex items-center justify-center">
              <Terminal size={13} className="text-cyan-400" />
            </div>
            <span className="font-mono text-xs text-white/40 tracking-widest uppercase">Admin</span>
            {notifications.total > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-mono text-amber-200">
                <Bell size={11} className="animate-pulse" />
                {notifications.total} neu
              </span>
            )}
          </div>

          <div className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-0.5 lg:order-2 lg:w-auto">
            {TABS.map(t => {
              const count = notifications[t.id];
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    tab === t.id
                      ? 'border border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
                      : 'border border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {t.icon} {t.label}
                  {count > 0 && (
                    <span className="ml-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 py-0.5 text-[10px] font-bold leading-none text-slate-950">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
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
        {tab === 'quotes' && <Quotes />}
        {tab === 'cv' && <CvRequests />}
      </div>
    </div>
  );
}
