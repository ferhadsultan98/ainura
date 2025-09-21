import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import "./ImageModal.scss";

function ImageModal({ image, onClose }) {
  const [likes, setLikes] = useState(image.likes || 0);
  const [comments, setComments] = useState(image.comments || []);
  const [newComment, setNewComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // SCROLL PREVENTION
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLike = () => setLikes(likes + 1);

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  // COPY TO CLIPBOARD FUNCTION
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Author click handler
  const handleAuthorClick = (e) => {
    e.stopPropagation();
    setShowUserProfile(true);
  };

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <div className="modalBody">
            <div className="imageSection">
              <div className="imageContainer">
                <img src={image.url} alt={image.prompt} className="modalImage" />
                
                {/* Image Overlay - Author Info ve Likes */}
                <div className="imageOverlay">
                  <div className="authorInfo">
                    <div className="authorAvatar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span 
                      className="authorName clickable" 
                      onClick={handleAuthorClick}
                    >
                      {image.author}
                    </span>
                  </div>
                  
                  <div className="likesInfo">
                    <button className="likeBtn" onClick={handleLike}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>{likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="infoSection">
              <div className="promptSection">
                <div className="promptHeader">
                  <h3 className="promptTitle">🎨 AI Prompt</h3>
                  <button 
                    className={`copyBtn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyPrompt}
                    title={copied ? "Copied!" : "Copy prompt"}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="promptTextContainer">
                  <p className="promptText">{image.prompt}</p>
                </div>
              </div>

              <div className="commentsSection">
                <h4 className="commentsTitle">💬 Comments ({comments.length})</h4>
                
                <div className="commentsList">
                  {comments.length === 0 ? (
                    <p className="noComments">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((c, i) => (
                      <div key={i} className="commentItem">
                        <div className="commentAvatar">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div className="commentContent">{c}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="addCommentForm">
                  <div className="inputGroup">
                    <textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="commentInput"
                      rows="2"
                    />
                  </div>
                  <button 
                    className="addCommentBtn" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                    </svg>
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        username={image.author}
      />
    </>
  );
}

export default ImageModal;
