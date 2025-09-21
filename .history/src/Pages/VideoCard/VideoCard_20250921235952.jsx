// src/components/VideoCard/VideoCard.js

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, Play, Pause } from "lucide-react";
import "./VideoCard.scss";

function VideoCard({ video, onLike, onSearchSimilar }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(video.id);
  };

  const handleSearchSimilar = (e) => {
    e.stopPropagation();
    navigate(`/similar/video/${video.id}`);
    if (onSearchSimilar) onSearchSimilar(video.id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(console.error);
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const handlePlayPause = useCallback((e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="videoCard">
      <div className="videoContainer">
        <video
          ref={videoRef}
          src={video.url} // Bu hissə artıq düzgün işləyir
          poster={video.thumbnail}
          muted
          loop
          playsInline
          preload="metadata"
          className="videoPlayer"
        />
        <div className="playControlOverlay">
          <button className="playControlButton" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
        <div className="videoDuration">{video.duration}</div>
        <div className="bottomBar">
          <div className="authorInfo">
            <span className="authorName">{video.author}</span>
          </div>
          <div className="actionButtons">
            <button className="actionBtn searchBtn" onClick={handleSearchSimilar}>
              <Search size={16} />
            </button>
            <button className={`actionBtn likeBtn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
              <Heart size={16} fill={isLiked ? '#E74C3C' : 'none'} />
              <span className="likesCount">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
