import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function EventAddUpdate() {
    const location = useLocation();
    const isEditMode = location.pathname.includes('/edit'); // Check if the path is for editing
    const eventData = location.state?.eventData || {}; // Get event data from props

    const [eventDetails, setEventDetails] = useState({
        name: eventData.name || '',
        date: eventData.date?.split('T')[0] || '', // Format date for input
        location: eventData.location || '',
        desc: eventData.desc || '',
        poster: null,
    });

    const [loading, setLoading] = useState(false); // State to track button loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            poster: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Disable the button
        const formData = new FormData();
        formData.append('name', eventDetails.name);
        formData.append('date', eventDetails.date);
        formData.append('location', eventDetails.location);
        formData.append('desc', eventDetails.desc);
        if (eventDetails.poster) {
            formData.append('poster', eventDetails.poster);
        }

        const url = isEditMode
            ? `http://localhost:4040/api/events/${eventData._id}`
            : 'http://localhost:4040/api/events/create';
        const method = isEditMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Keep only the Authorization header
            },
        });

        if (response.ok) {
            window.alert(isEditMode ? 'Event updated successfully' : 'Event added successfully');
            window.location.href = '/events'; // Redirect to events page after submission
        } else {
            console.error('Failed to submit event');
        }
        setLoading(false); // Re-enable the button after the request is complete
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? 'Edit Event' : 'Add Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Event Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={eventDetails.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
                        Event Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        value={eventDetails.date}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                        Event Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value={eventDetails.location}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="desc" className="block text-gray-700 font-bold mb-2">
                        Event Description
                    </label>
                    <textarea
                        name="desc"
                        id="desc"
                        value={eventDetails.desc}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="5"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="poster" className="block text-gray-700 font-bold mb-2">
                        Event Poster
                    </label>
                    <input
                        type="file"
                        name="poster"
                        id="poster"
                        onChange={handlePosterChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading} // Disable the button when loading
                >
                    {loading ? 'Submitting...' : isEditMode ? 'Update Event' : 'Add Event'}
                </button>
            </form>
        </div>
    );
}

export default EventAddUpdate;