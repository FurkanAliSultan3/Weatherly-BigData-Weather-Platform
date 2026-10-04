import React from 'react';
import ReportForm from '../../components/features/reporting/ReportForm';

const ReportingPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1600px] space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted dark:text-slate-400">Citizen observation network</p>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-ink dark:text-white sm:text-5xl">Report a weather event</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-body dark:text-slate-300">Help map conditions near you. Choose a weather type, add what you observed, and pin its location for review.</p>
        </div>
        <span className="rounded-lg border border-brand-hairline bg-white/70 px-3 py-2 text-[10px] font-semibold text-brand-muted dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">Reports are not emergency dispatch requests</span>
      </div>
      <ReportForm />
    </div>
  );
};

export default ReportingPage;
