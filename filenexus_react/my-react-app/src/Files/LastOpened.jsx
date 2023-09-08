import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import videoIcon from '../assets/videos.svg';
import imageIcon from '../assets/images.svg';
import documentIcon from '../assets/document.svg';
import musicIcon from '../assets/music.svg';
import layersIcon from '../assets/layers.svg';

const LastOpened = ({ triggerRefresh }) => {
    const [lastOpenedFiles, setLastOpenedFiles] = useState([]);

    const config = useMemo(() => ({
        headers: {Authorization: `Token ${localStorage.getItem('token')}`}
    }), []);


    const fetchLastOpenedFiles = useCallback(async () => {
        const url = 'http://localhost:8000/open_file/';
        try {
            const response = await axios.get(url, config);
            setLastOpenedFiles(response.data);
            console.log('Fetching last opened files...');
        } catch (error) {
            console.error('Error fetching last opened files:', error);
        }
    }, [config]);

    const handleFileClick = async (event, fileId, fileUrl) => {
        console.log(`File ${fileId} clicked`);

        const url = `http://localhost:8000/open_file/${fileId}/`;
        try {
            await axios.patch(url, {}, config);
            await fetchLastOpenedFiles();

            const extension = getFileExtension(fileUrl);
            const viewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'html', 'txt'];

            if (viewableExtensions.includes(extension)) {
                window.open(fileUrl, '_blank');
              } else {
                window.location.href = fileUrl;
              }
        } catch (error) {
            console.error('Error updating last opened file:', error);
        }
    };

    useEffect(() => {
        fetchLastOpenedFiles();
    }, [fetchLastOpenedFiles, triggerRefresh]);


    const getFileExtension = (fileName) => {
        const splitFileName = fileName.split('.');
        if (splitFileName.length <= 1) {
            return null;
        }
        return splitFileName[splitFileName.length - 1];
    };

    const getFileTypeIcon = (fileName) => {
        const extension = getFileExtension(fileName);
        if (extension) {
            if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'tiff', 'ico', 'heif', 'webp'].includes(extension)) {
                return { icon: imageIcon, class: "imageIcon" };
            } else if (['mp4', 'webm', 'ogg', 'mpeg', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
                return { icon: videoIcon, class: "videoIcon" };
            } else if (['docx', 'doc', 'html', 'odt', 'txt', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'csv', 'epub'].includes(extension)) {
                return { icon: documentIcon, class: "documentIcon" };
            } else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'alac', 'amr'].includes(extension)) {
                return { icon: musicIcon, class: "musicIcon" };
            } 
        }
        return { icon: layersIcon, class: "layersIcon" };
    }

    const getFileTypeClass = (fileName) => {
        const extension = getFileExtension(fileName);
        if (extension) {
          if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'tiff', 'ico', 'heif', 'webp'].includes(extension)) {
            return { boxClass: "imageBox", nameClass: "imageName" };
          } else if (['mp4', 'webm', 'ogg', 'mpeg', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
            return { boxClass: "videoBox", nameClass: "videoName" };
          } else if (['docx', 'doc', 'html', 'odt', 'txt', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'csv', 'epub'].includes(extension)) {
            return { boxClass: "documentBox", nameClass: "documentName" };
          } else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'alac', 'amr'].includes(extension)) {
            return { boxClass: "musicBox", nameClass: "musicName" };
          }
        }
        return { boxClass: "layersBox", nameClass: "layersName" };
      }


    return (
        <div className="lastOpenedContainer">
            <h2>Last Opened Files</h2>
            <div className="fileContainer">
                {lastOpenedFiles.map(file => {
                    const { boxClass, nameClass } = getFileTypeClass(file.name);

                    const fileBoxClass = `fileBox ${boxClass}`;
                    const fileNameClass = `fileName ${nameClass}`;
                    return (
                        <a 
                         key={file.id}
                         href={file.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         style={{ textDecoration: 'none', color: 'inherit' }}
                         onClick={() => handleFileClick(file.id)}
                        >
                            <div className={fileBoxClass}>
                                <img className="fileIcon" src={getFileTypeIcon(file.name).icon} alt={file.name} />
                                <p className={fileNameClass}>{file.name}</p>
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
      );
}

LastOpened.propTypes = {
    triggerRefresh: PropTypes.bool.isRequired,
};

export default LastOpened;
