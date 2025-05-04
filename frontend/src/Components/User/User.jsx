import React, { useEffect, useState } from 'react';
import EventList from '../EventList/EventList';
import { useLocation } from 'react-router-dom';

function User() {
  const [userData, setUserData] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const location = useLocation();

  useEffect(() => {
    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:4040/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setUserData(data);
        setRegisteredEvents(data.registeredEvent || []);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUnregister = (eventId) => {
    // Remove the event from the registered events list
    setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditForm({
      username: userData?.username || '',
      email: userData?.email || '',
      fullname: userData?.fullname || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the updated fields only
      const updatedFields = {};
      if (editForm.fullname !== userData.fullname) updatedFields.fullname = editForm.fullname;
      if (editForm.username !== userData.username) updatedFields.username = editForm.username;
      if (editForm.email !== userData.email) updatedFields.email = editForm.email;

      const response = await fetch('http://localhost:4040/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedFields), // Send only updated fields
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
        setIsEditing(false);
      } else {
        console.error('Error updating user:', data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-5"> {/* Ensure full height */}
      {userData && (
        <div className="flex flex-col md:flex-row flex-grow space-y-4 md:space-y-0 md:space-x-8">
          {/* User Info Section */}
          <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded shadow">
            <img
              src={userData.avatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold text-center">{userData.fullname}</h2>
                <p className="text-center text-gray-600">@{userData.username}</p>
                <p className="text-center text-gray-600">{userData.email}</p>
                <button
                  onClick={handleEditToggle}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="fullname"
                  value={editForm.fullname}
                  onChange={handleEditChange}
                  placeholder="Full Name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  placeholder="Username"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Registered Events Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-bold mb-4">Registered Events</h2>
            <EventList
              registeredEvents={registeredEvents}
              filter="registered"
              onUnregister={handleUnregister}
              hideFilter={location.pathname === '/user'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default User;