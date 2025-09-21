import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, Image as ImageIcon, Play, Heart } from 'lucide-react';
import ImageModal from '../ImageModal/ImageModal';
import VideoModal from '../VideoModal/VideoModal';
import './SearchPage.scss';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [visibleItems, setVisibleItems] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const observerRef = useRef(null);

  // Search filters
  const [filters, setFilters] = useState({
    type: 'all'
  });

  // Load and search data
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      
      try {
        // Dynamically import JSON data
        const [imagesModule, videosModule] = await Promise.all([
          import('../ImageGallery/imagesData.json'),
          import('../VideoGallery/videosData.json')
        ]);

        // Extract data from modules
        const imagesData = imagesModule.default || imagesModule;
        const videosData = videosModule.default || videosModule;

        // Get arrays from the JSON structure
        const images = Array.isArray(imagesData) 
          ? imagesData 
          : (imagesData.images || []);
        
        const videos = Array.isArray(videosData) 
          ? videosData 
          : (videosData.videos || []);

        // Map to consistent format with grid sizes
        const allImages = images.map((item, index) => {
          let size = 'standard';
          if (index % 4 === 0) {
            size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
          }
          return {
            ...item,
            type: 'image',
            image_url: item.url,
            size
          };
        });

        const allVideos = videos.map((item, index) => {
          let size = 'standard';
          if (index % 4 === 0) {
            size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
          }
          return {
            ...item,
            type: 'video',
            image_url: item.thumbnail,
            thumbnail_url: item.thumbnail,
            video_url: item.url,
            size
          };
        });

        const allData = [...allImages, ...allVideos];

        if (!query.trim()) {
          setSearchResults([]);
          setFilteredResults([]);
          setLoading(false);
          return;
        }

        // Search ONLY in prompt field
        const searchInPrompts = (data, searchTerm) => {
          const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
          
          return data.filter(item => {
            if (!item.prompt) return false;
            
            const prompt = item.prompt.toLowerCase();
            
            // Check if any search term matches
            return terms.some(term => prompt.includes(term));
          });
        };

        const results = searchInPrompts(allData, query);
        
        // Add relevance score and reassign grid sizes
        const resultsWithScore = results.map((item, index) => {
          let score = 0;
          const terms = query.toLowerCase().split(' ').filter(term => term.length > 0);
          
          if (item.prompt) {
            const prompt = item.prompt.toLowerCase();
            
            terms.forEach(term => {
              // Exact word match gets highest score
              if (prompt.split(' ').includes(term)) {
                score += 5;
              }
              // Partial match gets lower score
              else if (prompt.includes(term)) {
                score += 1;
              }
            });

            // Bonus for multiple term matches
            const matchingTerms = terms.filter(term => prompt.includes(term));
            if (matchingTerms.length > 1) {
              score += matchingTerms.length * 2;
            }
          }

          // Assign new grid sizes for search results
          let size = 'standard';
          if (index % 4 === 0) {
            size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
          }
          
          return { ...item, relevanceScore: score, size };
        });

        setSearchResults(resultsWithScore);
        setFilteredResults(resultsWithScore);
        
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...searchResults];

    // Type filter only
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Sort results
    switch (sortBy) {
      case 'relevance':
        filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        break;
      case 'likes':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      default:
        break;
    }

    setFilteredResults(filtered);
  }, [searchResults, filters, sortBy]);

  // Load more items
  const loadMoreItems = () => {
    if (loadingMore || visibleItems >= filteredResults.length) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 12, filteredResults.length));
      setLoadingMore(false);
    }, 300);
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    const currentObserver = observerRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreItems();
          }
        });
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [visibleItems, loadingMore, filteredResults.length]);

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setVisibleItems(12); // Reset visible items
  };

  // New search
  const handleNewSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  // Modal handlers
  const handleItemClick = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);
  const handleLike = (itemId) => console.log('Liked item:', itemId);
  const handleComment = (itemId, comment) => console.log('New comment:', itemId, comment);

  const visibleResults = filteredResults.slice(0, visibleItems);

  // Like handler for items
  const handleItemLike = (e, itemId) => {
    e.stopPropagation();
    handleLike(itemId);
  };

  return (
    <div className="searchPage">
      <div className="searchContainer">
        {/* Header */}
        <div className="searchHeader">
          <div className="searchInfo">
            <h1>Search Results</h1>
            {query && (
              <div className="searchQuery">
                <span>Results for: </span>
                <strong>"{query}"</strong>
                {filteredResults.length > 0 && (
                  <span className="resultCount">({filteredResults.length} found in prompts)</span>
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="searchBarContainer">
            <div className="searchInputWrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search in prompts..."
                defaultValue={query}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNewSearch(e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="searchControls">
          <div className="controlsLeft">
            <div className="quickFilters">
              <button 
                className={`quickFilter ${filters.type === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', 'all')}
              >
                All ({searchResults.length})
              </button>
              <button 
                className={`quickFilter ${filters.type === 'image' ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', 'image')}
              >
                <ImageIcon size={14} />
                Images ({searchResults.filter(r => r.type === 'image').length})
              </button>
              <button 
                className={`quickFilter ${filters.type === 'video' ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', 'video')}
              >
                <Play size={14} />
                Videos ({searchResults.filter(r => r.type === 'video').length})
              </button>
            </div>
          </div>

          <div className="controlsRight">
            <div className="sortControl">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="likes">Most Liked</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="searchResults">
          {loading ? (
            <div className="loadingState">
              <div className="loadingSpinner"></div>
              <p>Searching in prompts...</p>
            </div>
          ) : !query ? (
            <div className="emptyState">
              <Search size={64} />
              <h2>Search in Prompts</h2>
              <p>Enter keywords to search within AI prompts</p>
              <div className="suggestions">
                <p>Try these keywords:</p>
                <div className="suggestionTags">
                  {['futuristic', 'dragon', 'cyberpunk', 'fantasy', 'space', 'forest', 'city', 'castle'].map(tag => (
                    <button 
                      key={tag}
                      className="suggestionTag"
                      onClick={() => handleNewSearch(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="noResults">
              <Search size={64} />
              <h2>No Prompts Found</h2>
              <p>No prompts contain the term "{query}"</p>
              <div className="suggestions">
                <p>Try these popular prompt keywords:</p>
                <div className="suggestionTags">
                  {['futuristic', 'dragon', 'cyberpunk', 'fantasy', 'space', 'forest', 'city', 'castle'].map(tag => (
                    <button 
                      key={tag}
                      className="suggestionTag"
                      onClick={() => handleNewSearch(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Gallery Grid - Exact same as ImageGallery */}
              <div className="searchResultsGrid">
                {visibleResults.map((item, index) => (
                  <div
                    key={`${item.type}-${item.id || index}`}
                    className={`gridItem item-${item.size} ${index >= 12 ? 'lazy-item' : ''}`}
                    onClick={() => handleItemClick(item)}
                    style={{ animationDelay: `${(index - 12) * 0.1}s` }}
                  >
                    <div className="searchCard">
                      <div className="cardContainer">
                        <img src={item.image_url || item.thumbnail_url} alt={item.prompt} />
                        
                        {/* Video Play Overlay */}
                        {item.type === 'video' && (
                          <div className="videoOverlay">
                            <Play size={24} />
                            {item.duration && (
                              <div className="videoDuration">{item.duration}</div>
                            )}
                          </div>
                        )}

                        {/* Bottom Bar - Same as ImageCard */}
                        <div className="bottomBar">
                          {/* Sol taraf - Author */}
                          <div className="authorInfo">
                            <span className="authorName">{item.author}</span>
                          </div>
                          
                          {/* Sağ taraf - Like Button */}
                          <div className="actionButtons">
                            <button 
                              className="actionBtn likeBtn"
                              onClick={(e) => handleItemLike(e, item.id)}
                              data-tooltip="Like"
                            >
                              <Heart 
                                size={16} 
                                strokeWidth={2}
                                fill="none"
                              />
                              <span className="likesCount">{item.likes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blur Fade Overlay */}
              {visibleItems < filteredResults.length && (
                <div className="blurFadeOverlay">
                  <div className="blurGradient"></div>
                </div>
              )}

              {/* Loading Trigger */}
              {visibleItems < filteredResults.length && (
                <div ref={observerRef} className="loadingTrigger">
                  {loadingMore && <div className="loadingSpinner">Loading more results...</div>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedItem && selectedItem.type === 'image' && (
        <ImageModal
          image={selectedItem}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}

      {selectedItem && selectedItem.type === 'video' && (
        <VideoModal
          video={selectedItem}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
};

export default SearchPage;
