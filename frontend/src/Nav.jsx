// Nav.jsx
import React, { useState, useEffect } from 'react';
import ThemeSelector from "./ThemeSelector";
import UserSection from "./UserSection";
import LoginForm from "./Components/Login-Signup/LoginForm";
import SignupForm from "./Components/Login-Signup/SignupForm";

export function Nav({ theme, toggleTheme, searchQuery, setSearchQuery }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    avatar: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showLoginFormPopup, setShowLoginFormPopup] = useState(false);
  const [showSignupFormPopup, setShowSignupFormPopup] = useState(false);

  const fetchUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:4040/api/users/${id}`);
      // console.log(`Response from /api/users/${id}:`, response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch user: ${errorData.message || response.statusText}`);
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        setLoggedIn(true);
        try {
          const user = await fetchUser("profile");
          setUserId(user._id);
          setProfileImage(user.avatar || "src/img/default-avatar.png");
        } catch (error) {
          console.error("Error fetching initial user data:", error);
          setProfileImage(null);
          setUserId(null);
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
        setProfileImage(null);
        setUserId(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:4040/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      // console.log("Response from /api/users/login:", response);

      if (response.ok) {
        const data = await response.json();
        setLoggedIn(true);
        setUserId(data.user._id);
        setProfileImage(data.user.avatar || "src/img/default-avatar.png");
        setShowProfileDetails(false);
        setShowLoginFormPopup(false); // Close login popup on success
        // console.log("Login successful, cookies should be set by backend");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Failed to connect to the server");
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:4040/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      

      if (response.ok) {
        setShowSignupFormPopup(false); // Close signup popup on success
        alert("Signup successful! Please log in.");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Failed to connect to the server");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4040/api/users/logout", {
        method: "PUT",
      });

      if (response.ok) {
        setLoggedIn(false);
        setProfileImage(null);
        setUserId(null);
        setShowProfileDetails(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setErrorMessage("Failed to connect to the server");
    }
  };

  const handleProfileClick = async () => {
    if (loggedIn && userId) {
      try {
        const user = await fetchUser(userId);
        setUserDetails(user);
        setShowProfileDetails(true);
        // console.log("Fetched user details:", user);
      } catch (error) {
        alert(`Error fetching user details: ${error.message}`);
        setShowProfileDetails(false);
      }
    } else {
      console.warn("Not logged in or userId not available to fetch profile.");
      setShowProfileDetails(false);
    }
  };

  const closeProfileDetails = () => {
    setShowProfileDetails(false);
  };

  const openLoginForm = () => {
    setShowLoginFormPopup(true);
    setErrorMessage(""); // Clear any previous errors
  };

  const closeLoginForm = () => {
    setShowLoginFormPopup(false);
    setErrorMessage("");
  };

  const openSignupForm = () => {
    setShowSignupFormPopup(true);
    setErrorMessage(""); // Clear any previous errors
  };

  const closeSignupForm = () => {
    setShowSignupFormPopup(false);
    setErrorMessage("");
  };

  return (
    <nav className="flex justify-between p-2 bg-gray-300 dark:bg-gray-400 sticky w-full duration-500 z-100">
      <input
        type="text"
        placeholder="Search Events..."
        className="p-2 border rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex items-center gap-4">
        <ThemeSelector theme={theme} toggleTheme={toggleTheme} />
        <UserSection
          loggedIn={loggedIn}
          profileImage={profileImage}
          handleProfileClick={handleProfileClick}
          showProfileDetails={showProfileDetails}
          userDetails={userDetails}
          closeProfileDetails={closeProfileDetails}
          handleLogout={handleLogout}
          openLoginForm={openLoginForm}
          openSignupForm={openSignupForm}
          errorMessage={errorMessage}
        />
      </div>

      {showLoginFormPopup && (
        <LoginForm
          loginData={loginData}
          handleLoginChange={handleLoginChange}
          handleLogin={handleLogin}
          errorMessage={errorMessage}
          onClose={closeLoginForm}
        />
      )}

      {showSignupFormPopup && (
        <SignupForm
          signupData={signupData}
          handleSignupChange={handleSignupChange}
          handleSignup={handleSignup}
          errorMessage={errorMessage}
          onClose={closeSignupForm}
        />
      )}
    </nav>
  );
}