import React, { useState, useEffect, useRef } from "react";
import "./VideoGallery.scss";
import VideoCard from "../VideoCard/VideoCard";
import VideoModal from "../VideoModal/VideoModal";
import videosData from "./videosData.json"; // Local JSON veriniz

function VideoGallery() {
  const [videos, setVideos] = useState([]); // Bütün videolar (birləşdirilmiş)
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Veriləri çəkmək və birləşdirmək üçün useEffect
  useEffect(() => {
    const fetchAndCombineVideos = async () => {
      setLoading(true);
      setError(null);
      
      // Başlanğıc olaraq local JSON-u yükləyirik
      const localVideos = videosData.videos.map((video, index) => {
        let size = 'standard';
        if (index % 4 === 0) {
          size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
        }
        return { ...video, id: `local-${video.id}`, size };
      });

      try {
        // Backend'dən videoları çəkirik
        const response = await fetch(`${API_BASE_URL}/api/videos/`);
        if (!response.ok) {
          throw new Error('Videolar yüklənərkən xəta baş verdi.');
        }
        
        const backendData = await response.json();

        // Backend'dən gələn videolara da ölçü təyin edirik
        const backendVideos = backendData.videos.map((video, index) => {
            let size = 'standard';
            if (index % 4 === 0) {
                size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
            }
            return { ...video, size };
        });
        
        // Videoları birləşdiririk (yeni olanlar yuxarıda)
        const combinedVideos = [...backendVideos, ...localVideos];
        setVideos(combinedVideos);

      } catch (err) {
        setError(err.message);
        // Xəta baş verərsə, yalnız local videoları göstəririk
        setVideos(localVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCombineVideos();
  }, [API_BASE_URL]);

  // "Sonsuz" scroll üçün daha çox video yükləmə funksiyası
  const loadMoreVideos = () => { 
    if (loading || visibleItems >= videos.length) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 6, videos.length));
      setLoading(false);
    }, 300);
  };

  // Intersection Observer
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
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    if (currentObserver) {
      observer.observe(currentObserver);
    }
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [visibleItems, loading]); // `videos` state'ini bağımlılıqdan çıxarmaq olar

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
      
      {loading && visibleItems === 6 && <div className="loadingSpinner">Yükleniyor...</div>}
      {error && <div className="errorMessage">{error}</div>}
      
      <div className="videoColumnGrid">
        {visibleVideos.map((video, index) => (
          <div
            key={video.id}
            className={`gridItem item-${video.size} ${index >= 6 ? 'lazy-item' : ''}`}
            onClick={() => handleVideoClick(video)}
            style={{ animationDelay: `${(index - 6) * 0.1}s` }}
          >
            {/* ✅ DÜZƏLİŞ BURADA: Prop'u düzgün formatda ötürürük */}
            <VideoCard 
              video={{ ...video, url: video.video_url || video.url }} 
              onLike={handleLike}
              onSearchSimilar={handleSearchSimilar}
            />
          </div>
        ))}
      </div>

      {visibleItems < videos.length && (
        <div className="blurFadeOverlay">
          <div className="blurGradient"></div>
        </div>
      )}

      {visibleItems < videos.length && (
        <div ref={observerRef} className="loadingTrigger">
          {loading && <div className="loadingSpinner">Daha çox video yüklənir...</div>}
        </div>
      )}

      {selectedVideo && (
        // ✅ DÜZƏLİŞ BURADA: Prop'u düzgün formatda ötürürük
        <VideoModal
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
