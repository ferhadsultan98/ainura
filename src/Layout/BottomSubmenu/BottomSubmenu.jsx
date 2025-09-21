import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Image, Video, Plus, Heart } from "lucide-react";
import LoginRequiredModal from "../../Components/LoginRequiredModal/LoginRequiredModal";
import SearchModal from "../../Components/SearchModal/SearchModal";
import "./BottomSubmenu.scss";

function BottomSubmenu() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Protected routes - login gerekli sayfalar
  const protectedRoutes = ['/create', '/favourites'];

  // Check login status from localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      const currentlyLoggedIn = !!(token && user);
      
      // Eğer login durumu değiştiyse
      if (currentlyLoggedIn !== isLoggedIn) {
        setIsLoggedIn(currentlyLoggedIn);
        
        // Eğer logout olduysa ve protected route'daysa ana sayfaya yönlendir
        if (!currentlyLoggedIn && protectedRoutes.includes(location.pathname)) {
          navigate('/');
        }
      }
    };

    // Initial check
    checkLoginStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case localStorage changes in same tab
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn, location.pathname, navigate]);

  // Eğer logout olunca protected route'daysa ana sayfaya yönlendir
  useEffect(() => {
    if (!isLoggedIn && protectedRoutes.includes(location.pathname)) {
      navigate('/');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const menuItems = [
    {
      id: 'explore',
      label: 'Explore',
      icon: Search,
      path: '/',
      requiresLogin: false
    },
    {
      id: 'images',
      label: 'Images',
      icon: Image,
      path: '/images',
      requiresLogin: false
    },
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      isCenter: true,
      path: '/create',
      requiresLogin: true
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Video,
      path: '/videos',
      requiresLogin: false
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      path: '/favourites',
      requiresLogin: true
    }
  ];

  const handleTabClick = (item) => {
    // Eğer login gerekli ve login olmamışsa
    if (item.requiresLogin && !isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    // Explore için search modal aç
    if (item.id === 'explore') {
      setShowSearchModal(true);
    } else {
      // Normal navigation
      navigate(item.path);
    }
  };

  const handleSearchClose = () => {
    setShowSearchModal(false);
  };

  const handleLoginRequiredClose = () => {
    setShowLoginRequired(false);
  };

  const handleOpenAuthModal = () => {
    // Header'daki auth modal'ı açmak için global function kullan
    if (window.openAuthModal) {
      window.openAuthModal();
    }
    // Login required modal'ını kapat
    setShowLoginRequired(false);
  };

  // Current active tab belirleme - Ana sayfa için default yok
  const getActiveTab = () => {
    const path = location.pathname;
    
    // Ana sayfa için hiçbir tab aktif olmasın
    if (path === '/') return null;
    
    // Sadece tam path eşleşmesi için aktif olsun
    const activeItem = menuItems.find(item => item.path === path);
    return activeItem ? activeItem.id : null;
  };

  const activeTab = getActiveTab();

  return (
    <>
      <div className="bottomSubmenu">
        <div className="submenuContainer">
          <div className="submenuContent">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <button
                  key={item.id}
                  className={`submenuItem ${activeTab === item.id ? 'active' : ''} ${item.isCenter ? 'center-item' : ''} ${item.id === 'favorites' ? 'favorites-btn' : ''}`}
                  onClick={() => handleTabClick(item)}
                  aria-label={item.label}
                >
                  <div className="itemIcon">
                    <IconComponent size={22} strokeWidth={2.5} />
                  </div>
                  <span className="itemLabel">{item.label}</span>
                  {activeTab === item.id && <div className="activeIndicator" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal}
        onClose={handleSearchClose}
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginRequired}
        onClose={handleLoginRequiredClose}
        onLogin={handleOpenAuthModal}
      />
    </>
  );
}

export default BottomSubmenu;
