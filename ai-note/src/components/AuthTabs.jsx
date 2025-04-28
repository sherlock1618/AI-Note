const AuthTabs = ({ activeTab, onChangeTab }) => {
    return (
      <div className="auth-tabs">
        <button 
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => onChangeTab('login')}
        >
          Login
        </button>
        <button 
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => onChangeTab('register')}
        >
          Register
        </button>
      </div>
    );
  };
  
  export default AuthTabs;