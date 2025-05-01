// SignupForm.jsx
import React from 'react';

function SignupForm({ signupData, handleSignupChange, handleSignup, errorMessage, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-600 p-6 rounded shadow-md relative w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5 fill-current dark:text-white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <h2 className="text-xl dark:text-white font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-2 dark:text-white">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={signupData.username}
            onChange={handleSignupChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupData.email}
            onChange={handleSignupChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupData.password}
            onChange={handleSignupChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={signupData.fullname}
            onChange={handleSignupChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL"
            value={signupData.avatar}
            onChange={handleSignupChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Sign Up
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignupForm;