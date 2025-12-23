'use client';

interface NewsHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function NewsHero({ eyebrow, title, subtitle }: NewsHeroProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}



