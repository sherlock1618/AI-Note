import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';

const SocialAuth = ({ onSocialLogin, isLoading }) => {
  return (
    <div className="social-login">
      <h3>Quick Access</h3>
      <div className="social-buttons">
        <button 
          onClick={() => onSocialLogin('google')}
          disabled={isLoading}
          aria-label="Login with Google"
        >
          <FaGoogle />
        </button>
        <button 
          onClick={() => onSocialLogin('github')}
          disabled={isLoading}
          aria-label="Login with GitHub"
        >
          <FaGithub />
        </button>
        <button 
          onClick={() => onSocialLogin('facebook')}
          disabled={isLoading}
          aria-label="Login with Facebook"
        >
          <FaFacebook />
        </button>
      </div>
      <div className="divider">
        <span>or continue with email</span>
      </div>
    </div>
  );
};

export default SocialAuth;