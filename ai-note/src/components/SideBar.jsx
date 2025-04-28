import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import '../styles/SideBar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Logo size={50} />      
      <nav>
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          <span>🏠</span> Home
        </Link>
        <Link 
          to="/notes" 
          className={location.pathname.startsWith('/notes') ? 'active' : ''}
        >
          <span>📝</span> Your Notes
        </Link>
        <Link 
          to="/trash" 
          className={location.pathname === '/trash' ? 'active' : ''}
        >
          <span>🗑️</span> Trash
        </Link>
      </nav>

      <div className="sidebar-footer">
        <p>v1.0.0</p>
        <p>© 2023 AI Note</p>
      </div>
    </div>
  );
}

export default Sidebar;