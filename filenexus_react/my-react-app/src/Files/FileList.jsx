import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import ShareURLModal from '../Modals/ShareURLModal';
import { getFileExtension, getFileTypeIcon } from '../fileHelpers';
import shareIcon from '../assets/share-file.svg';

const FileList = ({ files, setFiles, onFileClick, onDelete }) => {

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [newName, setNewName] = useState('');

  const [openActionsId, setOpenActionsId] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenActionsId(null);
      }
    };

    if (openActionsId !== null) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openActionsId]);

  const handleRenameClick = (id) => {
    const fileToRename = files.find((file) => file.id === id);
    const baseName = fileToRename.name.split('.').slice(0, -1).join('.');
    setNewName(baseName);
    setIsRenaming(true);
    setRenameId(id);
  }

  const handleRenameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleRenameSubmit = async(event, id) => {
    event.preventDefault();
    const extension = getFileExtension(files.find((file) => file.id === id).name);
    const newNameWithExtension = `${newName}.${extension}`;
  
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    }
   
    try {
      await axios.patch(`http://localhost:8000/files/${id}/`, { name: newNameWithExtension }, config);

      const updatedFiles = files.map((file) => {
        if (file.id === id) {
          return {...file, name: newNameWithExtension};
        }
        return file;
      });
      setFiles(updatedFiles);
      setNewName('');
      setIsRenaming(false);
      setRenameId(null);
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  }

  const handleShareClick = (file) => {
    setSelectedFile(file);
    setShareModalOpen(true);
  }

  const handleDownload = async(id) => {
    const config = {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        responseType: 'blob'
    }
   
    try {
        const response = await axios.get(`http://localhost:8000/files/download/${id}/`, config);
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', files.find((file) => file.id === id).name); 
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

  
  const handleDelete = async(id) => {
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    }
   
    try {
      await axios.delete(`http://localhost:8000/files/${id}/`, config);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  const handleFileClick = async (fileId) => {
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    }

    if (onFileClick) {
      onFileClick();
    }

    try {
      await axios.patch(`http://localhost:8000/open_file/${fileId}/`, {}, config);
      console.log('File clicked!');
    } catch (error) {
      console.error('Error updating last opened file: ', error)
    }
  }
  
  return (
    <div className="file-list">

      {files && files.length > 0 ? (

        files.map((file) => {
          const fileIcon = getFileTypeIcon(file.name);
          const dateUploaded = new Date(file.uploaded_at).toLocaleDateString();

          return (
            <div key={file.id} className="file-item">
              {fileIcon && <img src={fileIcon} alt="File icon" className="file-icon"/>}
              <div className="file-content">
                <div className="file-details">
                  {isRenaming && renameId === file.id ? (
                    <form onSubmit={(event) => handleRenameSubmit(event, file.id)}>
                      <input 
                      type="text"
                      value={newName}
                      onChange={handleRenameChange}
                      onBlur={() => setIsRenaming(false)}
                      />
                    </form>
                  ) : (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="link-text" onClick={() => handleFileClick(file.id)}>
                      {file.name}
                    </a>
                  )}
                  <div className="file-info-container">
                    <p className="file-info">Size: {(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="file-info">Uploaded: {dateUploaded}</p>
                  </div>
                </div>
                <div className="file-actions">
                    <button 
                      className="file-actions-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openActionsId === file.id ? setOpenActionsId(null) : setOpenActionsId(file.id);
                      }}
                    >
                      Actions
                    </button>
                    {openActionsId === file.id && (
                      <div className="file-actions-dropdown" ref={dropdownRef}>
                        <button onClick={() => handleDownload(file.id)} className="file-download">Download</button>
                        <button onClick={() => handleRenameClick(file.id)} className="file-rename">Rename</button>
                        <button onClick={() => handleShareClick(file)} className="file-share">
                          <img src={shareIcon} alt="Share" className="share-icon" /> Share URL
                        </button>
                        <button onClick={() => handleDelete(file.id)} className="file-del">Delete</button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })

        ) : (
          <div>No files found</div>
        )}
        {shareModalOpen && <ShareURLModal file={selectedFile} closeModal={() => setShareModalOpen(false)} />}
      </div>
    );
}

FileList.defaultProps = {
  files: [],
}

FileList.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    file_size: PropTypes.number.isRequired,
    uploaded_at: PropTypes.string.isRequired,
  })).isRequired,
  
  setFiles: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onFileClick: PropTypes.func.isRequired,
};

export default FileList;