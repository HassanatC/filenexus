import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FileSearch = ({ setFiles }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        const config = {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`}
        }

        try {
            const response = await axios.get(`http://localhost:8000/files/search/?q=${searchTerm}`, config);
            setFiles(response.data);
        } catch (error) {
            console.error("Error searching for files", error);
        }
    };

    const handleClearSearch = async () => {
        setSearchTerm('');

        const config = {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`}
        }

        try {
            const response = await axios.get('http://localhost:8000/files/', config);
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files", error);
        }
    };

    return (
        <form onSubmit={handleSearchSubmit}>
            <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for file..."
            className="search-form"
            />
            <button type="submit" className="search-button">Search</button>
            <button type="button" onClick={handleClearSearch} className="clear-button">Clear</button>
        </form>
    )
}

FileSearch.propTypes = {
    setFiles: PropTypes.func.isRequired,
}

export default FileSearch;