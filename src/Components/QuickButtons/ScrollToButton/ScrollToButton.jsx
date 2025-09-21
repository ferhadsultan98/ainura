import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import "./ScrollToButton.scss";

function ScrollToButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 300); // 300px sonra görünür yap
    };

    // Throttle fonksiyonu - performans için
    let throttleTimer = null;
    const throttleHandleScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, 10);
    };

    window.addEventListener('scroll', throttleHandleScroll);
    
    // İlk yükleme
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttleHandleScroll);
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scrollToTop ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      style={{ '--scroll-progress': `${scrollProgress}%` }}
    >
      {/* Progress Ring */}
      <div className="progressRing">
        <div className="progressBar"></div>
      </div>
      
      {/* Icon */}
      <div className="scrollIcon">
        <ChevronUp size={20} strokeWidth={2.5} />
      </div>
      
      {/* Ripple effect */}
      <div className="rippleEffect"></div>
    </button>
  );
}

export default ScrollToButton;
