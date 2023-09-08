import { Link, useNavigate } from 'react-router-dom';
import {useContext} from 'react';
import {UserContext} from './UserContext.jsx';
const Nav = () => {

  const {isLoggedIn, setIsLoggedIn} = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <nav className="topnav">
      <div className="nav-container">
      <Link to="/">Home</Link>
      {!isLoggedIn && <Link to="/register">Register</Link>}
      {!isLoggedIn && <Link to="/login">Login</Link>}
      <Link to="/about">About</Link>
      {isLoggedIn && <Link to="/dashboard">Dashboard</Link>} 
      {isLoggedIn && <Link to="/" onClick={handleLogout}>Logout</Link>}     
      </div>
    </nav>
  );
};

export default Nav;