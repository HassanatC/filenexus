import logo from '../assets/filenexus-logo.png';
import {useContext, useState, useEffect} from 'react';
import {UserContext} from '../UserContext.jsx';
import {useNavigate, NavLink} from 'react-router-dom';
import axios from 'axios';
import NewFileModal from '../Modals/NewFileModal';
import FolderList from '../Folders/FolderList';
import NewFolderModal from '../Modals/NewFolderModal';
import ShareFolderModal from '../Modals/ShareFolderModal';
import shareMainIcon from '../assets/share-main.svg';
import useModalManagement from '../hooks/useModalManagement';
import homeIcon from '../assets/home.svg';
import folderIcon from '../assets/folder.svg';
import settingsIcon from '../assets/settings.svg';

const FolderPage = () => {

  const {user, setIsLoggedIn} = useContext(UserContext);
  const navigate = useNavigate();

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  useEffect(() => {
    const fetchFolders = async () => {
        const config = {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`}
        }
        
        try {
            const response = await axios.get(`http://localhost:8000/folders/list/`, config);
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    }

    fetchFolders();
}, []);
  const {
    isModalOpen,
    isShareModalOpen,
    openModal,
    closeModal,
    handleShareClick,
    handleCloseModal,
  } = useModalManagement();

  const openFolderModal = () => {
    setIsFolderModalOpen(true);
  }

  const closeFolderModal = () => {
    setIsFolderModalOpen(false);
  }

  const handleFolderCreated = (newFolder) => {
    setFolders(prevFolders => [...prevFolders, newFolder]);
  };

  const handleRenameFolder = (updatedFolders) => {
    setFolders(updatedFolders);
  }

  const handleDelete = async (folderId) => {
    const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`}
    };

    try {
        await axios.delete(`http://localhost:8000/folders/${folderId}/delete/`, config);
        setFolders(folders => folders.filter(folder => folder.id !== folderId));
    } catch (error) {
        console.log("Error deleting folder: ", error)
    }

}

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
       {/* Sidebar */}
       <div className="sidebar">
        <img src={logo} alt="FileNexus Logo" className="sidebar-logo" />
        <button className="new-button" onClick={openModal}>+ New</button>
        {isModalOpen && <NewFileModal onClose={closeModal} />}

        <button className="new-folder-button" onClick={openFolderModal}>+ New Folder</button>
        {isFolderModalOpen && <NewFolderModal onClose={closeFolderModal} onFolderCreated={handleFolderCreated} />}
          <ul>
            <li>
              <img src={homeIcon} alt="Home Icon" className="sidebar-icon" />
              <NavLink to="/dashboard" activeclassname="active-sidebar">Home</NavLink>
            </li>
            <li>
              <img src={folderIcon} alt="Folder Icon" className="sidebar-icon" />
              <NavLink to="/folders" activeclassname="active-sidebar">Folders</NavLink>
            </li>
            <li>
              <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
              <NavLink to="/settings" activeclassname="active-sidebar">Settings</NavLink>
            </li>
          </ul>

          <button className="share-folder-button" onClick={handleShareClick}> <img src={shareMainIcon} className="share-main-icon"></img>
                Share Folder
            </button>

            {isShareModalOpen && <ShareFolderModal onClose={handleCloseModal} onShareSuccess={handleCloseModal} />}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="space-box">
          <h3 className="welcome">Here are your folders, <span style={{ fontWeight: 'bold' }}>{user}</span></h3>

          <p className="subtitle">When you create a new folder, you can add files in. If you delete a folder, bear in mind that you will delete the files inside of it.</p>

        </div>

        <div className="space-box">
          <h2>My Folders</h2>
            <FolderList folders={folders} handleDelete={handleDelete} handleRenameFolder={handleRenameFolder} />
        </div>
      </div>
    </div>
  );
};

export default FolderPage;
