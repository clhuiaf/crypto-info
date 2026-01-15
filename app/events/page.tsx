'use client';

import { useState, useMemo } from 'react';
import EventCard from '@/components/EventCard';
import PageShell from '@/components/PageShell';
import PageToolbar from '@/components/PageToolbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { mockEvents } from '@/data/mockEvents';
import { Event, EventType } from '@/types/event';

export default function EventsPage() {
  const [selectedExchange, setSelectedExchange] = useState<string>('All');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'All'>('All');

  // Get unique exchange names for filter
  const exchangeNames = useMemo(() => {
    const names = new Set(mockEvents.map((event) => event.exchangeName));
    return ['All', ...Array.from(names).sort()];
  }, []);

  // Get unique event types for filter
  const eventTypes = useMemo(() => {
    const types = new Set(mockEvents.map((event) => event.eventType));
    return ['All', ...Array.from(types).sort()] as (EventType | 'All')[];
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = [...mockEvents];

    // Filter by exchange
    if (selectedExchange !== 'All') {
      filtered = filtered.filter((event) => event.exchangeName === selectedExchange);
    }

    // Filter by event type
    if (selectedEventType !== 'All') {
      filtered = filtered.filter((event) => event.eventType === selectedEventType);
    }

    // Sort by start date (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [selectedExchange, selectedEventType]);

  const toolbar = (
    <PageToolbar
      left={
        <>
          <select
            value={selectedExchange}
            onChange={(e) => setSelectedExchange(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {exchangeNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value as EventType | 'All')}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </>
      }
      right={
        <span className="text-xs text-slate-500">Live events · Updated regularly</span>
      }
    />
  )

  const mainContent = (
    <div className="w-full space-y-4">
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found matching your filters.</p>
        </div>
      ) : (
        filteredEvents.map((event) => (
          <ErrorBoundary key={event.id}>
            <EventCard event={event} />
          </ErrorBoundary>
        ))
      )}

      {/* Results Count */}
      {filteredEvents.length > 0 && (
        <div className="mt-6 text-center text-sm text-slate-500">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )

  return (
    <PageShell
      title="Exchange Events"
      subtitle="Ongoing promos and airdrops by exchange. Find the latest trading competitions, fee rebates, and special offers."
      toolbar={toolbar}
    >
      {mainContent}
    </PageShell>
  );
}

