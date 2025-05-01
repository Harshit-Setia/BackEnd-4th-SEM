// ThemeSelector.jsx
import React from 'react';

const ThemeSelector = ({ theme, toggleTheme }) => {
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 border rounded mr-2"
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeSelector;