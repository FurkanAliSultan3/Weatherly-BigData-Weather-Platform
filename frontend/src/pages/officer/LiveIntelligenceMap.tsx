import React, { useState } from 'react';
import PublicTrustMap from '../../maps/PublicTrustMap';
import { useTheme } from '../../context/ThemeContext';
import { useOfficerStoreVersion } from '../../data/officerStore';

const statusFilters = ['ALL', 'VERIFIED', 'LIKELY', 'UNVERIFIED', 'FLAGGED'] as const;

const LiveIntelligenceMap: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>('ALL');
  useOfficerStoreVersion();

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-off-muted">National operations · live map</p>
          <h2 className="mt-1 text-2xl font-bold text-brand-off-ink">Live intelligence map</h2>
          <p className="mt-1 text-sm text-brand-off-body">Report statuses are shared with the verification and public map views.</p>
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-brand-off-hairline bg-brand-off-surface px-4 py-2 text-xs font-bold text-brand-off-body">
          Status
          <select
            value={filter}
            onChange={event => setFilter(event.target.value as (typeof statusFilters)[number])}
            className="bg-transparent text-brand-off-primary outline-none focus-visible:ring-2 focus-visible:ring-brand-off-primary"
          >
            {statusFilters.map(status => <option key={status} value={status}>{status === 'ALL' ? 'All reports' : status}</option>)}
          </select>
        </label>
      </header>
      <div className="relative h-[min(76vh,900px)] min-h-[520px] overflow-hidden rounded-3xl border border-brand-off-hairline bg-brand-off-surface">
        <PublicTrustMap isDarkTheme={theme === 'dark'} isOfficer statusFilter={filter} />
      </div>
    </section>
  );
};

export default LiveIntelligenceMap;
