import logo from '../assets/filenexus-logo.png';
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { useNavigate, NavLink } from 'react-router-dom';
import homeIcon from '../assets/home.svg';
import folderIcon from '../assets/folder.svg';
import settingsIcon from '../assets/settings.svg';
import ChangeUserModal from '../Modals/ChangeUser';
import DeleteAccountModal from '../Modals/DeleteAccountModal';

const SettingsPage = () => {

  const {email, user, changeUsername, setIsLoggedIn} = useContext(UserContext);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeUserModal, setChangeUserModal] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  }

  const openChangeUserModal = () => {
    setChangeUserModal(true);
  }

  const closeChangeUserModal = () => {
    setChangeUserModal(false);
  }

  return (
    <div className="dashboard-container">
     {/* Sidebar */}
     <div className="sidebar-settings">
        <img src={logo} alt="FileNexus Logo" className="sidebar-logo" />
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
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="space-box">
          <h3 className="welcome">Settings for <span style={{ fontWeight: 'bold' }}>{user}</span></h3>
          <h2>Account information</h2>
          <p className='subtitle'>Your email:</p> <span style={{ fontWeight: 'bold' }}>{email}</span>

          <p className="subtitle">Your username:</p> <span style={{fontWeight: 'bold' }}>{user}</span>
    
        </div>

        <div className="space-box">
          <h2>Account Actions</h2>
          <p className="subtitle">Delete your account - this is a permanent process:</p>
          <button onClick={openDeleteModal} className='account-delete-button'>Delete Account</button>

          {showDeleteModal && <DeleteAccountModal onClose={closeDeleteModal} />}

          <p className="subtitle">Change your account&apos;s username:</p>

          <button onClick={openChangeUserModal} className="change-user-button">Change Username</button>

          {showChangeUserModal && <ChangeUserModal onChangeUsername={changeUsername} onClose={closeChangeUserModal} />}
          
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
