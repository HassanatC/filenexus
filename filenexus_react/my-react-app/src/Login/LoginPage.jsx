import logo from '../assets/filenexus-logo.png'
import {useState, useContext} from 'react';
import {UserContext} from '../UserContext.jsx';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {
  const [localEmail, setLocalEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser, setEmail, setIsLoggedIn} = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:8000/login/', {
      email: localEmail,
      password: password,
    });

    const data = response.data;

    if (response.status === 200) {
      console.log(data);
      setUser(data.username);
      setEmail(localEmail);
      setIsLoggedIn(true);
      window.localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert(data.error);
    }
  } catch(error) {
    console.error("Error: ", error);
  }
};

return (
  <div className="reg-content">
    <img src={logo} alt="FileNexus Logo" className="reg-logo" />
    <h1 className="reg-title">Log in to your account</h1>
    <p className="reg-subtitle">Welcome back!</p>

    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="form-button">Login</button>
        <p className="forgot-pass-text"><Link to="/forgot-password">Forgot Password?</Link></p>

        <p className="reg-new">New around here?</p>
        <p className="reg-subtitle">Sign up now and get 10GB of storage for completely free!</p>

        <button className="form-button" onClick={() => navigate('/register')}>Sign Me Up</button>
      </form>
    </div>
  </div>
);
};

  export default LoginPage;