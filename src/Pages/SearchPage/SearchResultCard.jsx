import React, { useState } from "react";
import { Heart, Play, Image as ImageIcon } from "lucide-react";
import "./SearchResultCard.scss";

function SearchResultCard({ item, onLike }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes || 0);

  const handleLike = (e) => {
    e.stopPropagation(); // Modal açılmasını engelle
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(item.id);
  };

  return (
    <div className="searchResultCard">
      <div className="cardContainer">
        {/* Media Content */}
        <div className="mediaContainer">
          <img 
            src={item.image_url || item.thumbnail_url} 
            alt={item.prompt} 
          />
          
          {/* Video Play Overlay */}
          {item.type === 'video' && (
            <div className="videoIndicator">
              <Play size={24} />
              {item.duration && (
                <div className="videoDuration">{item.duration}</div>
              )}
            </div>
          )}

          {/* Type Indicator */}
          <div className="typeIndicator">
            {item.type === 'image' ? <ImageIcon size={12} /> : <Play size={12} />}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="bottomBar">
          {/* Author Info */}
          <div className="authorInfo">
            <span className="authorName">{item.author}</span>
            <div className="relevanceScore">
              Score: {item.relevanceScore || 1}
            </div>
          </div>
          
          {/* Like Button */}
          <button 
            className={`likeBtn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart 
              size={14} 
              strokeWidth={2}
              fill={isLiked ? '#E74C3C' : 'none'}
            />
            <span className="likesCount">{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResultCard;
