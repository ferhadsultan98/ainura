import React, { useState, useEffect } from "react";
import "./WelcomeButton.scss";

function WelcomeButton() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messageVisible, setMessageVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  
  const welcomeMessages = [
    "Hi! I am AI Nura 👋",
    "Welcome to our gallery!",
    "Let's explore together!",
    "Discover amazing AI art!"
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(welcomeMessages[0]);

  // Typing effect
  useEffect(() => {
    if (showWelcome && messageVisible) {
      const message = currentMessage;
      let i = 0;
      setTypedText("");
      
      const typingInterval = setInterval(() => {
        setTypedText(message.substring(0, i));
        i++;
        
        if (i > message.length) {
          clearInterval(typingInterval);
          
          // Next message after 2 seconds
          setTimeout(() => {
            const nextIndex = (currentMessageIndex + 1) % welcomeMessages.length;
            setCurrentMessageIndex(nextIndex);
            setCurrentMessage(welcomeMessages[nextIndex]);
          }, 2000);
        }
      }, 80);
      
      return () => clearInterval(typingInterval);
    }
  }, [currentMessage, messageVisible, showWelcome]);

  // Show message bubble after button appears
  useEffect(() => {
    if (showWelcome) {
      const messageTimer = setTimeout(() => {
        setMessageVisible(true);
      }, 800);
      
      return () => clearTimeout(messageTimer);
    }
  }, [showWelcome]);

  // Auto hide after 10 seconds
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 10000);
    
    return () => clearTimeout(hideTimer);
  }, []);

  const handleButtonClick = () => {
    setShowWelcome(false);
  };

  const handleMessageClick = () => {
    setMessageVisible(false);
  };

  if (!showWelcome) return null;

  return (
    <div className="welcomeButton">
      {/* Message Bubble */}
      {messageVisible && (
        <div 
          className="messageBubble"
          onClick={handleMessageClick}
        >
          <div className="bubbleContent">
            <span className="typedText">{typedText}</span>
            <span className="cursor">|</span>
          </div>
          <div className="bubbleArrow"></div>
        </div>
      )}
      
      {/* Welcome Button */}
      <button 
        className="welcomeBtn"
        onClick={handleButtonClick}
        aria-label="Welcome - Click to dismiss"
      >
        <div className="buttonContent">
          <span className="waveHand">👋</span>
          <span className="buttonText">AI Nura</span>
        </div>
        
        {/* Ripple effect */}
        <div className="ripple"></div>
        <div className="ripple delay-1"></div>
        <div className="ripple delay-2"></div>
      </button>
    </div>
  );
}

export default WelcomeButton;
