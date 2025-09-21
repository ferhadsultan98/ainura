import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, Play, Pause } from "lucide-react";
import "./VideoCard.scss";

function VideoCard({ video, onLike, onSearchSimilar }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(video.id);
  };

  const handleSearchSimilar = (e) => {
    e.stopPropagation();
    
    // Similar sayfasına navigate et
    navigate(`/similar/video/${video.id}`);
    
    // Callback varsa çağır (opsiyonel)
    if (onSearchSimilar) onSearchSimilar(video.id);
  };

  // Intersection Observer for scroll-based autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        if (videoRef.current) {
          if (entry.isIntersecting) {
            // Video görünür olduğunda otomatik oynat
            videoRef.current.muted = true; // Muted autoplay için
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(console.error);
          } else {
            // Video görünmez olduğunda durdur
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Başa sar
            setIsPlaying(false);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Video'nun %50'si görünür olduğunda tetikle
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Manual play/pause control
  const handlePlayPause = useCallback((e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    }
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className="videoCard"
    >
      <div className="videoContainer">
        {/* Gerçek Video Element */}
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          muted
          loop
          playsInline
          preload="metadata"
          className="videoPlayer"
          onLoadedData={() => {
            // Video yüklendiğinde eğer görünüyorsa oynat
            if (isInView && videoRef.current) {
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(console.error);
            }
          }}
        />
        
        {/* Play/Pause Control Overlay - Hover'da görünür */}
        <div className="playControlOverlay">
          <button 
            className="playControlButton"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        {/* Video Duration */}
        <div className="videoDuration">
          {video.duration}
        </div>

        {/* Bottom Bar Overlay */}
        <div className="bottomBar">
          {/* Sol taraf - Author */}
          <div className="authorInfo">
            <span className="authorName">{video.author}</span>
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

export default VideoCard;
