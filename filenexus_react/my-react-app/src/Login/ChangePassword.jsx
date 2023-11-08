import {useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');

    const {uidb64, token} = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (newPassword !== confirmPassword) {
          setMessage('New passwords do not match.');
          return;
        }
      
        try {
            const response = await axios.post(`http://localhost:8000/change-password/confirm/${uidb64}/${token}/`, {

            new_password: newPassword,
          }, {
            headers: {
            }
          });
      
          const data = response.data;
      
          if (data.message) {
            setMessage(data.message);
          } else {
            setMessage('Unknown error. Please try again.');
          }
        } catch(error) {
          console.log('Error: ', error)
          console.log('Error response:', error.response)
          if (error.response) {
            console.log('Error status:', error.response.status)
            console.log('Error data', error.response.data)
          }
        }
      };



return (
    <div className="change-content">
        
        <form onSubmit={handleSubmit}>
            <input type="password" placeholder="New Password" className="form-input" value={newPassword}
            onChange={e => setNewPassword(e.target.value)} />

            <input type="password" placeholder="Confirm Password" className="form-input" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} />

            <button type="submit" className="form-button">Change Password</button>
        </form>

        {message && <div className="message">{message}</div>}
    </div>
    );
};

export default ChangePassword;