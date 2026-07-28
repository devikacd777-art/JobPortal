import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.5px' }}>
    Job<span style={{ color: '#60a5fa' }}>Portal</span>
</Link>
      <div className="navbar-links">
        {(!user || user.role === 'jobseeker') && <Link to="/">Jobs</Link>}
        {user ? (
          <>
          {user.role === 'jobseeker' && (
  <Link to="/my-applications">My Applications</Link>
)}
{user.role === 'employer' && (
 <Link to="/recruiter/dashboard">Recruiter Dashboard</Link>
)}
            <span>Hi, {user.name}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/search">Search</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;