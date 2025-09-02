import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';     // Linking the CSS file
import App from './App';

// Creating root and rendering the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
