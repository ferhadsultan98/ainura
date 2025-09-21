import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Play, Pause, Volume2, VolumeX } from "lucide-react";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import "./VideoModal.scss";

function VideoModal({ video, onClose }) {
  const [likes, setLikes] = useState(video.likes || 0);
  const [comments, setComments] = useState(video.comments || []);
  const [newComment, setNewComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const videoRef = useRef(null);

  // SCROLL PREVENTION
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Auto play when modal opens
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
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
      await navigator.clipboard.writeText(video.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Video Controls
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Author click handler
  const handleAuthorClick = (e) => {
    e.stopPropagation();
    setShowUserProfile(true);
  };

  return (
    <>
      <div className="videoModalOverlay" onClick={onClose}>
        <div className="videoModalContent" onClick={(e) => e.stopPropagation()}>
          <div className="videoModalBody">
            <div className="videoSection">
              <div className="videoContainer">
                <video
                  ref={videoRef}
                  src={video.url}
                  poster={video.thumbnail}
                  loop
                  muted={isMuted}
                  playsInline
                  className="modalVideo"
                  onLoadedData={() => {
                    if (videoRef.current) {
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                />
                
                {/* Video Controls Overlay */}
                <div className="videoControlsOverlay">
                  <div className="videoControls">
                    <button className="controlBtn playPauseBtn" onClick={handlePlayPause}>
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <button className="controlBtn muteBtn" onClick={handleMuteToggle}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </div>

                {/* Video Duration */}
                <div className="videoDurationBadge">
                  {video.duration}
                </div>

                {/* Video Overlay - Author Info ve Likes */}
                <div className="videoOverlay">
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
                      {video.author}
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
                  <h3 className="promptTitle">🎬 Video Prompt</h3>
                  <button 
                    className={`copyBtn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyPrompt}
                    title={copied ? "Copied!" : "Copy prompt"}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="promptTextContainer">
                  <p className="promptText">{video.prompt}</p>
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
        username={video.author}
      />
    </>
  );
}

export default VideoModal;
