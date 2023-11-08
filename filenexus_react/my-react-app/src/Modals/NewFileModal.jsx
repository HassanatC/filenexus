import PropTypes from 'prop-types';
import axios from 'axios';
import { useState } from 'react'

const NewFileModal = ({ onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('File size:', file.size);

    if (file.size > 10 * 1024 * 1024 * 1024) {
      console.log('File size exceeds the limit.')
    } else {
    setSelectedFile(file);
    setFileName(event.target.files[0].name);
    }
  };

  const handleFileUpload = async () => {

      if (selectedFile) {
            setUploading(true);
          const formData = new FormData();
          formData.append('file', selectedFile);

          const config = {
              headers: { 
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Token ${localStorage.getItem('token')}`
              }
          };
          
          try {
              const response = await axios.post('http://localhost:8000/upload_file/', formData, config);
              console.log(response.data);
              onUpload();
              onClose(); 
              
          } catch (error) {
              console.log(error);
              if (error.response && error.response.data) {
                setUploadError(error.response.data);
            }
          } finally {
            setUploading(false);
          }
      }
  }

  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <button className="modal-close-button" onClick={onClose}>X</button>
              <h2>Upload File</h2>
              <div className="modal-file-area">
                  <input type="file" id="file" onChange={handleFileChange}
                  className="choose-file" />
                  <label htmlFor="file">Choose a file</label>
                  <span>{fileName}</span>
                  {uploadError ? <span className="error-text">{uploadError}</span> : null}
                  <button onClick={handleFileUpload} className="upload-button" disabled={uploading}>Upload</button>
              </div>
              {uploading ? 
              <div className="loading-container">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div> 
                <span className="uploading-text">Uploading...</span>
              </div>
                : null}
          </div>
      </div>
  );
};

NewFileModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
}

export default NewFileModal;
  