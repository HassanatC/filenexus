import PropTypes from 'prop-types';
import { useState } from 'react';

const DeleteFolderModal = ({ folderId, onClose, onDeleteFolder }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteFolder = async () => {
    setDeleting(true);
    await onDeleteFolder(folderId);
    setDeleting(false);
    onClose();
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h2>Confirm Deletion</h2>
        <div className="modal-file-area">
          <p>Do you want to delete this folder and all the files inside of it?</p>
          <button 
          onClick={handleDeleteFolder} 
          className="delete-folder-button" 
          disabled={deleting}
          > Delete Folder and Files</button>
        </div>
        {deleting ? <span className="upload-text">Deleting...</span> : null}
      </div>
    </div>
  );
};

DeleteFolderModal.propTypes = {
    folderId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onDeleteFolder: PropTypes.func.isRequired,
  };

export default DeleteFolderModal;