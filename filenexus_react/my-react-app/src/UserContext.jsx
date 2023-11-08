import {createContext, useState} from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext({
    token: '',
    setToken: () => {},
    user: '',
    setUser: () => {},
    email: '',
    setEmail: () => {},
    isLoggedIn: false,
    setIsLoggedIn: () => {},
  });
  

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState(null);

    const changeUsername = (newUsername) => {
        setUser(newUsername);
    }


return (
    <UserContext.Provider value={{user, setUser,changeUsername, email, setEmail, isLoggedIn, setIsLoggedIn}}>
        {children}
    </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};