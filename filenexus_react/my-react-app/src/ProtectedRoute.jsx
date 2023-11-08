import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();
  
    useEffect(() => { if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  }
  
  export default ProtectedRoute;