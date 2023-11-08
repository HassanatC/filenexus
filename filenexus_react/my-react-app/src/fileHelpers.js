import imageIcon from './assets/images.svg';
import videoIcon from './assets/videos.svg';
import documentIcon from './assets/document.svg';
import musicIcon from './assets/music.svg';
import layersIcon from './assets/layers.svg';

export const getFileExtension = (fileName) => {
    const splitFileName = fileName.split('.');
    if (splitFileName.length <= 1) {
      return null;
    }
    return splitFileName[splitFileName.length - 1];
  };
  
export const getFileTypeIcon = (fileName) => {
    const extension = getFileExtension(fileName);
    if (extension) {
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'tiff', 'ico', 'heif', 'webp'].includes(extension)) {
        return imageIcon;
      } else if (['mp4', 'webm', 'ogg', 'mpeg', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
        return videoIcon;
      } else if (['docx', 'doc', 'html', 'odt', 'txt', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'csv', 'epub'].includes(extension)) {
        return documentIcon;
      } else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'alac', 'amr'].includes(extension)) {
        return musicIcon;
      } 
    }
    return layersIcon;
  };