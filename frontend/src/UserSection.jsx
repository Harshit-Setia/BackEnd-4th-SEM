// UserSection.jsx
import React from 'react';

function UserSection({
  loggedIn,
  profileImage,
  handleProfileClick,
  showProfileDetails,
  userDetails,
  closeProfileDetails,
  handleLogout,
  openLoginForm,
  openSignupForm,
  errorMessage,
}) {
  if (loggedIn) {
    return (
      <div className="relative z-20">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="h-8 rounded-full mr-2 cursor-pointer"
            onClick={handleProfileClick}
          />
        )}
        {showProfileDetails && userDetails && (
          <div className="absolute top-10 right-0 bg-white border rounded shadow-md p-4 w-64 z-30">
            <button onClick={closeProfileDetails} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <h3 className="text-lg font-semibold mb-2">{userDetails.fullname}</h3>
            <p className="text-gray-600 mb-1">Username: {userDetails.username}</p>
            <p className="text-gray-600 mb-1">Email: {userDetails.email}</p>
            {userDetails.avatar && (
              <div className="mt-2">
                <img src={userDetails.avatar} alt="Profile Avatar" className="w-16 h-16 rounded-full mx-auto" />
              </div>
            )}
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded mt-3 w-full">
              Logout
            </button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <button onClick={openLoginForm} className="bg-green-500 text-white p-2 rounded">
          Login
        </button>
        <button onClick={openSignupForm} className="bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    );
  }
}

export default UserSection;