import React, { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import VideoModal from "../VideoModal/VideoModal";
import videosData from "../VideoGallery/videosData.json";
import "./VideoSlider.scss";

function VideoSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  // JSON'dan ilk 12 video al (slider için)
  const topVideos = useMemo(() => {
    return videosData.videos.slice(0, 12);
  }, []);

  const handleVideoClick = useCallback((video) => {
    setSelectedVideo(video);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const handleLike = useCallback((videoId) => {
    console.log('Liked slider video:', videoId);
  }, []);

  const handleSearchSimilar = useCallback((videoId) => {
    navigate(`/similar/video/${videoId}`);
  }, [navigate]);

  return (
    <div className="videoSliderSection">
      {/* Section Header */}
      <div className="sectionHeader">
        <div className="headerContent">
          <div className="titleWrapper">
            <h2 className="sectionTitle">Trending Videos</h2>
          </div>
          <p className="sectionSubtitle">
            Watch the most popular AI-generated videos from our creative community
          </p>
        </div>
      </div>

      {/* Video Slider */}
      <div 
        id="top" 
        className={`infiniteVideoSlider ${isPaused ? 'paused' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="sliderTrack">
          {/* İlk set - orijinal videolar */}
          <div className="slideSet">
            {topVideos.map((video) => (
              <VideoSlideCard 
                key={`first-${video.id}`} 
                video={video}
                onVideoClick={handleVideoClick}
                onLike={handleLike}
                onSearchSimilar={handleSearchSimilar}
              />
            ))}
          </div>
          
          {/* İkinci set - duplike videolar (seamless loop için) */}
          <div className="slideSet">
            {topVideos.map((video) => (
              <VideoSlideCard 
                key={`second-${video.id}`} 
                video={video}
                onVideoClick={handleVideoClick}
                onLike={handleLike}
                onSearchSimilar={handleSearchSimilar}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={(videoId, comment) => console.log('Comment:', videoId, comment)}
        />
      )}
    </div>
  );
}

// VideoSlideCard'ı ana component dışına çıkar - Re-render önlemi
const VideoSlideCard = React.memo(({ video, onVideoClick, onLike, onSearchSimilar }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleSliderLike = useCallback((e) => {
    e.stopPropagation();
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(video.id);
  }, [isLiked, onLike, video.id]);

  const handleSliderSearchSimilar = useCallback((e) => {
    e.stopPropagation();
    onSearchSimilar(video.id);
  }, [onSearchSimilar, video.id]);

  const handleClick = useCallback(() => {
    onVideoClick(video);
  }, [onVideoClick, video]);

  // Hover'da video oynatma
  const handleMouseEnter = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return (
    <div 
      className="slide" 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slideVideoContainer">
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          muted
          loop
          playsInline
          preload="metadata"
          className="slideVideo"
        />

        {/* Video Duration Badge */}
        <div className="videoDurationBadge">
          {video.duration}
        </div>
        
        {/* Bottom Bar */}
        <div className="slideBottomBar">
          {/* Sol taraf - Author */}
          <div className="slideAuthorInfo">
            <span className="slideAuthorName">{video.author}</span>
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

VideoSlideCard.displayName = 'VideoSlideCard';

export default VideoSlider;
