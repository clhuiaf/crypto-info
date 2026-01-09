'use client';

import { useState, useMemo } from 'react';
import EventsHeaderFilters from '@/components/EventsHeaderFilters';
import EventCard from '@/components/EventCard';
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

  return (
    <div className="app-shell flex flex-col">
      <EventsHeaderFilters
        selectedExchange={selectedExchange}
        selectedEventType={selectedEventType}
        exchangeNames={exchangeNames}
        eventTypes={eventTypes}
        onExchangeChange={setSelectedExchange}
        onEventTypeChange={setSelectedEventType}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events List */}
        <div className="space-y-4">
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
        </div>

        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </div>
        )}
      </main>
    </div>
  );
}

