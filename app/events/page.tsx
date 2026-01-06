'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
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
    <div className="app-shell">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Exchange Events
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Ongoing promos and airdrops by exchange
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Exchange Filter */}
          <div className="flex flex-wrap gap-2">
            <label className="text-sm font-medium text-slate-700 self-center">Exchange:</label>
            <div className="flex flex-wrap gap-2">
              {exchangeNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedExchange(name)}
                  className={`pill-tab ${
                    selectedExchange === name
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : ''
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Event Type Filter */}
          <div className="flex flex-wrap gap-2 ml-auto">
            <label className="text-sm font-medium text-slate-700 self-center">Type:</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedEventType(type)}
                  className={`pill-tab ${
                    selectedEventType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : ''
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

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

