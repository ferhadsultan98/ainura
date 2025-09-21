// src/components/VideoGallery/VideoGallery.js

import React, { useState, useEffect, useRef } from "react";
import "./VideoGallery.scss";
import VideoCard from "../VideoCard/VideoCard";
import VideoModal from "../VideoModal/VideoModal";
import localVideosData from "./videosData.json"; // Local JSON verisi

function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Verilərin çəkilməsi və birləşdirilməsi
  useEffect(() => {
    const fetchAndCombineVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/`);
        if (!response.ok) throw new Error('Videolar yüklənərkən xəta baş verdi.');
        
        const backendData = await response.json();
        const localVideos = localVideosData.videos.map(v => ({ ...v, id: `local-${v.id}` }));
        
        const combinedVideos = [...backendData.videos, ...localVideos];
        setVideos(combinedVideos);
      } catch (err) {
        setError(err.message);
        setVideos(localVideosData.videos);
      } finally {
        setLoading(false);
      }
    };
    fetchAndCombineVideos();
  }, [API_BASE_URL]);

  // Sonsuz kaydırma (infinite scroll)
  const loadMoreVideos = () => {
    if (visibleItems >= videos.length) return;
    setVisibleItems(prev => Math.min(prev + 6, videos.length));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreVideos();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);
    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
    };
  }, [visibleItems, videos]);

  const handleVideoClick = (video) => setSelectedVideo(video);
  const handleCloseModal = () => setSelectedVideo(null);
  const handleLike = (videoId) => console.log('Liked video:', videoId);
  const handleComment = (videoId, comment) => console.log('New comment:', videoId, comment);
  const handleSearchSimilar = (videoId) => console.log('Search similar videos:', videoId);

  const visibleVideos = videos.slice(0, visibleItems);

  return (
    <div className="videoGallery">
      <div className="galleryHeader">
        <h2 className="galleryTitle">Videolar</h2>
      </div>
      
      {loading && <div className="loadingSpinner large-spinner">Yükleniyor...</div>}
      {error && <div className="errorMessage">{error}</div>}

      {!loading && !error && (
        <>
          <div className="videoColumnGrid">
            {visibleVideos.map((video) => (
              <div
                key={video.id}
                className="gridItem"
                onClick={() => handleVideoClick(video)}
              >
                {/* ✅ DÜZƏLİŞ: 'video_url' və 'url' sahələrini uyğunlaşdır */}
                <VideoCard 
                  video={{ ...video, url: video.video_url || video.url }} 
                  onLike={handleLike}
                  onSearchSimilar={handleSearchSimilar}
                />
              </div>
            ))}
          </div>

          {visibleItems < videos.length && (
            <div ref={observerRef} className="loadingTrigger">
              <span>Daha çox video yüklənir...</span>
            </div>
          )}
        </>
      )}

      {selectedVideo && (
        <VideoModal
          // ✅ DÜZƏLİŞ: 'video_url' və 'url' sahələrini uyğunlaşdır
          video={{ ...selectedVideo, url: selectedVideo.video_url || selectedVideo.url }}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

export default VideoGallery;
