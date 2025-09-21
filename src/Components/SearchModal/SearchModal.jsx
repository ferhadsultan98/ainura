import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SearchModal.scss';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (tag) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
    onClose();
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
  };

  const popularSearches = [
    'AI Art', 
    'Fantasy', 
    'Cyberpunk', 
    'Nature', 
    'Space', 
    'Abstract',
    'Portrait',
    'Landscape',
    'Digital Art',
    'Anime'
  ];

  return (
    <div className="searchModalOverlay" onClick={handleOverlayClick}>
      <div className="searchModalContent">
        {/* Close Button */}
        <button className="closeSearchModal" onClick={handleClose}>
          <X size={24} />
        </button>

        {/* Header */}
        <div className="searchHeader">
          <h2>Search AiNura</h2>
          <p>Discover amazing AI-generated artwork</p>
        </div>

        {/* Search Form */}
        <form className="searchForm" onSubmit={handleSearchSubmit}>
          <div className="searchInputContainer">
            <Search size={24} strokeWidth={2} className="searchInputIcon" />
            <input
              type="text"
              placeholder="Search for images, videos, or anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="searchInput"
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            className="searchSubmitBtn"
            disabled={!searchQuery.trim()}
          >
            <Search size={18} />
            Search
          </button>
        </form>

        {/* Popular Searches */}
        <div className="searchSuggestions">
          <h3>Popular Searches</h3>
          <div className="suggestionTags">
            {popularSearches.map((tag) => (
              <button
                key={tag}
                className="suggestionTag"
                onClick={() => handleSuggestionClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
