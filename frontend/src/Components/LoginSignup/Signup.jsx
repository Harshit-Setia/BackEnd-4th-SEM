import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Signup() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', fullName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('avatar', avatar);
        console.log(formData);
        fetch('http://localhost:4040/api/users/register', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Signup failed');
                }
            })
            .then((data) => {
                console.log('Signup successful:', data);
                navigate('/login'); // Redirect to login page after successful signup
                // Handle successful signup (e.g., redirect to login page)
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    };


    return (
        <>
            <form>
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

                    <div className="mb-2 w-96">
                        <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Full Name"
                            className="p-2 border border-gray-300 rounded w-full"
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="mb-2 w-96">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            className="p-2 border border-gray-300 rounded w-full"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-2 w-96">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="p-2 border border-gray-300 rounded w-full"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-2 w-96">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="p-2 border border-gray-300 rounded w-full"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4 w-96">
                        <label htmlFor="avatar" className="block text-gray-700 text-sm font-bold mb-1">
                            Avatar
                        </label>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="p-2 border border-gray-300 rounded w-full"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <button onClick={handleSubmit} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Sign Up
                    </button>
                </div>
            </form>
        </>
    );
}

export default Signup;