import logo from '../assets/filenexus-logo.png';
import {useContext, useState, useEffect, useCallback} from 'react';
import {UserContext} from '../UserContext.jsx';
import {useNavigate, NavLink} from 'react-router-dom';
import ShareFilesModal from '../Modals/ShareFilesModal';
import LastOpened from '../Files/LastOpened';
import axios from 'axios';
import NewFileModal from '../Modals/NewFileModal.jsx';
import FileList from '../Files/FileList.jsx';
import FileSort from '../Files/FileSort';
import FileSearch from '../Files/FileSearch.jsx';
import Notification from '../Notification';
import homeIcon from '../assets/home.svg';
import folderIcon from '../assets/folder.svg';
import shareMainIcon from '../assets/share-main.svg';
import useModalManagement from '../hooks/useModalManagement';
import settingsIcon from '../assets/settings.svg';

const DashboardPage = () => {

  const {user, setIsLoggedIn} = useContext(UserContext);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 10;
  const [files, setFiles] = useState([]);

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [refreshLastOpened, setRefreshLastOpened] = useState(false);
  const [totalStorage, setTotalStorage] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);

  const {
    isModalOpen,
    isShareModalOpen,
    openModal,
    closeModal,
    handleShareClick,
    handleCloseModal,
  } = useModalManagement();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const triggerRefreshLastOpened = () => {
    setRefreshLastOpened(prevState => !prevState);
  };

  const handleFileDelete = (id) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  }
  const maxStorage = 10;

  const fetchTotalStorage = () => {
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`}
    };

    axios.get('http://localhost:8000/total_storage', config)
    .then(response => { 
    setTotalStorage(response.data.total_size_gb);
    setStoragePercentage(response.data.storage_percentage);
    })
    .catch(error => console.error("Error fetching total storage:", error));
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchFiles = useCallback(() => {
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      params: { 
        page: currentPage, 
        page_size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
    },
  };

    axios.get(`http://localhost:8000/files/`, config)
      .then(response => {

      setFiles(response.data);

      if (response.data.length < pageSize) {
        setTotalPages(currentPage);
      } else {
        setTotalPages(undefined);
      }
    })
      .catch(error => console.error('Error fetching files:', error));
  }, [currentPage, sortField, sortDirection]);

  useEffect(() => {
    fetchFiles();
    fetchTotalStorage();

  }, [fetchFiles, currentPage, sortField, sortDirection]);

  return (
    <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
        <img src={logo} alt="FileNexus Logo" className="sidebar-logo" />
        <button className="new-button" onClick={openModal}>+ New</button>
        {isModalOpen && <NewFileModal onClose={closeModal} onUpload={fetchFiles} />}

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
      
      <button className="share-button" onClick={handleShareClick}> <img src={shareMainIcon} className='share-main-icon'></img>
                Share
            </button>

            {isShareModalOpen && <ShareFilesModal onClose={handleCloseModal} onShareSuccess={fetchFiles} />}
        
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="space-box">
          <h3 className="welcome">Welcome back, <span style={{ fontWeight: 'bold' }}>{user}</span></h3>
          <h3 className="dash-text">Total storage used: <span style={{ fontWeight: 'bold' }}>{totalStorage.toFixed(2)} / {maxStorage} GB</span></h3>

          <div className="progress-bar">
            <div className="progress-bar-filled" style={{width: `${storagePercentage}%`}}>
              {storagePercentage}%
            </div>
          </div>

          <Notification modalOpen={isModalOpen || isShareModalOpen} />
        </div>

        <div className="file-box">
        <LastOpened triggerRefresh={triggerRefreshLastOpened} />
        </div>

        <div className="file-box">
          <h2>My Files</h2>
          <FileSearch setFiles={setFiles} />
          <FileSort 
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            />
          <FileList 
            files={files} 
            setFiles={setFiles} 
            onDelete={handleFileDelete}
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            onFileClick={triggerRefreshLastOpened}
            />

          <div className="pagination-controls">
            <button className="pagination-button" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage}</span>
            <button className="pagination-button" onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</button>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default DashboardPage;