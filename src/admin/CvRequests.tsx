import { useEffect, useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  slot: string;
  name: string;
  path: string;
  size: number;
}

interface CvRequest {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  beruf: string;
  zielposition: string;
  paket: string;
  wunschdomain: string;
  design: string;
  erstellt_am: string;
  status: string;
  dateien: UploadedFile[];
}

const statusStyles: Record<string, string> = {
  neu: 'border-yellow-400/20 bg-yellow-400/10 text-yellow-300',
  in_bearbeitung: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
  abgeschlossen: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
};

export default function CvRequests() {
  const [requests, setRequests] = useState<CvRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('admin_cv_requests')
      .select('id, vorname, nachname, email, beruf, zielposition, paket, wunschdomain, design, erstellt_am, status, dateien')
      .order('erstellt_am', { ascending: false });

    if (queryError) {
      setError('Die CV-Anfragen konnten nicht geladen werden.');
    } else {
      setRequests((data ?? []) as CvRequest[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openFile = async (file: UploadedFile) => {
    setOpening(file.path);
    const { data, error: urlError } = await supabase.storage.from('cv-uploads').createSignedUrl(file.path, 3600);
    setOpening(null);
    if (urlError || !data?.signedUrl) {
      setError('Das Dokument konnte nicht geöffnet werden.');
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">CV-Anfragen</h2>
          <p className="mt-1 text-xs text-white/35">Anfragen und hochgeladene Unterlagen</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-mono text-white/50 transition-colors hover:border-cyan-400/30 hover:text-cyan-400">
          <RefreshCw size={13} /> Aktualisieren
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {loading ? (
        <div className="text-sm font-mono text-white/30">Laden...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-white/8 py-16 text-center text-sm font-mono text-white/25">Noch keine CV-Anfragen vorhanden.</div>
      ) : (
        <div className="grid gap-4">
          {requests.map(request => (
            <article key={request.id} className="rounded-xl border border-white/8 bg-[#0f0f1a] p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-white">{request.vorname} {request.nachname}</h3>
                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-mono ${statusStyles[request.status] ?? 'border-white/10 bg-white/5 text-white/50'}`}>{request.status}</span>
                  </div>
                  <a href={`mailto:${request.email}`} className="mt-1 block text-sm text-cyan-300 hover:text-cyan-200">{request.email}</a>
                  <p className="mt-3 text-sm text-white/55">{request.beruf}{request.zielposition ? ` · Ziel: ${request.zielposition}` : ''}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-mono text-sm text-cyan-300">{request.paket === 'student' ? 'CHF 290' : 'CHF 490'}</p>
                  <p className="mt-1 text-xs text-white/35">{new Date(request.erstellt_am).toLocaleDateString('de-CH')}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 border-t border-white/8 pt-4 text-xs text-white/45 sm:grid-cols-3">
                <span>Domain: <strong className="font-normal text-white/75">{request.wunschdomain || '—'}</strong></span>
                <span>Design: <strong className="font-normal text-white/75">{request.design}</strong></span>
                <span className="flex flex-wrap gap-2">{request.dateien.map(file => <button key={file.path} onClick={() => openFile(file)} disabled={opening === file.path} className="inline-flex items-center gap-1 rounded-md border border-cyan-400/20 px-2 py-1 text-cyan-300 transition-colors hover:bg-cyan-400/10 disabled:opacity-50"><FileText size={12} />{opening === file.path ? 'Öffne...' : file.name}<Download size={11} /></button>)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
