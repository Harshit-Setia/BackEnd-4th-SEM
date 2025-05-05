import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false); // State to track if the user is registered
    const [head, setHead] = useState(false); // State to track if the user is the event creator
    const [showAttendees, setShowAttendees] = useState(false); // State to toggle attendees list

    useEffect(() => {
        const fetchEvent = async () => {
            const response = await fetch(`http://localhost:4040/api/events/${id}`);
            const data = await response.json();
            setEventData(data);

            // Get userId from localStorage and check if the user is the creator or in attendees
            const userId = localStorage.getItem('userId');
            if (userId === data.head) {
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

    const handleClick = async () => {
        const userId = localStorage.getItem('userId');
        if (isRegistered) {
            // Unregister the user
            const confirmUnregister = window.confirm('Are you sure you want to unregister from this event?');
            if (!confirmUnregister) return;

            try {
                const response = await fetch(`http://localhost:4040/api/events/${id}/register`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    setIsRegistered(false); // Update state to reflect unregistration
                    alert('Successfully unregistered from the event.');
                    navigate(-1); // Navigate back to the previous page
                } else {
                    console.error('Error unregistering from event');
                }
            } catch (error) {
                console.error('Error unregistering from event:', error);
            }
        } else {
            // Register the user
            const confirmRegister = window.confirm('Do you want to register for this event?');
            if (!confirmRegister) return;

            try {
                const response = await fetch(`http://localhost:4040/api/events/${id}/register`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    setIsRegistered(true); // Update state to reflect registration
                    alert('Successfully registered for the event.');
                    navigate(-1); // Navigate back to the previous page
                } else {
                    window.alert('Login to register for the event');
                    navigate('/login'); // Redirect to login page if not authenticated
                    console.error('Error registering for event');
                }
            } catch (error) {
                console.error('Error registering for event:', error);
            }
        }
    };

    const handleEdit = () => {
        // Navigate to the edit page and pass event data as state
        navigate(`/events/${id}/edit`, { state: { eventData } });
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (!confirmDelete) return;

        fetch(`http://localhost:4040/api/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert('Event deleted successfully');
                    navigate('/events'); // Redirect to events page after deletion
                } else {
                    alert('Failed to delete event');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 lg:p-6 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center md:items-start">
            {/* Back Button */}
            

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
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
                Back
            </button>
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
                    <div className="flex flex-col space-y-4 mt-4">
                        <div className="flex space-x-4">
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
                        <button
                            onClick={() => setShowAttendees(!showAttendees)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            {showAttendees ? 'Hide Attendees' : 'Show Attendees'}
                        </button>
                        {showAttendees && (
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold mb-2">Attendees:</h3>
                                <ul className="list-disc pl-5">
                                    {eventData.attendees && eventData.attendees.length > 0 ? (
                                        eventData.attendees.map((attendee, index) => (
                                            <li key={index} className="text-gray-700">
                                                {attendee}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No attendees yet.</p>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventDetails;