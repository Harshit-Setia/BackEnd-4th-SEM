// LoginForm.jsx
import React from 'react';

function LoginForm({ loginData, handleLoginChange, handleLogin, errorMessage, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-600 p-6 rounded shadow-md relative w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5 fill-current dark:text-white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-2 dark:text-white">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Login
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;