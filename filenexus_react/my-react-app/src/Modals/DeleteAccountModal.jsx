import PropTypes from 'prop-types';
import axios from 'axios';
import { useContext, useState } from 'react'
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccountModal = ({ onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const {email, setIsLoggedIn} = useContext(UserContext);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setDeleting(true);

    const config = {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }, data: {
        email: email
      }
    };
      
    try {
        const response = await axios.delete(`http://localhost:8000/delete_account/${email}/`, config);
      console.log(response.data);

      setIsLoggedIn(false);
      localStorage.removeItem('token');
      navigate('/');
      onClose(); 
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h2>Delete Account</h2>
        <div className="modal-file-area">
          <p>Are you sure that you want to delete your account? This action is irreversible - you will not be able to recover your account, and your data will be lost.</p>
          <button onClick={handleDeleteAccount} className="delete-button" disabled={deleting}>Delete</button>
        </div>
        {deleting ? <span className="delete-text">Deleting...</span> : null}
      </div>
    </div>
  );
};

DeleteAccountModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default DeleteAccountModal;