import {useState, useEffect} from 'react';
import bellIcon from './assets/bell.svg';
import axios from 'axios';
import PropTypes from 'prop-types';

const Notification = ({ modalOpen }) => {

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const notificationZIndex = modalOpen ? -1 : 2;

    const fetchNotifications = () => {
      const config = {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`}
          };

      axios.get(`http://localhost:8000/notifications`, config)
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching these notifications: ', error))

    }

    const deleteNotification = (notificationId) => {
        const config = {
            headers: { Authorization: `Token ${localStorage.getItem('token')}`},
        };

        axios.delete(`http://localhost:8000/notifications/${notificationId}`, config)
        .then(() => {
            setNotifications(notifications.filter(notif => notif.id !== notificationId));
        })
        .catch(error => console.error('Error deleting notification:', error));

    };

    useEffect(() => {
        fetchNotifications();
    }, []);


    return (
        <div className="notifications-container" style={{ zIndex: notificationZIndex }}>
          <button className="notifications-button" onClick={() => setShowDropdown(!showDropdown)}>  <img src={bellIcon} className="bell-icon"></img>Notifications</button>
          {notifications.some(notification => !notification.is_read) && <div className="red-indicator"></div>}
          {showDropdown && (
            <div className="notifications-dropdown">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <span>{notification.message}</span>
                    <button className="notif-delete-button" onClick={() => deleteNotification(notification.id)}>x</button>
                  </div>
                ))
              ) : (
                <div className="no-notifications-message">
                  You have no notifications currently.
                </div>
              )}
            </div>
          )}
        </div>
      );
      
}

Notification.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
}

export default Notification;