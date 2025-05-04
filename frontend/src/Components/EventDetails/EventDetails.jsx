import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { register } from './register'; // Assuming you have an unregister function

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false); // State to track if the user is registered
    const [head, setHead] = useState(false); // State to track if the user is the event creator

    useEffect(() => {
        const fetchEvent = async () => {
            const response = await fetch(`http://localhost:4040/api/events/${id}`);
            const data = await response.json();
            setEventData(data);

            // Get userId from sessionStorage and check if the user is the creator or in attendees
            const userId = localStorage.getItem('userId');
            if (userId == data.head) {
                setHead(true); // Update state if the user is the creator
            } else if (data.attendees && data.attendees.some((attendeeId) => attendeeId === userId)) {
                setIsRegistered(true); // Update state if the user is registered
            }
        };
        fetchEvent();
    }, [id]);

    if (!eventData) {
        return <p>No event data</p>;
    }

    const handleClick = () => {
        const userId = sessionStorage.getItem('userId');
        if (isRegistered) {
            // Unregister the user
            register(id, userId); // Call the unregister function
            setIsRegistered(false); // Update state to reflect unregistration
        } else {
            // Register the user
            register(id, userId); // Call the register function
            setIsRegistered(true); // Update state to reflect registration
        }
    };

    const handleEdit = () => {
        // Navigate to the edit page and pass event data as state
        navigate(`/events/${id}/edit`, { state: { eventData } });
    };

    const handleDelete = () => {
        fetch(`http://localhost:4040/api/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                window.alert('Event deleted successfully');
                navigate('/events'); // Redirect to events page after deletion
            }
            else {
                window.alert('Failed to delete event');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 lg:p-6 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center md:items-start">
            {/* Right Section: Event Image */}
            <div className="w-full md:w-1/2 lg:w-1/2 md:order-2 mb-4 md:mb-0">
                <img
                    src={eventData.poster}
                    alt={eventData.name}
                    className="w-full h-auto lg:max-h-[550px] xl:max-h-[600px] object-cover rounded-lg"
                />
            </div>

            {/* Left Section: Event Details */}
            <div className="w-full md:w-1/2 lg:w-1/2 md:pr-6">
                <h2 className="text-2xl font-bold mb-4">{eventData.name}</h2>
                <p className="text-gray-700 mb-2">Date: {new Date(eventData.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-2">Location: {eventData.location}</p>
                <p className="text-gray-700">{eventData.description}</p>

                {/* Buttons for Registered Users */}
                {!head && (
                    <button
                        onClick={handleClick}
                        className={`${
                            isRegistered ? 'bg-gray-500' : 'bg-blue-500'
                        } text-white px-4 py-2 rounded-lg mt-4 cursor-pointer`}
                    >
                        {isRegistered ? 'Unregister' : 'Register'}
                    </button>
                )}

                {/* Buttons for Event Creator */}
                {head && (
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={handleEdit}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            Edit Event
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            Delete Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventDetails;