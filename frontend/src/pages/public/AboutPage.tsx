import React from 'react';

const AboutPage: React.FC = () => (
  <section className="mx-auto max-w-5xl space-y-12 px-6 py-16">
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">Weatherly · SIH PS 26069</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-brand-ink dark:text-white">Local observations, reviewed with context.</h1>
      <p className="mt-5 text-lg leading-relaxed text-brand-body dark:text-slate-300">
        Weatherly is a prototype for collecting citizen weather reports and helping analysts review them alongside location and confidence information.
      </p>
    </header>
    <div className="grid gap-8 border-t border-brand-hairline pt-8 md:grid-cols-2">
      <section>
        <h2 className="text-2xl font-bold text-brand-ink dark:text-white">Available in this build</h2>
        <p className="mt-3 leading-relaxed text-brand-body dark:text-slate-300">
          The app includes a public report map, a location-based report form, JWT-backed officer routes, report review actions, aggregate analytics and a review-record view. API and database status are shown separately from weather alerts.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-brand-ink dark:text-white">Still to integrate</h2>
        <p className="mt-3 leading-relaxed text-brand-body dark:text-slate-300">
          IMD alert and station feeds, media storage and EXIF checks, production AI validation, spatial deduplication, official radar overlays and geographic alert broadcasts need their real data services before they can be presented as live.
        </p>
      </section>
    </div>
  </section>
);

export default AboutPage;
