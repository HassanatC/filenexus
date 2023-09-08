import { useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../assets/filenexus-logo.png';
import homeIcon from '../assets/home.svg';
import folderIcon from '../assets/folder.svg';
import settingsIcon from '../assets/settings.svg';
import FileList from '../Files/FileList';

const FolderContents = () => {

    const {folderId} = useParams();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const config = {
                    headers: {Authorization: `Token ${localStorage.getItem('token')}`}
                };

                const response = await axios.get(`http://localhost:8000/folders/${folderId}/files/`, config)
                setFiles(response.data);
            } catch(error) {
                setError(error.message)
            }
        }
        fetchFiles();
    }, [folderId]);

    const handleFileDelete = async(id) => {
        const filteredFiles = files.filter(file => file.id !== id);
        setFiles(filteredFiles);
    }


    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <img src={logo} alt="FileNexus Logo" className="sidebar-logo" />
                <ul>
                    <li>
                        <img src={homeIcon} alt="Home Icon" className="sidebar-icon" />
                        <Link to="/dashboard">Home</Link>
                    </li>
                    <li>
                        <img src={folderIcon} alt="Folder Icon" className="sidebar-icon" />
                        <Link to="/folders">Folders</Link>
                    </li>
                    <li>
                        <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
                        <Link to="/settings">Settings</Link>
                    </li>
                </ul>
            </div>

              {/* Main content */}
            <div className="main-content">
            <Link to="/folders"> <button className="back-button">Go Back</button></Link>
                <h3 className="dash-text">Current folder contents:</h3>
                {error && <p>Error: {error}</p>}
                {files.length > 0 ? (
                    <FileList files={files} onDelete={handleFileDelete} />
                ) : (
                    <p>Your folder is currently empty! Add some files in.</p>
                )}
            </div>
        </div>
    );
}

export default FolderContents;