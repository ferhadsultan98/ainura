import React, { useState, useEffect, useRef } from "react";
import "./VideoGallery.scss";
import VideoCard from "../VideoCard/VideoCard";
import VideoModal from "../VideoModal/VideoModal";
import videosData from "./videosData.json";

function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAndCombineVideos = async () => {
      setLoading(true);
      setError(null);

      const localSizedVideos = videosData.videos.map((video, index) => {
        let size = "standard";
        if (index % 4 === 0) {
          size = (index / 4) % 2 === 0 ? "tall" : "standard";
        }
        return { ...video, id: `local-${video.id}`, size };
      });

      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/`);
        if (!response.ok) {
          throw new Error("Videolar yüklənərkən xəta baş verdi.");
        }

        const backendData = await response.json();

        const backendSizedVideos = backendData.videos.map((video, index) => {
          let size = "standard";
          if (index % 4 === 0) {
            size = (index / 4) % 2 === 0 ? "tall" : "standard";
          }
          return { ...video, size };
        });

        const combinedVideos = [...backendSizedVideos, ...localSizedVideos];
        setVideos(combinedVideos);
      } catch (err) {
        setError(err.message);
        setVideos(localSizedVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCombineVideos();
  }, [API_BASE_URL]);

  const loadMoreVideos = () => {
    if (loading || visibleItems >= videos.length) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 6, videos.length));
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
  }, [visibleItems, loading, videos]);

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
           {" "}
      <div className="galleryHeader">
                <h2 className="galleryTitle">Videos</h2>     {" "}
      </div>
           
      {loading && visibleItems === 6 && (
        <div className="loadingSpinner">Yükleniyor...</div>
      )}
      {error && <div className="errorMessage">{error}</div>}     {" "}
      <div className="videoColumnGrid">
               {" "}
        {visibleVideos.map((video, index) => (
          <div
            key={video.id}
            className={`gridItem item-${video.size} ${
              index >= 6 ? "lazy-item" : ""
            }`}
            onClick={() => handleVideoClick(video)}
            style={{ animationDelay: `${(index - 6) * 0.1}s` }}
          >
                       {" "}
            <VideoCard
              // ✅ DÜZƏLİŞ: Prop'u düzgün formatda ötürürük
              video={{ ...video, url: video.video || video.url }}
              onLike={handleLike}
              onSearchSimilar={handleSearchSimilar}
            />
                     {" "}
          </div>
        ))}
             {" "}
      </div>
           {" "}
      {visibleItems < videos.length && (
        <div className="blurFadeOverlay">
                    <div className="blurGradient"></div>       {" "}
        </div>
      )}
           {" "}
      {visibleItems < videos.length && (
        <div ref={observerRef} className="loadingTrigger">
                   {" "}
          {loading && (
            <div className="loadingSpinner">Daha çox video yüklənir...</div>
          )}
                 {" "}
        </div>
      )}
           {" "}
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
         {" "}
    </div>
  );
}

export default VideoGallery;
