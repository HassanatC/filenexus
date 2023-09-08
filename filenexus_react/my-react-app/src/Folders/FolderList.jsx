import {useState, useEffect, useRef} from 'react'
import AddFilesModal from '../Modals/AddFilesModal.jsx'
import {Link} from 'react-router-dom';
import folderIcon from '../assets/folder.svg';
import DeleteFolderModal from '../Modals/DeleteFolderModal.jsx';
import PropTypes from 'prop-types';
import axios from 'axios';

const FolderList = ({ folders, handleDelete, handleRenameFolder }) => {

    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentFolderToDelete, setCurrentFolderToDelete] = useState(null);
    const [openActionsId, setOpenActionsId] = useState(null);

    const [isRenaming, setIsRenaming] = useState(false);
    const [renameId, setRenameId] = useState(null);
    const [newName, setNewName] = useState('');

    const dropdownRef = useRef(null);

    const handleAddFiles = (folderId) => {
        setCurrentFolder(folderId);
        setIsAddFileModalOpen(true);
    };

    const handleCloseAddFileModal = () => {
        setIsAddFileModalOpen(false);
        setCurrentFolder(null);
    };

    const openDeleteModal = (folderId) => {
      setCurrentFolderToDelete(folderId);
      setIsDeleteModalOpen(true);
    };
  
    const closeDeleteModal = () => {
      setCurrentFolderToDelete(null);
      setIsDeleteModalOpen(false);
    };

    const handleRenameClick = (id) => {
      const folderToRename = folders.find((folder) => folder.id === id);
      setNewName(folderToRename.name);
      setIsRenaming(true);
      setRenameId(id);
    };

    const handleRenameChange = (event) => {
      setNewName(event.target.value);
    };

    const handleRenameSubmit = async (event, id) => {
      event.preventDefault();
      const config = {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }

      };

      try {
        await axios.patch(`http://localhost:8000/folders/${id}/`, {name: newName }, config);

        const updatedFolders = folders.map((folder) => {
          if (folder.id === id) {
            return {...folder, name: newName};
          }
          return folder;
        });

        handleRenameFolder(updatedFolders);

        setIsRenaming(false);
        setRenameId(null);
      } catch (error) {
        console.error('Error renaming the folder: ', error);
      }
    }



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

    }, [openActionsId])

    return (
      <div className="folder-list">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div key={folder.id} className="folder-item">
              {folderIcon && <img src={folderIcon} alt="Folder icon" className="folder-icon" />}
              <div className="folder-content">
                <div className="folder-details">
                  {isRenaming && renameId === folder.id ? (
                    <form onSubmit={(event) => handleRenameSubmit(event, folder.id)}>
                      <input
                        type="text"
                        value={newName}
                        onChange={handleRenameChange}
                        onBlur={() => setIsRenaming(false)}
                      />
                    </form>
                  ) : (
                    <Link to={`/folders/${folder.id}`} className="link-text-folder">
                        <p className="folder-name">{folder.name}</p>
                    </Link>
                  )}
                </div>
                <div className="file-actions">
                  <button className="folder-actions-button" onClick={(event) => {
                    event.stopPropagation();
                    openActionsId === folder.id ? setOpenActionsId(null) : setOpenActionsId(folder.id);
                  }}
                  >
                    Actions
                  </button>
                  {openActionsId === folder.id && (
                    <div className="file-actions-dropdown" ref={dropdownRef}>
                      <button onClick={() => handleAddFiles(folder.id)} className="file-download">Add Files</button>
                      <button onClick={() => handleRenameClick(folder.id)} className="file-rename">Rename</button>
                      <button onClick={() => openDeleteModal(folder.id)} className="file-del">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Your list of folders is empty! Use the &apos;New Folder&apos; button to add some folders in.</p>
        )}
        {isAddFileModalOpen && <AddFilesModal folderId={currentFolder} onClose={handleCloseAddFileModal} />}
        {isDeleteModalOpen && (
          <DeleteFolderModal
            folderId={currentFolderToDelete}
            onClose={closeDeleteModal}
            onDeleteFolder={handleDelete}
          />
        )}
      </div>
    );
    
      
};

FolderList.propTypes = {
  folders: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleRenameFolder: PropTypes.func.isRequired,
};

export default FolderList;