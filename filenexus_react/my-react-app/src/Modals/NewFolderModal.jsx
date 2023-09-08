import axios from 'axios';
import {useState} from 'react';
import PropTypes from 'prop-types';

const NewFolderModal = ({onClose, onFolderCreated}) => {
    const [folderName, setFolderName] = useState('');


    const handleCreate = async () => {
        const config = {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`}
        };

        const data = {
            name: folderName,
        };

        try {
            const response = await axios.post('http://localhost:8000/folders/', data, config);
            onFolderCreated(response.data);
        } catch (error) {
            console.log('Error creating folder:', error)
        }

        onClose();
    };

    return (
        <div className="modal-overlay">
              <div className="create-folder-modal">
                <h3>Create New Folder</h3>

                <input 
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder Name"
                className="note-form" />
                <button onClick={handleCreate} className="folder-create">Create</button>
                <button onClick ={onClose}
                className="folder-cancel">Cancel</button>

              </div>
        </div>
      
        
    )

};

NewFolderModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onFolderCreated: PropTypes.func.isRequired,
};

export default NewFolderModal;

