import React, { useState, useEffect, useRef } from "react";
import "./VideoGallery.scss";
import VideoCard from "../VideoCard/VideoCard";
import VideoModal from "../VideoModal/VideoModal";
import videosData from "./videosData.json";

function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(false); // Backend yükləməsi üçün
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // İlk öncə local JSON məlumatlarını yüklə
  useEffect(() => {
    // Local JSON'dan videoları ölçülendirərək hazırlayırıq
    const localSizedVideos = videosData.videos.map((video, index) => {
      let size = "standard";
      if (index % 4 === 0) {
        size = (index / 4) % 2 === 0 ? "tall" : "standard";
      }
      return { ...video, id: `local-${video.id}`, size };
    });

    // Dərhal local məlumatları göstər
    setVideos(localSizedVideos);
  }, []);

  // Sonra backend'dən məlumatları çək
  useEffect(() => {
    const fetchBackendVideos = async () => {
      if (!API_BASE_URL) return; // API URL yoxdursa, çıx

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/`);
        if (!response.ok) {
          throw new Error("Backend məlumatları yüklənərkən xəta baş verdi.");
        }

        const backendData = await response.json();

        // Backend'dən gələn videolara da ölçü təyin edirik
        const backendSizedVideos = backendData.videos.map((video, index) => {
          let size = "standard";
          if (index % 4 === 0) {
            size = (index / 4) % 2 === 0 ? "tall" : "standard";
          }
          return { ...video, size };
        });

        // Backend məlumatlarını əvvəlki məlumatlarla birləşdir (yeni olanlar başda)
        setVideos(prevVideos => [...backendSizedVideos, ...prevVideos]);

      } catch (err) {
        console.error('Backend məlumatları yüklənə bilmədi:', err);
        setError(err.message);
        // Xəta baş verərsə, local məlumatlar onsuz da göstərilib
      } finally {
        setLoading(false);
      }
    };

    fetchBackendVideos();
  }, [API_BASE_URL]);

  const loadMoreVideos = () => {
    if (visibleItems >= videos.length) return;
    setVisibleItems(prev => Math.min(prev + 6, videos.length));
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
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [visibleItems, videos]);

  const handleVideoClick = (video) => setSelectedVideo(video);
  const handleCloseModal = () => setSelectedVideo(null);
  const handleLike = (videoId) => console.log("Liked video:", videoId);
  const handleComment = (videoId, comment) =>
    console.log("New comment:", videoId, comment);
  const handleSearchSimilar = (videoId) =>
    console.log("Search similar videos:", videoId);

  const visibleVideos = videos.slice(0, visibleItems);

  return (
    <div className="videoGallery">
      <div className="galleryHeader">
        <h2 className="galleryTitle">Videos</h2>
        {/* Backend yükləmə statusunu göstər */}
        {loading && <div className="apiLoadingBadge">Yeni videolar yüklənir...</div>}
        {error && <div className="apiErrorBadge">API əlçatmazsızdır</div>}
      </div>

      <div className="videoColumnGrid">
        {visibleVideos.map((video, index) => (
          <div
            key={video.id}
            className={`gridItem item-${video.size} ${
              index >= 6 ? "lazy-item" : ""
            }`}
            onClick={() => handleVideoClick(video)}
            style={{ animationDelay: `${(index - 6) * 0.1}s` }}
          >
            {/* ✅ DÜZƏLİŞ: Prop'u düzgün formatda ötürürük */}
            <VideoCard
              video={{ ...video, url: video.video || video.url }}
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
          <div className="loadingSpinner">Loading more videos...</div>
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          // ✅ DÜZƏLİŞ: Prop'u düzgün formatda ötürürük
          video={{
            ...selectedVideo,
            url: selectedVideo.video || selectedVideo.url,
          }}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

export default VideoGallery;
