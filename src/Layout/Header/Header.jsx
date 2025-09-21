import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react";
import { User, LogOut } from "lucide-react";
import AuthModal from "../../Components/AuthModal/AuthModal";
import ProfileModal from "../../Components/ProfileModal/ProfileModal";
import "./Header.scss";
import AiNuraLogo from '../../../public/assets/ainuracolorlogo.png';

function Header() {
  const [isOpen, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: null
  });

  // Check localStorage on component mount and setup global function
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setUserData(userData);
          setIsLoggedIn(true);
        } else {
          // Clear state if no valid auth data
          setIsLoggedIn(false);
          setUserData({
            username: "",
            email: "",
            bio: "",
            avatar: null
          });
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData({
          username: "",
          email: "",
          bio: "",
          avatar: null
        });
      }
    };

    // Initial check
    checkStoredAuth();

    // Setup global function for BottomSubmenu to open auth modal
    window.openAuthModal = () => {
      setShowAuthModal(true);
    };

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkStoredAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case localStorage changes in same tab
    const interval = setInterval(checkStoredAuth, 1000);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      // Remove global function
      if (window.openAuthModal) {
        delete window.openAuthModal;
      }
    };
  }, []);

  const toggleMenu = () => setOpen(!isOpen);

  const handleLogin = (loginData) => {
    // AuthModal already saves to localStorage, just update state
    if (loginData?.username) {
      setUserData(prev => ({ ...prev, ...loginData }));
      setIsLoggedIn(true);
    }
    setShowAuthModal(false);
    setOpen(false);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setShowProfileModal(false);
    setOpen(false);
    setUserData({
      username: "",
      email: "",
      bio: "",
      avatar: null
    });
  };

  const handleUpdateProfile = (updatedData) => {
    const updatedUser = { ...userData, ...updatedData };
    setUserData(updatedUser);
    
    // Update localStorage
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    
    console.log('Profile updated:', updatedData);
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
    setOpen(false);
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
    setOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <img className="AiNuraLogo" src={AiNuraLogo} alt="AiNura Logo" />
          <Link to="/" onClick={() => setOpen(false)} className="logoText">
            <span className="aiText">AI</span>
            <span className="nuraText">Nura</span>
          </Link>
        </div>

        <nav className={`header-nav ${isOpen ? "open" : ""}`}>
          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to="/faq" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
          
          {isLoggedIn ? (
            <div className="profile-section">
              <button className="profile-btn" onClick={openProfileModal}>
                <User size={20} strokeWidth={2} />
                <span className="userName">{userData.username || "User"}</span>
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={openAuthModal}>
              <User size={20} strokeWidth={2} />
              <span>Login</span>
            </button>
          )}
        </nav>

        <div className="hamburger-button">
          <Hamburger
            toggled={isOpen}
            toggle={toggleMenu}
            size={24}
            duration={0.4}
            distance="md"
            color="#ffffff"
            easing="ease-in-out"
            label="Toggle menu"
            rounded
          />
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={userData}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Header;
