import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const ChangeUserModal = ({ onChangeUsername, onClose }) => {

    const [changeUser, setChangeUser] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const handleUserChange = async () => {
        setChangeUser(true);

        const config = {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          };

        try {
            const response = await axios.patch(`http://localhost:8000/change_username/`, { new_username: newUsername }, config)

            onChangeUsername(newUsername);
            console.log('Username changed successfully:', response.data);
            onClose();
        } catch (error) {
            console.error('Error: ', error)
        }

        setChangeUser(false);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Change your Username</h2>
                <button className="modal-close-button" onClick={onClose}>X</button>
                <p className="subtitle">Change your username in the form below, and press the submit button to confirm this. Remember that you need your email to log into your account:</p>
                <form>
                    <input
                    type="text"
                    placeholder="Change your username here.."
                    className="search-form"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                  />
                </form>

                <button className="change-user-button" onClick={handleUserChange}>Submit</button>
                {changeUser && <p>Changing username...</p>}
            </div>
        </div>
    )

}

ChangeUserModal.propTypes = {
    onChangeUsername: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ChangeUserModal;