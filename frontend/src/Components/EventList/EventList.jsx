import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';

function EventList({ filter = 'all', onUnregister, hideFilter = false }) {
  const [eventData, setEventData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(filter); // State for filter dropdown
  const userId = localStorage.getItem('userId'); // Get user ID from local storage

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4040/api/events');
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on the `currentFilter` state and search query
    let eventsToDisplay = eventData;

    if (currentFilter === 'registered') {
      eventsToDisplay = eventData.filter((event) =>
        event.attendees && event.attendees.includes(userId)
      );
    } else if (currentFilter === 'notRegistered') {
      eventsToDisplay = eventData.filter(
        (event) => event.attendees && !event.attendees.includes(userId)
      );
    }

    if (searchQuery.trim() !== '') {
      eventsToDisplay = eventsToDisplay.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(eventsToDisplay);
  }, [eventData, currentFilter, searchQuery, userId]);

  return (
    <main className="p-5">
      {/* Search Bar and Filter Dropdown */}
      {!hideFilter && (
        <div className="mb-4 flex items-center space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded w-64"
          />

          {/* Filter Dropdown */}
          <select
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Events</option>
            <option value="registered">Registered Events</option>
            <option value="notRegistered">Not Registered Events</option>
          </select>
        </div>
      )}

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
  {filteredEvents.length === 0 ? (
    <p className="text-2xl text-zinc-900 col-span-full text-center">No events found</p>
  ) : (
    filteredEvents.map((event) => (
      <EventCard
        event={event}
        key={event._id}
        onUnregister={onUnregister}
      />
    ))
  )}
</div>
    </main>
  );
}

export default EventList;