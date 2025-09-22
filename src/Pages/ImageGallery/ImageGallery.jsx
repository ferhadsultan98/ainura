import React, { useState, useEffect, useRef } from "react";
import "./ImageGallery.scss";
import ImageCard from "../ImageCard/ImageCard";
import ImageModal from "../ImageModal/ImageModal";
import imagesData from "./imagesData.json";

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(false); // Backend yükləməsi üçün
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // İlk öncə local JSON məlumatlarını yüklə
  useEffect(() => {
    // Local JSON'dan resimleri ölçülendirərək hazırlayırıq
    const localSizedImages = imagesData.images.map((img, index) => {
      let size = 'standard';
      if (index % 4 === 0) {
        size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
      }
      return { ...img, id: `local-${img.id}`, size };
    });

    // Dərhal local məlumatları göstər
    setImages(localSizedImages);
  }, []);

  // Sonra backend'dən məlumatları çək
  useEffect(() => {
    const fetchBackendImages = async () => {
      if (!API_BASE_URL) return; // API URL yoxdursa, çıx

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/images/`);
        if (!response.ok) {
          throw new Error('Backend məlumatları yüklənərkən xəta baş verdi.');
        }
        
        const backendData = await response.json();
        
        // Backend'dən gələn resimlərə də ölçü təyin edirik
        const backendSizedImages = backendData.images.map((img, index) => {
          let size = 'standard';
          if (index % 4 === 0) {
            size = (index / 4) % 2 === 0 ? 'tall' : 'standard';
          }
          return { ...img, size };
        });
        
        // Backend məlumatlarını əvvəlki məlumatlarla birləşdir (yeni olanlar başda)
        setImages(prevImages => [...backendSizedImages, ...prevImages]);

      } catch (err) {
        console.error('Backend məlumatları yüklənə bilmədi:', err);
        setError(err.message);
        // Xəta baş verərsə, local məlumatlar onsuz da göstərilib
      } finally {
        setLoading(false);
      }
    };

    fetchBackendImages();
  }, [API_BASE_URL]);

  const loadMoreImages = () => { 
    if (visibleItems >= images.length) return;
    setVisibleItems(prev => Math.min(prev + 6, images.length));
  };

  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreImages();
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
  }, [visibleItems, images]);

  const handleImageClick = (image) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);
  const handleLike = (imageId) => console.log('Liked image:', imageId);
  const handleComment = (imageId, comment) => console.log('New comment:', imageId, comment);

  const visibleImages = images.slice(0, visibleItems);

  return (
    <div className="imageGallery">
      <div className="galleryHeader">
        <h2 className="galleryTitle">Explore</h2>
        {/* Backend yükləmə statusunu göstər */}
        {loading && <div className="apiLoadingBadge">Yeni məlumatlar yüklənir...</div>}
        {error && <div className="apiErrorBadge">API əlçatmazsızdır</div>}
      </div>
      
      <div className="featureColumnGrid">
        {visibleImages.map((img, index) => (
          <div
            key={img.id}
            className={`gridItem item-${img.size} ${index >= 6 ? 'lazy-item' : ''}`}
            onClick={() => handleImageClick(img)}
            style={{ animationDelay: `${(index - 6) * 0.1}s` }}
          >
            {/* ✅ DÜZƏLİŞ: Prop'u düzgün formatda ötürürük */}
            <ImageCard image={{ ...img, url: img.image || img.url }} />
          </div>
        ))}
      </div>

      {/* Blur Fade Overlay */}
      {visibleItems < images.length && (
        <div className="blurFadeOverlay">
          <div className="blurGradient"></div>
        </div>
      )}

      {/* Loading Trigger */}
      {visibleItems < images.length && (
        <div ref={observerRef} className="loadingTrigger">
          <div className="loadingSpinner">Loading more images...</div>
        </div>
      )}

      {selectedImage && (
        <ImageModal
          image={{ ...selectedImage, url: selectedImage.image || selectedImage.url }}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

export default ImageGallery;
