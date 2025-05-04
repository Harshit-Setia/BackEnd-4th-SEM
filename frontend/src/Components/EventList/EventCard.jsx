import React from 'react';
import { useNavigate } from 'react-router-dom';

function EventCard({ event }) {
  const navigate = useNavigate();

  if (!event) {
    return <p>No event data</p>;
  }

  const handleNavigation = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <div
      onClick={handleNavigation}
      style={{
        backgroundImage: `url(${event.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="h-[450px] w-full border border-gray-300 rounded-lg relative cursor-pointer"
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

export default EventCard;