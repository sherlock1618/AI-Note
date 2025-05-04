import React from 'react';
import '../styles/Logo.css'; 

const Logo = ({ size = 40 }) => (
  <div
    className="logo-container"
    style={{ width: 'fit-content', height: size }}
  >
    <div style={{ width: size, height: size }}>
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
      <rect x="10" y="8" width="36" height="48" rx="4" stroke="white" strokeWidth="4" />
      <line x1="16" y1="20" x2="38" y2="20" stroke="#03dac6" strokeWidth="3" />
      <line x1="16" y1="28" x2="38" y2="28" stroke="#03dac6" strokeWidth="3" />
      <line x1="16" y1="36" x2="30" y2="36" stroke="#03dac6" strokeWidth="3" />
      <path d="M44 44L52 52" stroke="#6200ee" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 38L38 46" stroke="#6200ee" strokeWidth="4" strokeLinecap="round" />
    </svg>

    </div>
    <span className="logo-text">Noteable</span>
  </div>

);

export default Logo;