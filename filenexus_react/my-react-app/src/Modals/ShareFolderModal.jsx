import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ShareFolderModal = ({ onClose, onShareSuccess }) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            const config = {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            };

            try {
                const response = await axios.get('http://localhost:8000/folders/list/', config);
                setFolders(response.data);
            } catch (error) {
                console.error('Error fetching folders: ', error);
                setError('Error fetching folders');
            }
        };

        fetchFolders();
    }, []);

    const handleFolderSelection = (folder) => {
        setSelectedFolder(folder);
        setError(null);
    };

    const handleShareFolder = async () => {
        if (selectedFolder && email) {
            const config = {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            };

            try {
                await axios.post(`http://localhost:8000/folders/${selectedFolder.id}/share/`, { email }, config);
                onShareSuccess();
                onClose();
            } catch (error) {
                console.error('Error sharing folder: ', error);
                setError('There was an error sharing the folder.');
            }
        } else {
            setError('Folder not selected, or correct email has not provided');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>X</button>
                <h2>Select a folder to share</h2>
                <div className="modal-folder-add">
                    {folders.map((folder) => (
                        <div key={folder.id}
                            className={selectedFolder && selectedFolder.id === folder.id ? 'selected' : ''}>
                            <input
                                type="radio"
                                id={`folder-${folder.id}`}
                                name="share-folder-radio"
                                onChange={() => handleFolderSelection(folder)}
                            />
                            <label htmlFor={`folder-${folder.id}`}>{folder.name}</label>
                        </div>
                    ))}
                </div>

                <p className="subtext">And the user you would like to send your folder to:</p>

                <input
                    type="email"
                    placeholder="Enter the email.."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="search-form"
                />

                <button onClick={handleShareFolder} className="folder-share">Share Folder</button>

                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

ShareFolderModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onShareSuccess: PropTypes.func.isRequired,
};

export default ShareFolderModal;
