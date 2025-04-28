import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PasswordStrengthMeter from './passwordStrengthMeter';
import '../styles/AuthForm.css';

const AuthForm = ({
  activeTab = 'login',
  formData = { username: '', email: '', password: '' },
  errors = {},
  isLoading,
  onChange,
  onSubmit,
  onVerifyEmail
}) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={onChange}
          placeholder={activeTab === 'login' ? 'Enter your username' : 'Choose a username'}
          className={errors.username ? 'error' : ''}
        />
        {errors.username && <span className="error-text">{errors.username}</span>}
      </div>

      {activeTab === 'register' && (
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onChange}
            placeholder="your@email.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
          {formData.email && !errors.email && (
            <button 
              type="button" 
              className="verify-email"
              onClick={onVerifyEmail}
            >
              Verify Email
            </button>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password || ''}
          onChange={onChange}
          placeholder="••••••••"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      {activeTab === 'register' && formData.password && (
        <PasswordStrengthMeter password={formData.password} />
      )}

      {activeTab === 'login' && (
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot-username" className="forgot-password">
            Forgot username?
          </Link>
        </div>
      )}

      {errors.submit && (
        <div className="error-message">
          <FaExclamationTriangle /> {errors.submit}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner"></span>
        ) : activeTab === 'login' ? 'Log In' : 'Create Account'}
      </button>
    </form>
  );
};

export default AuthForm;