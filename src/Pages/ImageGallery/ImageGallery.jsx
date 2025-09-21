import React, { useState, useEffect, useRef } from "react";
import "./ImageGallery.scss";
import ImageCard from "../ImageCard/ImageCard";
import ImageModal from "../ImageModal/ImageModal";
import localImagesData from "./imagesData.json"; // Local JSON verisi

function ImageGallery() {
  // --- STATE TANIMLAMALARI ---
  const [images, setImages] = useState([]); // Tüm resimlerin birleştirilmiş hali
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleItems, setVisibleItems] = useState(12); // Başlangıçta gösterilecek resim sayısı
  const [loading, setLoading] = useState(true); // Veri yükleme durumu
  const [error, setError] = useState(null); // Hata durumu
  const observerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- VERİ ÇEKME VE BİRLEŞTİRME ---
  useEffect(() => {
    const fetchAndCombineImages = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Backend'den resimleri çek
        const response = await fetch(`${API_BASE_URL}/api/images/`);
        if (!response.ok) {
          throw new Error('Backend\'den veriler alınamadı.');
        }
        const backendData = await response.json();
        
        // 2. Local JSON verisini al
        const localImages = localImagesData.images;

        // 3. Verileri birleştir: Yeni yüklenenler (backend) en başta olsun
        // ID çakışmasını önlemek için local veriye 'local-' ön eki ekleyebiliriz
        const formattedLocalImages = localImages.map(img => ({ ...img, id: `local-${img.id}` }));
        const combinedImages = [...backendData.images, ...formattedLocalImages];
        
        setImages(combinedImages);

      } catch (err) {
        setError(err.message);
        // Hata durumunda sadece local veriyi göster
        setImages(localImagesData.images);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCombineImages();
  }, [API_BASE_URL]);


  // --- SONSUZ KAYDIRMA (INFINITE SCROLL) ---
  const loadMoreImages = () => {
    if (visibleItems >= images.length) return; // Tüm resimler yüklendiyse dur
    
    // Her seferinde 6 resim daha ekle
    setVisibleItems(prev => Math.min(prev + 6, images.length));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [visibleItems, images]); // 'images' bağımlılığını ekledik


  // --- EVENT HANDLERS ---
  const handleImageClick = (image) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);
  
  // TODO: Bu fonksiyonları backend'e bağla
  const handleLike = (imageId) => console.log('Liked image:', imageId);
  const handleComment = (imageId, comment) => console.log('New comment:', imageId, comment);

  // Gösterilecek resim dilimini al
  const visibleImages = images.slice(0, visibleItems);

  // --- RENDER ---
  return (
    <div className="imageGallery">
      <div className="galleryHeader">
        <h2 className="galleryTitle">Keşfet</h2>
      </div>
      
      {loading && <div className="loadingSpinner large-spinner">Yükleniyor...</div>}
      {error && <div className="errorMessage">{error}</div>}

      {!loading && !error && (
        <>
        <div className="featureColumnGrid">
  {visibleImages.map((img) => (
    <div key={img.id} className="gridItem" onClick={() => handleImageClick(img)}>
      
      {/* ✅ DÜZƏLİŞ BURADA */}
      {/* Backend'dən gələn 'image' sahəsini və ya local JSON'dakı 'url' sahəsini 'url' adı ilə göndər */}
      <ImageCard image={{ ...img, url: img.image || img.url }} />

    </div>
  ))}
</div>

          {/* Yükleme tetikleyicisi */}
          {visibleItems < images.length && (
            <div ref={observerRef} className="loadingTrigger">
              <span>Daha fazla yükleniyor...</span>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <ImageModal
          image={{...selectedImage, url: selectedImage.image_url || selectedImage.url}}
          onClose={handleCloseModal}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

export default ImageGallery;
