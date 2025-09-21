import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import ImageModal from "../ImageModal/ImageModal";
import "./ImageSlider.scss";

function ImageSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Test datalar - comments array eklendi
  const topImages = useMemo(() => [
    { id: 1, url: "https://picsum.photos/800/400?random=1", prompt: "Fantasy castle in the clouds", author: "DreamArtist", likes: 342, comments: [] },
    { id: 2, url: "https://picsum.photos/800/400?random=2", prompt: "AI-generated cyberpunk city", author: "CyberCreator", likes: 567, comments: [] },
    { id: 3, url: "https://picsum.photos/800/400?random=3", prompt: "Space exploration mission", author: "CosmosVision", likes: 234, comments: [] },
    { id: 4, url: "https://picsum.photos/800/400?random=4", prompt: "Underwater coral kingdom", author: "OceanDreamer", likes: 445, comments: [] },
    { id: 5, url: "https://picsum.photos/800/400?random=5", prompt: "Mystical forest pathway", author: "NatureAI", likes: 389, comments: [] },
    { id: 6, url: "https://picsum.photos/800/400?random=6", prompt: "Futuristic robot companion", author: "TechVisionary", likes: 612, comments: [] },
    { id: 7, url: "https://picsum.photos/800/400?random=7", prompt: "Ancient dragon awakening", author: "MythMaker", likes: 789, comments: [] },
    { id: 8, url: "https://picsum.photos/800/400?random=8", prompt: "Neon-lit urban landscape", author: "UrbanGlow", likes: 456, comments: [] },
    { id: 9, url: "https://picsum.photos/800/400?random=9", prompt: "Magical spell casting", author: "MagicWeaver", likes: 523, comments: [] },
    { id: 10, url: "https://picsum.photos/800/400?random=10", prompt: "Alien world discovery", author: "GalacticExplorer", likes: 678, comments: [] },
    { id: 11, url: "https://picsum.photos/800/400?random=11", prompt: "Steampunk airship adventure", author: "RetroFuturist", likes: 345, comments: [] },
    { id: 12, url: "https://picsum.photos/800/400?random=12", prompt: "Crystal cave exploration", author: "GemSeeker", likes: 567, comments: [] }
  ], []);

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleLike = useCallback((imageId) => {
    console.log('Liked slider image:', imageId);
  }, []);

  const handleSearchSimilar = useCallback((imageId) => {
    navigate(`/similar/image/${imageId}`);
  }, [navigate]);

  return (
    <div className="imageSliderSection">
      {/* Section Header */}
      <div className="sectionHeader">
        <div className="headerContent">
          <div className="titleWrapper">
            <h2 className="sectionTitle">Trending Images</h2>
          </div>
          <p className="sectionSubtitle">
            Discover the most popular AI-generated artwork from our community
          </p>
        </div>
      </div>

      {/* Slider */}
      <div 
        id="top" 
        className={`infiniteSlider ${isPaused ? 'paused' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="sliderTrack">
          {/* İlk set - orijinal resimler */}
          <div className="slideSet">
            {topImages.map((img) => (
              <SlideCard 
                key={`first-${img.id}`} 
                image={img}
                onImageClick={handleImageClick}
                onLike={handleLike}
                onSearchSimilar={handleSearchSimilar}
              />
            ))}
          </div>
          
          {/* İkinci set - duplike resimler (seamless loop için) */}
          <div className="slideSet">
            {topImages.map((img) => (
              <SlideCard 
                key={`second-${img.id}`} 
                image={img}
                onImageClick={handleImageClick}
                onLike={handleLike}
                onSearchSimilar={handleSearchSimilar}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={(imageId, comment) => console.log('Comment:', imageId, comment)}
        />
      )}
    </div>
  );
}

// SlideCard'ı ana component dışına çıkar - Re-render önlemi
const SlideCard = React.memo(({ image, onImageClick, onLike, onSearchSimilar }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes);

  const handleSliderLike = useCallback((e) => {
    e.stopPropagation();
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(image.id);
  }, [isLiked, onLike, image.id]);

  const handleSliderSearchSimilar = useCallback((e) => {
    e.stopPropagation();
    onSearchSimilar(image.id);
  }, [onSearchSimilar, image.id]);

  const handleClick = useCallback(() => {
    onImageClick(image);
  }, [onImageClick, image]);

  return (
    <div className="slide" onClick={handleClick}>
      <div className="slideImageContainer">
        <img src={image.url} alt={image.prompt} loading="lazy" />
        
        {/* Bottom Bar */}
        <div className="slideBottomBar">
          {/* Sol taraf - Author */}
          <div className="slideAuthorInfo">
            <span className="slideAuthorName">{image.author}</span>
          </div>
          
          {/* Sağ taraf - Actions */}
          <div className="slideActionButtons">
            {/* Search Button */}
            <button 
              className="slideActionBtn searchBtn"
              onClick={handleSliderSearchSimilar}
              data-tooltip="Search for similar"
              type="button"
            >
              <Search size={14} strokeWidth={2} />
            </button>
            
            {/* Like Button */}
            <button 
              className={`slideActionBtn likeBtn ${isLiked ? 'liked' : ''}`}
              onClick={handleSliderLike}
              data-tooltip="Like"
              type="button"
            >
              <Heart 
                size={14} 
                strokeWidth={2}
                fill={isLiked ? '#E74C3C' : 'none'}
              />
              <span className="slideLikesCount">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

SlideCard.displayName = 'SlideCard';

export default ImageSlider;
