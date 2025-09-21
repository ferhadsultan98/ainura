import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import ImageCard from "../ImageCard/ImageCard";
import VideoCard from "../VideoCard/VideoCard";
import ImageModal from "../ImageModal/ImageModal";
import VideoModal from "../VideoModal/VideoModal";
import imagesData from "../ImageGallery/imagesData.json";
import videosData from "../VideoGallery/videosData.json";
import "./FavouriteItems.scss";

function FavouriteItems() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // JSON'dan veri çekme ve birleştirme
  const favoriteItems = useMemo(() => {
    const images = imagesData.images.slice(0, 10).map(img => ({
      ...img,
      type: "image",
      dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ["ai", "art", "creative"]
    }));

    const videos = videosData.videos.slice(0, 8).map(video => ({
      ...video,
      type: "video",
      dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ["video", "animation", "creative"]
    }));

    return [...images, ...videos];
  }, []);

  // Filter and search logic - DÜZELTME
  const filteredAndSortedItems = useMemo(() => {
    let filtered = favoriteItems;

    // Filter by type - İLK ÖNCE FİLTER
    if (activeFilter !== "all") {
      filtered = filtered.filter(item => 
        activeFilter === "images" ? item.type === "image" : item.type === "video"
      );
    }

    // Search filter - SONRA SEARCH
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.prompt.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort items - EN SON SORT
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case "oldest":
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case "mostLiked":
          return b.likes - a.likes;
        case "leastLiked":
          return a.likes - b.likes;
        default:
          return 0;
      }
    });

    return sorted;
  }, [favoriteItems, activeFilter, searchQuery, sortBy]);

  // Size mapping for grid items - FILTERED ITEMS ÜZERINDEN
  const itemsWithSize = useMemo(() => {
    return filteredAndSortedItems.map((item, index) => {
      let size = 'standard';
      if (index % 4 === 0) {
        size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
      }
      return { ...item, size };
    });
  }, [filteredAndSortedItems]);

  // Stats for display - TOPLAM VE FİLTER SONRASI
  const stats = useMemo(() => {
    const total = favoriteItems.length;
    const images = favoriteItems.filter(item => item.type === "image").length;
    const videos = favoriteItems.filter(item => item.type === "video").length;
    
    // Filtered stats
    const filteredTotal = filteredAndSortedItems.length;
    const filteredImages = filteredAndSortedItems.filter(item => item.type === "image").length;
    const filteredVideos = filteredAndSortedItems.filter(item => item.type === "video").length;
    
    return { 
      total, 
      images, 
      videos,
      filteredTotal,
      filteredImages,
      filteredVideos
    };
  }, [favoriteItems, filteredAndSortedItems]);

  // Load more items - VISIBLE ITEMS RESET WHEN FILTER CHANGES
  useEffect(() => {
    setVisibleItems(6); // Reset visible items when filter changes
  }, [activeFilter, searchQuery, sortBy]);

  const loadMoreItems = () => {
    if (loading || visibleItems >= itemsWithSize.length) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 6, itemsWithSize.length));
      setLoading(false);
    }, 300);
  };

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
  }, [visibleItems, loading, itemsWithSize.length]);

  // Handlers
  const handleImageClick = (image) => setSelectedImage(image);
  const handleVideoClick = (video) => setSelectedVideo(video);
  const handleCloseImageModal = () => setSelectedImage(null);
  const handleCloseVideoModal = () => setSelectedVideo(null);

  const handleLike = (itemId) => {
    console.log('Liked favorite item:', itemId);
  };

  const handleRemoveFromFavorites = (itemId) => {
    console.log('Removed from favorites:', itemId);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const visibleFavorites = itemsWithSize.slice(0, visibleItems);

  return (
    <div className="imageGallery">
      {/* Favorites Header */}
      <div className="favoritesHeader">
        <div className="headerTop">
          <div className="titleSection">
            <h1 className="galleryTitle">My Favorites</h1>
            <span className="itemCount">
              ({activeFilter === 'all' ? stats.total : 
                activeFilter === 'images' ? stats.images : stats.videos} items)
            </span>
          </div>
          
          <div className="headerControls">
          
            <button 
              className={`filterToggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="searchSection">
          <div className="searchInputContainer">
            <Search size={20} className="searchIcon" />
            <input
              type="text"
              placeholder="Search favorites by name, author, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="searchInput"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="clearSearchBtn">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="filtersPanel">
            <div className="filterGroup">
              <h3>Content Type</h3>
              <div className="filterTabs">
                <button 
                  className={`filterTab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({stats.total})
                </button>
                <button 
                  className={`filterTab ${activeFilter === 'images' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('images')}
                >
                  Images ({stats.images})
                </button>
                <button 
                  className={`filterTab ${activeFilter === 'videos' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('videos')}
                >
                  Videos ({stats.videos})
                </button>
              </div>
            </div>

            <div className="filterGroup">
              <h3>Sort By</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sortSelect"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
                <option value="leastLiked">Least Liked</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count Display */}
      {/* <div className="resultsHeader">
        <span className="resultsCount">
          Showing {visibleFavorites.length} of {filteredAndSortedItems.length} favorites
          {activeFilter !== 'all' && ` (${activeFilter})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div> */}

      {filteredAndSortedItems.length === 0 ? (
        <div className="emptyState">
          <h2>No favorites found</h2>
          <p>
            {searchQuery 
              ? `No items match "${searchQuery}"${activeFilter !== 'all' ? ` in ${activeFilter}` : ''}`
              : `No ${activeFilter !== 'all' ? activeFilter : 'items'} in your favorites!`}
          </p>
          {searchQuery && (
            <button onClick={clearSearch} className="clearSearchButton">
              Clear Search
            </button>
          )}
          {activeFilter !== 'all' && (
            <button 
              onClick={() => setActiveFilter('all')} 
              className="clearSearchButton"
              style={{ marginLeft: '10px' }}
            >
              Show All
            </button>
          )}
        </div>
      ) : (
        <div className="featureColumnGrid">
          {visibleFavorites.map((item, index) => (
            <div
              key={`${item.type}-${item.id}`}
              className={`gridItem item-${item.size} ${index >= 6 ? 'lazy-item' : ''}`}
              onClick={() => item.type === "image" ? handleImageClick(item) : handleVideoClick(item)}
              style={{ animationDelay: `${(index - 6) * 0.1}s` }}
            >
              {item.type === "image" ? (
                <ImageCard 
                  image={item}
                  onLike={handleLike}
                  onSearchSimilar={() => console.log('Search similar:', item.id)}
                />
              ) : (
                <VideoCard 
                  video={item}
                  onLike={handleLike}
                  onSearchSimilar={() => console.log('Search similar:', item.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Blur Fade Overlay */}
      {visibleItems < itemsWithSize.length && (
        <div className="blurFadeOverlay">
          <div className="blurGradient"></div>
        </div>
      )}

      {/* Loading Trigger */}
      {visibleItems < itemsWithSize.length && (
        <div ref={observerRef} className="loadingTrigger">
          {loading && <div className="loadingSpinner">Loading more favorites...</div>}
        </div>
      )}

      {/* Modals */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseImageModal}
          onLike={handleLike}
          onComment={(imageId, comment) => console.log('Comment:', imageId, comment)}
        />
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseVideoModal}
          onLike={handleLike}
          onComment={(videoId, comment) => console.log('Comment:', videoId, comment)}
        />
      )}
    </div>
  );
}

export default FavouriteItems;
