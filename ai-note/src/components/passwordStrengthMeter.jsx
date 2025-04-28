import { useEffect, useState } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      let messages = [];
      
      if (password.length >= 8) score += 1;
      else messages.push('At least 8 characters');
      
      if (/[A-Z]/.test(password)) score += 1;
      else messages.push('Uppercase letter');
      if (/[0-9]/.test(password)) score += 1;
      else messages.push('Number');
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      else messages.push('Special character');
      
      setStrength(score);
      setFeedback(messages.length ? `Missing: ${messages.join(', ')}` : 'Strong password!');
    };

    calculateStrength();
  }, [password]);

  return (
    <div className="password-meter">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`bar ${i <= strength ? 'active' : ''}`}
            data-strength={strength}
          />
        ))}
      </div>
      <div className="strength-feedback">{feedback}</div>
    </div>
  );
};

export default PasswordStrengthMeter;