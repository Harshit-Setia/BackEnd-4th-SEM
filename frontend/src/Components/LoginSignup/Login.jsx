import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(event) {
        event.preventDefault();
        const user = { email, password };

        fetch('http://localhost:4040/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Login failed');
                }
            })
            .then((data) => {
                localStorage.setItem('userId', data._id); // Store userId in sessionStorage
                localStorage.setItem('token', data.token); // Store token in localStorage

                // Trigger a custom event to notify Header about the login
                window.dispatchEvent(new Event('storage'));

                navigate('/events'); // Redirect to home page
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <p className="flex text-black text-s italic mb-4">Don't have account?<p onClick={()=>window.location.href='/signup'} className='cursor-pointer text-blue-500 active:text-red-500'> Signup</p></p>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;