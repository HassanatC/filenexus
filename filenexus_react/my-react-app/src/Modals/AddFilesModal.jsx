import { useEffect, useState } from 'react';
import { getFileTypeIcon  } from '../fileHelpers';
import axios from 'axios';
import layersIcon from '../assets/layers.svg';
import PropTypes from 'prop-types';

const AddFilesModal = ({folderId, onClose}) => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [files, setFiles] = useState([]);
    const [selectedFileIds, setSelectedFileIds] = useState(new Set());
    const [setError] = useState(null);


    useEffect(() => {
        const fetchFiles = async () => {
            const config = {
                headers: {Authorization: `Token ${localStorage.getItem('token')}`},
                params: { page: currentPage, page_size: pageSize },
            }

        try {
            const response = await axios.get('http://localhost:8000/files/', config);
            setFiles(response.data)

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

    const handleAddFiles = async () => {
        const config = {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`}
        }
        try {
            const fileIds = Array.from(selectedFileIds);
            await axios.put(`http://localhost:8000/folders/${folderId}/addfiles/`, { file_ids: fileIds }, config);
            onClose();
            
        } catch (error) {
            console.error('Error adding files: ', error)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>X</button>
                <h2>Select files to add to folder</h2>
                
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
                                        name="add-file-checkbox"
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

                <button onClick={handleAddFiles} className="file-share">Add Files</button>
            </div>
    </div>
    )
}


AddFilesModal.propTypes = {
    folderId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default AddFilesModal;