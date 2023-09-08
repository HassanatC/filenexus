import logo from '../assets/filenexus-logo.png'
import { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);


  const handleSubmit = async (event) => {
    event.preventDefault();


    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
    return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/register/', {
        username,
        password,
        email,
      });
  
      const data = response.data;
  
      if (data.message) {
        setMessage(data.message);
        window.localStorage.setItem('token', data.token);
      } else if (data.username) {
        setMessage('This username is already taken.');
      } else if (data.email) {
        setMessage('This email is already taken.');
      } else {
        setMessage('Unknown error. Please try again.');
      }
      console.log(data);
    } catch(error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        
      } else if (error.request) {
        console.log(error.request);
      } else {

        console.log('Error', error.message);
      }
    }
  };
  
  
    return (
      <div className="reg-content">
        <img src={logo} alt="FileNexus Logo" className="reg-logo" />
        <h1 className="reg-title">Register today and get started!</h1>
        <p className="reg-text">With FileNexus, you get 10GB of cloud-based storage in our system for completely free.</p>
        <p className="reg-text">Simply fill out your details below and get started with us today.</p>
  
        <div className="form-container">

          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" className="form-input"
            value={username}
            onChange={e => setUsername(e.target.value)} />

            <input type="email" placeholder="Email Address" className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)} />

            <input type="password" placeholder="Password" className="form-input"
            value={password}
            onChange={e => setPassword(e.target.value)} />

            <input type="password" placeholder="Confirm Password" className="form-input"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} />

    
            <button type="submit" className="form-button">Register</button>
          </form>

          {message && <div className="message">{message}</div>}

        </div>
      </div>
    );
  };
  
  export default RegisterPage;