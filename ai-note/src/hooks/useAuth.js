import { useState } from 'react';
import { useAuthCheck } from '../context/AuthContext';
import { loginUser, registerUser, verifyEmail, logout } from '../services/authentication';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const { authState, setAuthState } = useAuthCheck(); 
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'register' && !formData.email.includes('@')) {
      newErrors.email = 'Valid email required';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be 8+ characters';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      if (activeTab === 'register') {
        response = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        navigate('/'); 
      } else {
        response = await loginUser({
          username: formData.username,
          password: formData.password
        });
        
        if (response.error) {
          setErrors({ submit: response.error });
          return;
        }

        setAuthState({
          isAuthenticated: true,
          user: response.user
        });
        
        navigate('/notes');  
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!formData.email.includes('@')) {
      setErrors({ email: 'Valid email required for verification' });
      return;
    }

    try {
      setIsLoading(true);
      await verifyEmail(formData.email);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } catch (error) {
      setErrors({ email: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
    } catch (error) {
      setErrors({ social: `Failed to login with ${provider}` });
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try{
      await logout();
      navigate('/');
    } catch(err){
      setErrors({logout: err.message});
    } finally {
      setIsLoading(false);
    }

  }

  return {
    activeTab,
    setActiveTab,
    formData,
    errors,
    isLoading,
    emailSent,
    authState,  
    setAuthState,    
    handleChange,
    handleSubmit,
    handleEmailVerification,
    handleSocialLogin,
    handleLogout,
  };
};

export default useAuth;
