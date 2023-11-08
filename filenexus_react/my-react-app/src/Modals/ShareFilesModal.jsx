import { useEffect, useState } from 'react';
import { getFileTypeIcon } from '../fileHelpers';
import layersIcon from '../assets/layers.svg';
import axios from 'axios';
import PropTypes from 'prop-types';

const ShareFilesModal = ({ onClose, onShareSuccess }) => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [files, setFiles] = useState([]);
    const [selectedFileIds, setSelectedFileIds] = useState(new Set());
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [showNote, setShowNote] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchFiles = async () => {
            const config = {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                params: { page: currentPage, page_size: pageSize },
            };

            try {
                const response = await axios.get('http://localhost:8000/files/', config);
                setFiles(response.data);

                if (response.data.length < pageSize) {
                    setTotalPages(currentPage);
                  } else {
                    setTotalPages(undefined);
                  }
            } catch (error) {
                console.error('Error fetching files: ', error);
                setError('Error fetching files');
            }
        };

        fetchFiles();
    }, [currentPage]);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
      };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

    const handleFileSelection = (file) => {
        const newSelectedFileIds = new Set(selectedFileIds);
        if (newSelectedFileIds.has(file.id)) {
            newSelectedFileIds.delete(file.id);
        } else {
            newSelectedFileIds.add(file.id);
        }
        setSelectedFileIds(newSelectedFileIds);
        setError(null);
    };

    const handleShareFile = async () => {
        if (selectedFileIds.size > 0 && email) {
            const fileIds = Array.from(selectedFileIds);  
            const config = {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            };

            try {
                await axios.post(`http://localhost:8000/files/share/`, { email, file_ids: fileIds, note }, config);
                onShareSuccess();
                onClose();
            } catch (error) {
                console.error('Error sharing files: ', error);
                setError('Error sharing files');
            }
        } else {
            setError('Files not selected or email not provided');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Share File(s)</h2>
                <button className="modal-close-button" onClick={onClose}>X</button>
                <div className="file-list-modal">
                    {files.map((file) => {
                        const fileIcon = getFileTypeIcon(file.name) || layersIcon;
                        const dateUploaded = new Date(file.uploaded_at).toLocaleDateString();
                        
                        return (
                            <div key={file.id} className={`file-item ${selectedFileIds.has(file.id) ? 'selected' : ''}`}>
                                <img src={fileIcon} alt="File icon" className="file-icon" />
                                <div className="file-content">
                                    <input
                                        type="checkbox"
                                        id={`file-${file.id}`}
                                        name="share-file-checkbox"
                                        checked={selectedFileIds.has(file.id)}
                                        onChange={() => handleFileSelection(file)}
                                    />
                                    <label htmlFor={`file-${file.id}`}>{file.name}</label>
                                    
                                    <div className="file-info-container">
                                        <p className="file-info">Size: {(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                        <p className="file-info">Uploaded: {dateUploaded}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                    <div className="pagination-controls">
                                    <button className="pagination-button" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                                    <span>Page {currentPage}</span>
                                    <button className="pagination-button" onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</button>
                                </div>

                    <div className="note-checkbox-container">
                        <input
                            type="checkbox"
                            id="show-note-checkbox"
                            checked={showNote}
                            onChange={() => setShowNote(!showNote)} 
                        />
                        <label htmlFor="show-note-checkbox">Add a Note</label>
                    </div>

                    {showNote && (
                        <div className="note-textarea-container">
                            <textarea
                                placeholder="Enter your note here..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    )}

                    <p className="subtext">And the user you would like to send your file(s) to:</p>

                    <input
                        type="email"
                        placeholder="Enter the email.."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="search-form"
                    />

                    <button onClick={handleShareFile} className="share-file-btn">Share File(s)</button>

                    {error && <p className="error">{error}</p>}
                </div>
        </div>
    );
};

ShareFilesModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onShareSuccess: PropTypes.func.isRequired,
};

export default ShareFilesModal;