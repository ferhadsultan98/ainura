import React, { useState, useEffect, useRef } from "react";
import "./VideoGallery.scss";
import VideoCard from "../VideoCard/VideoCard";
import VideoModal from "../VideoModal/VideoModal";
import videosData from "./videosData.json";

function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const videos = videosData.videos.map((video, index) => {
    let size = 'standard';
    if (index % 4 === 0) {
      size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
    }
    return { ...video, size };
  });

  const loadMoreVideos = () => {
    if (loading || visibleItems >= videos.length) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 6, videos.length));
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    const currentObserver = observerRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreVideos();
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
  }, [visibleItems, loading]);

  const handleVideoClick = (video) => setSelectedVideo(video);
  const handleCloseModal = () => setSelectedVideo(null);
  const handleLike = (videoId) => console.log('Liked video:', videoId);
  const handleComment = (videoId, comment) => console.log('New comment:', videoId, comment);
  const handleSearchSimilar = (videoId) => console.log('Search similar videos:', videoId);

  const visibleVideos = videos.slice(0, visibleItems);

  return (
    <div className="videoGallery">
      <div className="galleryHeader">
        <h2 className="galleryTitle">Videos</h2>
      </div>
      
      <div className="videoColumnGrid">
        {visibleVideos.map((video, index) => (
          <div
            key={video.id}
            className={`gridItem item-${video.size} ${index >= 6 ? 'lazy-item' : ''}`}
            onClick={() => handleVideoClick(video)}
            style={{ animationDelay: `${(index - 6) * 0.1}s` }}
          >
            <VideoCard 
              video={video} 
              onLike={handleLike}
              onSearchSimilar={handleSearchSimilar}
            />
          </div>
        ))}
      </div>

      {/* Blur Fade Overlay */}
      {visibleItems < videos.length && (
        <div className="blurFadeOverlay">
          <div className="blurGradient"></div>
        </div>
      )}

      {/* Loading Trigger */}
      {visibleItems < videos.length && (
        <div ref={observerRef} className="loadingTrigger">
          {loading && <div className="loadingSpinner">Loading more videos...</div>}
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

export default VideoGallery;
