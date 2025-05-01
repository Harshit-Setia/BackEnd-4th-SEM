// Card.jsx
import React from 'react';
import { useState, useEffect } from 'react';

function Card({ event, onClick }) {
  if (!event) {
    return <p>No event data</p>;
  }
  return (
    <div
      key={event.id}
      onClick={() => onClick(event)} // Call the received onClick prop
      style={{ backgroundImage: `url(${event.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="h-[450px] w-full border border-gray-300 rounded-lg relative cursor-pointer " // Add cursor-pointer for visual feedback
    >
      <div
        tabIndex="0"
        className="absolute inset-0 flex flex-col justify-center items-center bg-gray-300/0 text-amber-50/0 hover:bg-gray-300/80 hover:text-black transition-opacity duration-300"
      >
        <h3 className="text-lg font-semibold p-2">{event.name}</h3>
        <h3 className="p-2">Date: {new Date(event.date).toLocaleDateString()}</h3>
        <h3 className="p-2">Location: {event.location}</h3>
      </div>
    </div>
  );
}

export function CardList({ searchQuery }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4040/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const register = (eventId) => {
    fetch(`http://localhost:4040/api/event/${eventId}/register`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(`HTTP error! status: ${response.status}, message: ${errData.message || 'Unknown error'}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        alert(data.message); // Basic feedback
        // You might want to update the UI or parent component here
      })
      .catch(error => {
        console.error("Registration error:", error);
        alert(`Error: ${error.message}`); // Basic error feedback
      });
  };
  return (
    <main className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} event={event} onClick={handleEventClick} />
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-50 flex flex-col justify-center items-center">
          <div className="w-4/5 h-4/5 bg-white p-5 relative">
            <button
              onClick={handleCloseEvent}
              className="absolute top-2 right-2 border-none bg-transparent cursor-pointer"
            >
              X
            </button>
            <h2 className="text-2xl font-semibold">{selectedEvent.name}</h2>
            <p>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p> {/* Format the date */}
            {selectedEvent.time && <p>Time: {selectedEvent.time}</p>} {/* Conditionally render time */}
            <p>Location: {selectedEvent.location}</p>
            <button onClick={() => register(selectedEvent.id)} className="bg-green-400 p-[8px] rounded cursor-pointer">Register</button> {/* Correct onClick */}
          </div>
        </div>
      )}
    </main>
  );
}