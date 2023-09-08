import PropTypes from 'prop-types';

const FileSort = ({ sortField, sortDirection, onSort}) => {
    return (
        <div className="file-filters">
            <button onClick={() => onSort('name')} className="file-filters-name">
                Sort by Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>

            <button onClick={() => onSort('file_size')} className="file-filters-size">
                Sort by Size MB {sortField === 'file_size' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>

            <button onClick={() => onSort('uploaded_at')} className="file-filters-upload">
            Sort by Upload Date {sortField === 'uploaded_at' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
        </div>
    );
};

FileSort.propTypes = {
    sortField: PropTypes.string,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),
    onSort: PropTypes.func.isRequired,
};

export default FileSort;