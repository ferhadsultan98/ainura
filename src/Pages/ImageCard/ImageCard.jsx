import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import "./ImageCard.scss";

function ImageCard({ image, onLike, onSearchSimilar }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation(); // Modal açılmasını engelle
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(image.id);
  };

  const handleSearchSimilar = (e) => {
    e.stopPropagation(); // Modal açılmasını engelle
    
    // Similar sayfasına navigate et
    navigate(`/similar/image/${image.id}`);
    
    // Callback varsa çağır (opsiyonel)
    if (onSearchSimilar) onSearchSimilar(image.id);
  };

  return (
    <div className="imageCard">
      <div className="imageContainer">
        <img src={image.url} alt={image.prompt} />
        
        {/* Bottom Bar Overlay */}
        <div className="bottomBar">
          {/* Sol taraf - Author */}
          <div className="authorInfo">
            <span className="authorName">{image.author}</span>
          </div>
          
          {/* Sağ taraf - Actions */}
          <div className="actionButtons">
            {/* Search Button */}
            <button 
              className="actionBtn searchBtn"
              onClick={handleSearchSimilar}
              data-tooltip="Search for similar"
            >
              <Search size={16} strokeWidth={2} />
            </button>
            
            {/* Like Button */}
            <button 
              className={`actionBtn likeBtn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              data-tooltip="Like"
            >
              <Heart 
                size={16} 
                strokeWidth={2}
                fill={isLiked ? '#E74C3C' : 'none'}
              />
              <span className="likesCount">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
