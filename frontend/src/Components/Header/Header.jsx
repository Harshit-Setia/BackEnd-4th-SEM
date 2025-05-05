import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [token, setToken] = useState(localStorage.getItem('token')); // State to track token
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.dispatchEvent(new Event('tokenChanged')); // Dispatch custom event
        setToken(null); // Update local state
        window.location.reload();
    };

    useEffect(() => {
        const handleTokenChange = () => {
            setToken(localStorage.getItem('token')); // Update token state when token changes
        };

        // Listen for custom event
        window.addEventListener('tokenChanged', handleTokenChange);

        // Listen for `storage` event to handle changes across tabs/windows
        window.addEventListener('storage', handleTokenChange);
        // window.location.reload(); // Reload the page to ensure the latest token is fetched
        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange); // Cleanup custom event listener
            window.removeEventListener('storage', handleTokenChange); // Cleanup storage event listener
        };
    }, []);

    return (
        <header className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center h-16">
            <button  onClick={() => navigate('/')} className="focus:outline-none cursor-pointer">
                <img src="../../home.png" className="h-10" alt="EventSync" />
            </button>
            <nav className="flex space-x-4">
                <a href="/events" className="hover:text-gray-400">Events</a>
                {token ? (<>
                    <a href="/user" className="hover:text-gray-400">User</a>
                    <p onClick={handleLogout} className="hover:text-gray-400 cursor-pointer">Logout</p>
                    </>
                ) : (
                    <>
                        <a href="/login" className="hover:text-gray-400">Login</a>
                        <a href="/signup" className="hover:text-gray-400">Signup</a>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;