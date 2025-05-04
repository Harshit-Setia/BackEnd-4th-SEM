import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Track login status

    useEffect(() => {
        const handleTokenChange = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token); // Update login status based on token presence
        };

        window.addEventListener('tokenChanged', handleTokenChange); // Listen for custom event

        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange); // Cleanup listener on unmount
        };
    }, []);

    return (
        <div
            className="h-[calc(100vh-128px)] w-full bg-cover bg-center"
            style={{
                backgroundImage: `url(../../p2.jpeg)`, // Use the imported image
            }}
        >
            <div className="bg-black/50 h-full w-full flex flex-col items-center justify-center text-white">
                <h1 className="text-5xl font-bold mb-4">EventSync</h1>
                <p className="text-lg mb-8">Your Events, Perfectly in Sync</p>

                <div className="flex flex-col items-center space-y-4">
                    {!isLoggedIn && (
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                            >
                                Signup
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/events')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                    >
                        Explore Events {">>"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;