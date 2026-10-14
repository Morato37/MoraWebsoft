interface CodeCardProps {
  entries: { key: string; value: string }[];
}

export default function CodeCard({ entries }: CodeCardProps) {
  return (
    <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-5 font-mono text-sm">
      {entries.map(entry => (
        <div key={entry.key} className="flex gap-2 py-0.5">
          <span className="text-[#9CA3AF]">{entry.key}:</span>
          <span className="text-[#E5E7EB]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
