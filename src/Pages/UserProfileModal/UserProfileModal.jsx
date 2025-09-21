import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Heart, 
  Image as ImageIcon, 
  Play,
  Users,
  Star,
  Award,
  MessageCircle
} from 'lucide-react';
import './UserProfileModal.scss';

const UserProfileModal = ({ isOpen, onClose, username, userData = null }) => {
  const [activeTab, setActiveTab] = useState('artworks');
  const modalRef = useRef(null);

  // Mock user data - gerçekte API'den gelecek
  const mockUserData = {
    username: username,
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    bio: 'Digital artist passionate about AI-generated art and futuristic designs. Creating unique visual experiences with cutting-edge technology.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=300&fit=crop',
    joinDate: 'March 2023',
    location: 'San Francisco, CA',
    website: 'johnsmith.art',
    stats: {
      artworks: 127,
      likes: 15420
    },
    badges: [
      { name: 'Top Creator', icon: Award, color: '#FFD700' },
      { name: 'Trending Artist', icon: Star, color: '#FF6B6B' }
    ],
    recentArtworks: [
      {
        id: 1,
        type: 'image',
        thumbnail: 'https://picsum.photos/200/200?random=1',
        likes: 234
      },
      {
        id: 2,
        type: 'video',
        thumbnail: 'https://picsum.photos/200/200?random=2',
        likes: 156
      },
      {
        id: 3,
        type: 'image',
        thumbnail: 'https://picsum.photos/200/200?random=3',
        likes: 189
      },
      {
        id: 4,
        type: 'image',
        thumbnail: 'https://picsum.photos/200/200?random=4',
        likes: 298
      },
      {
        id: 5,
        type: 'video',
        thumbnail: 'https://picsum.photos/200/200?random=5',
        likes: 167
      },
      {
        id: 6,
        type: 'image',
        thumbnail: 'https://picsum.photos/200/200?random=6',
        likes: 245
      }
    ]
  };

  const user = userData || mockUserData;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="userProfileModalOverlay">
      <div className="userProfileModalContent" ref={modalRef}>
        {/* Close Button */}
        {/* <button className="closeButton" onClick={onClose}>
          <X size={24} />
        </button> */}

        {/* Cover Section */}
        <div className="coverSection">
          <div 
            className="coverImage"
            style={{ backgroundImage: `url(${user.coverImage})` }}
          >
            <div className="coverGradient"></div>
          </div>
          
          {/* Profile Info */}
          <div className="profileInfo">
            <div className="avatarSection">
              <div className="avatar">
                <img src={user.avatar} alt={user.fullName} />
              </div>
              
              <div className="userDetails">
                <h1 className="fullName">{user.fullName}</h1>
                <p className="username">@{user.username}</p>
                
                {/* User Meta */}
                <div className="userMeta">
                  <div className="metaItem">
                    <Calendar size={14} />
                    <span>Joined {user.joinDate}</span>
                  </div>
                  {user.location && (
                    <div className="metaItem">
                      <MapPin size={14} />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="metaItem">
                      <LinkIcon size={14} />
                      <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons with Coming Soon tooltips */}
            <div className="actionButtons">
              <button 
                className="followBtn"
                title="Coming Soon"
              >
                <Users size={16} />
                Follow
              </button>
              
              <button 
                className="messageBtn"
                title="Coming Soon"
              >
                <MessageCircle size={16} />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section - Removed Followers, Following, Views */}
        <div className="statsSection">
          <div className="statsGrid">
            <div className="statItem">
              <span className="statNumber">{user.stats.artworks}</span>
              <span className="statLabel">Artworks</span>
            </div>
            <div className="statItem">
              <span className="statNumber">{user.stats.likes.toLocaleString()}</span>
              <span className="statLabel">Likes</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {user.bio && (
          <div className="bioSection">
            <h3>About</h3>
            <p>{user.bio}</p>
          </div>
        )}

        {/* Badges Section */}
        {user.badges && user.badges.length > 0 && (
          <div className="badgesSection">
            <h3>Achievements</h3>
            <div className="badgesGrid">
              {user.badges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={index} className="badge">
                    <IconComponent size={18} style={{ color: badge.color }} />
                    <span>{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="contentSection">
          <div className="tabNavigation">
            <button 
              className={`tabBtn ${activeTab === 'artworks' ? 'active' : ''}`}
              onClick={() => setActiveTab('artworks')}
            >
              <ImageIcon size={16} />
              Recent Artworks
            </button>
          </div>

          {/* Artworks Grid */}
          <div className="artworksGrid">
            {user.recentArtworks.map((artwork) => (
              <div key={artwork.id} className="artworkItem">
                <div className="artworkThumbnail">
                  <img src={artwork.thumbnail} alt="Artwork" />
                  
                  {/* Type Indicator */}
                  <div className="typeIndicator">
                    {artwork.type === 'video' ? <Play size={12} /> : <ImageIcon size={12} />}
                  </div>

                  {/* Hover Overlay */}
                  <div className="artworkOverlay">
                    <div className="artworkStats">
                      <div className="statItem">
                        <Heart size={14} />
                        <span>{artwork.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
