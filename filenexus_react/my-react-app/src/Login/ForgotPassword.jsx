import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/reset_password/', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-content">
      <h1 className="forgot-title">Forgot Password</h1>
        <p>Enter your email below, and if you&apos;ve made an account with us, we&apos;ll send you a link to reset your password in no time.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="form-input"/>

        <button type="submit" className="forgot-button">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
