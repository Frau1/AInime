import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Nav = () => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
  await signOut();
  navigate('/');
  };

  const linkClass = (path: string) =>
    `nav-link${location.pathname === path ? ' active' : ''}`;

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        AI<span style={{ color: 'var(--neon-cyan)', WebkitTextFillColor: 'var(--neon-cyan)' }}>nime</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={linkClass('/')}>Home</Link>
        {session && (
  <>
    <Link to="/dashboard" className={linkClass('/dashboard')}>
      Dashboard
    </Link>

    <Link to="/profile" className={linkClass('/profile')}>
      Profile
    </Link>
  </>
)}
        <Link to="/results" className={linkClass('/results')}>Explore</Link>
        {session ? (
          <button className="neon-btn nav-auth-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="neon-btn nav-auth-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;