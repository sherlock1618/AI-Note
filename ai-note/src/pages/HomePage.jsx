import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import AuthForm from '../components/AuthForm';
import AuthTabs from '../components/AuthTabs';
import SocialAuth from '../components/SocialAuth';
import '../styles/HomePage.css';

const HomePage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const {
    activeTab,
    setActiveTab,
    formData,
    errors,
    isLoading,
    emailSent,
    handleChange,
    handleSubmit,
    handleEmailVerification,
    handleSocialLogin,
    handleLogout,
  } = useAuth();

  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      <div className='right-header'>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className='logout cta-primary' onClick={handleLogout}>
          Logout
        </button>
      </div>
      <AnimatePresence>
        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="verification-banner"
          >
            <FaCheckCircle /> Verification email sent to {formData.email}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.header 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <h1>
            <span className="gradient-text">AI-Powered</span> Note Taking
          </h1>
          <p className="hero-subtitle">
            Organize your thoughts with intelligent suggestions and seamless sync
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">Try For Free</button>
            <button className="cta-secondary">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="mockup-notes">
            <div className="mockup-note" style={{ transform: 'rotate(-5deg)' }}></div>
            <div className="mockup-note" style={{ transform: 'rotate(3deg)' }}></div>
          </div>
        </div>
      </motion.header>
      <motion.section 
        className="auth-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SocialAuth 
          onSocialLogin={handleSocialLogin} 
          isLoading={isLoading} 
        />
        <AuthTabs 
          activeTab={activeTab} 
          onChangeTab={setActiveTab} 
        />
        <AuthForm
          activeTab={activeTab}
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onVerifyEmail={handleEmailVerification}
        />
      </motion.section>
    </div>
  );
};

export default HomePage;