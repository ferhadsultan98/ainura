import React, { useState } from "react";
import { User } from "lucide-react";
import AuthModal from "../AuthModal/AuthModal";
import "./LoginRequiredModal.scss";

function LoginRequiredModal({ isOpen, onClose, onLoginSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGoToLogin = () => {
    setShowAuthModal(true); // AuthModal'ı aç
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleLoginComplete = (loginData) => {
    setShowAuthModal(false); // AuthModal'ı kapat
    onClose(); // LoginRequired modal'ını kapat
    
    // Parent'a login başarılı bilgisini gönder
    if (onLoginSuccess) {
      onLoginSuccess(loginData);
    }
  };

  return (
    <>
      <div className="loginRequiredOverlay" onClick={handleOverlayClick}>
        <div className="loginRequiredContent">
          <div className="promptIcon">
            <User size={48} />
          </div>
          
          <h3>Login Required</h3>
          <p>You need to log in to access this feature. Join our community to create amazing AI art and save your favorites!</p>
          
          <div className="promptActions">
            <button className="loginBtn" onClick={handleGoToLogin}>
              Login / Sign Up
            </button>
            <button className="cancelBtn" onClick={onClose}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      {/* AuthModal - LoginRequired içinde */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onLogin={handleLoginComplete}
      />
    </>
  );
}

export default LoginRequiredModal;
