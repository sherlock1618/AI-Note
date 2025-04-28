import React from 'react';
import '../styles/Logo.css'; 

const Logo = ({ size = 50 }) => (
  <div className="logo-container" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M20 80V20L40 50L60 20V80" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="75" cy="30" r="5" fill="#03dac6" />
      <circle cx="75" cy="50" r="5" fill="#6200ee" />
      <circle cx="75" cy="70" r="5" fill="#03dac6" />
    </svg>
    <span className="logo-text">NoteyAI</span>
  </div>
);

export default Logo;