import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ShareURLModal = ({ file, closeModal }) => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        const getPresignedUrl = async (fileId) => {
            const token = localStorage.getItem('token');
            console.log('token', token)

            const config = {
                headers: { Authorization: `Token ${token}` }
            };

            try {
                const response = await axios.get(`http://localhost:8000/get_presigned_url/${fileId}/`, config)
                console.log('Response:', response);
                setUrl(response.data.presigned_url);
            } catch (error) {
                console.error('Error getting presigned URL:', error);
            }
        };

        if (file) {
            getPresignedUrl(file.id);
        }
    }, [file]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
    }


    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <h2>Share File</h2>
            <button className="modal-close-button" onClick={closeModal}>X</button>
            <p>Copy this URL to share the file:</p>
            <textarea value={url} readOnly className="share-textarea" />
            <button onClick={copyToClipboard} className="file-share">Copy</button>
            </div>

        </div>
    )
}

ShareURLModal.propTypes = {
    file: PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      file_size: PropTypes.number.isRequired,
      upload_date: PropTypes.string.isRequired,
    }),
    closeModal: PropTypes.func.isRequired,
  };


export default ShareURLModal;