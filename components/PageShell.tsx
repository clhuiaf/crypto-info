 'use client'

import React, { ReactNode } from 'react';

interface PageShellProps {
  // optional hero/title/toolbar for pages that want a small header area
  title?: string;
  subtitle?: string;
  toolbar?: ReactNode;
  hero?: ReactNode;
  children: ReactNode;
}

// Single export PageShell — provides a consistent outer width container and
// optional simple hero/title/toolbar slots for pages that need them.
export default function PageShell({ title, subtitle, toolbar, hero, children }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
      {/* hero can be full-bleed if provided; otherwise render title/subtitle */}
      {hero ? (
        <div>{hero}</div>
      ) : title ? (
        <div className="pt-6 pb-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-2 text-slate-500 max-w-2xl">{subtitle}</p> : null}
        </div>
      ) : null}

      {/* toolbar sits below hero/title */}
      {toolbar ? <div className="mt-6">{toolbar}</div> : null}

      {/* main content */}
      <main className="mt-8">{children}</main>
    </div>
  );
}