import React, { useState, useRef, useEffect } from "react";
import ReactCrop from 'react-image-crop';
import { X, User, Mail, Camera, LogOut, MapPin, Link as LinkIcon, Upload, Check, Loader, Crop, RotateCcw, Move } from "lucide-react";
import 'react-image-crop/dist/ReactCrop.css';
import "./ProfileModal.scss";

function ProfileModal({ isOpen, onClose, user, onUpdateProfile, onLogout }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    avatar: user?.avatar || "",
    cover_image: user?.cover_image || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState({ avatar: false, cover: false });
  
  // Crop states
  const [showCrop, setShowCrop] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropImageType, setCropImageType] = useState('');
  const [cropOriginalFile, setCropOriginalFile] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageElement, setImageElement] = useState(null); // ✅ Separate image element state
  
  const modalRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const cropCanvasRef = useRef(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handle click outside to close modal
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

  // Update form data when user props change
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      avatar: user?.profile?.avatar_url || user?.avatar || "",
      cover_image: user?.profile?.cover_image_url || user?.cover_image || "",
    });
  }, [user]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Initialize crop when image loads - DÜZGÜN VERSİYON
  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    console.log('Image loaded:', { naturalWidth, naturalHeight, element: e.currentTarget });
    
    // Store the actual image element
    setImageElement(e.currentTarget);
    
    // Set crop based on image type
    if (cropImageType === 'avatar') {
      const size = Math.min(naturalWidth, naturalHeight);
      const x = (naturalWidth - size) / 2;
      const y = (naturalHeight - size) / 2;
      
      setCrop({
        unit: 'px',
        width: size * 0.8,
        height: size * 0.8,
        x: x + size * 0.1,
        y: y + size * 0.1,
        aspect: 1
      });
    } else {
      // Cover image - 2.5:1 aspect ratio
      const targetHeight = naturalWidth / 2.5;
      const y = Math.max(0, (naturalHeight - targetHeight) / 2);
      
      setCrop({
        unit: 'px',
        width: naturalWidth * 0.9,
        height: targetHeight * 0.8,
        x: naturalWidth * 0.05,
        y: y,
        aspect: 2.5
      });
    }
  };

  // ✅ ÇALIŞAN getCroppedImg
  const getCroppedImg = async (sourceImage, pixelCrop) => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !sourceImage) {
      throw new Error('Canvas or source image not available');
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas size to crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    console.log('Drawing on canvas:', {
      sourceImage: sourceImage.constructor.name,
      cropX: pixelCrop.x,
      cropY: pixelCrop.y,
      cropWidth: pixelCrop.width,
      cropHeight: pixelCrop.height,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });

    // Draw the cropped image
    ctx.drawImage(
      sourceImage,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            resolve(null);
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.95
      );
    });
  };

  // Handle crop complete
  const handleCropComplete = async () => {
    if (!completedCrop || !imageElement) {
      alert('Please select a crop area first');
      return;
    }

    console.log('Starting crop with:', {
      completedCrop,
      imageElement: imageElement.constructor.name,
      imageLoaded: imageElement.complete
    });

    try {
      const croppedImageBlob = await getCroppedImg(imageElement, completedCrop);
      
      if (!croppedImageBlob) {
        throw new Error('Failed to create cropped image');
      }

      const croppedFile = new File([croppedImageBlob], cropOriginalFile.name, {
        type: 'image/jpeg', // Force JPEG
        lastModified: Date.now()
      });

      console.log('Cropped file created:', croppedFile);

      // Upload the cropped image
      await handleFileUpload(croppedFile, cropImageType);
      
      // Close crop
      setShowCrop(false);
      setCropImageSrc(null);
      setCropOriginalFile(null);
      setCompletedCrop(null);
      setImageElement(null);
    } catch (error) {
      console.error('Crop error:', error);
      alert('Crop failed: ' + error.message);
    }
  };

  // Reset crop
  const resetCrop = () => {
    if (!imageElement) return;
    
    const { naturalWidth, naturalHeight } = imageElement;
    
    if (cropImageType === 'avatar') {
      const size = Math.min(naturalWidth, naturalHeight);
      const x = (naturalWidth - size) / 2;
      const y = (naturalHeight - size) / 2;
      
      setCrop({
        unit: 'px',
        width: size * 0.8,
        height: size * 0.8,
        x: x + size * 0.1,
        y: y + size * 0.1,
        aspect: 1
      });
    } else {
      const targetHeight = naturalWidth / 2.5;
      const y = Math.max(0, (naturalHeight - targetHeight) / 2);
      
      setCrop({
        unit: 'px',
        width: naturalWidth * 0.9,
        height: targetHeight * 0.8,
        x: naturalWidth * 0.05,
        y: y,
        aspect: 2.5
      });
    }
  };

  // File upload handler with crop
  const handleFileSelection = (file, type) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WEBP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    // Show crop
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropImageSrc(e.target.result);
      setCropImageType(type);
      setCropOriginalFile(file);
      setShowCrop(true);
      setImageElement(null); // Reset image element
    };
    reader.readAsDataURL(file);
  };

  // Actual file upload after crop
  const handleFileUpload = async (file, type) => {
    setIsUploading(prev => ({ ...prev, [type]: true }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', type);

      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Please login first!');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/gallery/profile/upload-image/`, {
        method: 'POST',
        body: formDataUpload,
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      const imageUrl = result.image_url;
      setFormData(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatar' : 'cover_image']: imageUrl
      }));

      if (onUpdateProfile) {
        const updatedUserData = {
          ...user,
          profile: {
            ...user.profile,
            [type === 'avatar' ? 'avatar_url' : 'cover_image_url']: imageUrl
          }
        };
        onUpdateProfile(updatedUserData);
      }

      alert(`${type === 'avatar' ? 'Avatar' : 'Cover image'} uploaded successfully!`);

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file, 'avatar');
    }
  };

  // Cover upload handler
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file, 'cover');
    }
  };

  // Trigger file inputs
  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const triggerCoverUpload = () => {
    coverInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      bio: formData.bio,
      location: formData.location,
      website: formData.website,
      avatar: formData.avatar,
      cover_image: formData.cover_image,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      avatar: user?.profile?.avatar_url || user?.avatar || "",
      cover_image: user?.profile?.cover_image_url || user?.cover_image || "",
    });
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="profileModalOverlay">
      <div className="profileModalContent" ref={modalRef}>
        {/* Close Button */}
        <button className="closeButton" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Hidden File Inputs */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          style={{ display: 'none' }}
        />

        {/* Cover Image Section */}
        <div className="coverSection">
          <div 
            className="coverImage"
            style={{ 
              backgroundImage: formData.cover_image 
                ? `url(${formData.cover_image})` 
                : 'linear-gradient(135deg, #BB86FC, #6C63FF)'
            }}
          >
            {isEditing && (
              <button 
                className="coverEditBtn"
                onClick={triggerCoverUpload}
                disabled={isUploading.cover}
              >
                {isUploading.cover ? (
                  <>
                    <Loader size={16} className="spinning" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    <span>Edit Cover</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="profileContent">
          {/* Profile Header */}
          <div className="profileHeader">
            <div className="avatarSection">
              <div className="avatarContainer">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="avatarImage"
                    key={formData.avatar}
                  />
                ) : (
                  <div className="avatarPlaceholder">
                    <User size={40} />
                  </div>
                )}
                {isEditing && (
                  <button 
                    className="avatarEditBtn"
                    onClick={triggerAvatarUpload}
                    disabled={isUploading.avatar}
                  >
                    {isUploading.avatar ? (
                      <Loader size={16} className="spinning" />
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="profileInfo">
              <h2 className="userName">
                {formData.first_name || formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}`.trim()
                  : user?.username || "User"
                }
              </h2>
              <p className="userEmail">@{user?.username || "user"}</p>
              <p className="userEmailAddress">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="profileStats">
            <div className="statItem">
              <span className="statNumber">24</span>
              <span className="statLabel">Created</span>
            </div>
            <div className="statItem">
              <span className="statNumber">156</span>
              <span className="statLabel">Likes</span>
            </div>
            <div className="statItem">
              <span className="statNumber">8</span>
              <span className="statLabel">Favorites</span>
            </div>
          </div>

          {/* Profile Form */}
          <form className="profileForm" onSubmit={handleSubmit}>
            {/* Upload Instructions with Crop */}
            {isEditing && (
              <div className="uploadInstructions">
                <div className="instructionHeader">
                  <Upload size={18} />
                  <h3>Upload & Crop Profile Images</h3>
                </div>

                {/* Crop Section */}
                {showCrop && cropImageSrc ? (
                  <div className="cropSection">
                    <div className="cropTitle">
                      <Crop size={16} />
                      <span>Crop {cropImageType === 'avatar' ? 'Profile Picture' : 'Cover Image'}</span>
                    </div>
                    
                    <div className="cropContainer">
                      <ReactCrop
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={cropImageType === 'avatar' ? 1 : 2.5}
                        minWidth={cropImageType === 'avatar' ? 100 : 200}
                        minHeight={cropImageType === 'avatar' ? 100 : 80}
                        keepSelection
                        ruleOfThirds
                      >
                        <img
                          src={cropImageSrc}
                          alt="Crop preview"
                          className="cropImage"
                          onLoad={onImageLoad}
                          style={{ maxWidth: '100%', maxHeight: '300px' }}
                          crossOrigin="anonymous"
                        />
                      </ReactCrop>
                    </div>

                    <div className="cropInstructions">
                      <div className="instruction">
                        <Move size={14} />
                        <span>Drag to reposition</span>
                      </div>
                      <div className="instruction">
                        <Crop size={14} />
                        <span>Drag corners to resize</span>
                      </div>
                    </div>

                    <div className="cropControls">
                      <button type="button" className="resetBtn" onClick={resetCrop}>
                        <RotateCcw size={14} />
                        Reset
                      </button>
                      <div className="cropActions">
                        <button type="button" className="cancelCropBtn" onClick={() => setShowCrop(false)}>
                          Cancel
                        </button>
                        <button type="button" className="applyCropBtn" onClick={handleCropComplete}>
                          <Check size={14} />
                          Apply Crop
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="uploadButtons">
                    <button type="button" className="uploadBtn avatar" onClick={triggerAvatarUpload}>
                      <User size={16} />
                      Upload Profile Picture
                    </button>
                    <button type="button" className="uploadBtn cover" onClick={triggerCoverUpload}>
                      <Camera size={16} />
                      Upload Cover Image
                    </button>
                  </div>
                )}

                <div className="uploadRules">
                  <div className="rule">
                    <Check size={14} />
                    <span>Supported formats: JPEG, PNG, WEBP</span>
                  </div>
                  <div className="rule">
                    <Check size={14} />
                    <span>Maximum file size: 5MB</span>
                  </div>
                  <div className="rule">
                    <Crop size={14} />
                    <span>Auto crop: Square (Profile), Banner (Cover)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Name Fields */}
            <div className="nameFields">
              <div className="inputGroup half">
                <label className="inputLabel">First Name</label>
                <div className="inputContainer">
                  <User className="inputIcon" size={18} />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`profileInput ${!isEditing ? "disabled" : ""}`}
                    placeholder="First name"
                  />
                </div>
              </div>
              <div className="inputGroup half">
                <label className="inputLabel">Last Name</label>
                <div className="inputContainer">
                  <User className="inputIcon" size={18} />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`profileInput ${!isEditing ? "disabled" : ""}`}
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">Username</label>
              <div className="inputContainer">
                <User className="inputIcon" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="profileInput disabled"
                  disabled
                  title="Username cannot be changed"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">Email</label>
              <div className="inputContainer">
                <Mail className="inputIcon" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profileInput disabled"
                  disabled
                  title="Email cannot be changed"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">Location</label>
              <div className="inputContainer">
                <MapPin className="inputIcon" size={20} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`profileInput ${!isEditing ? "disabled" : ""}`}
                  placeholder="Your location"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">Website</label>
              <div className="inputContainer">
                <LinkIcon className="inputIcon" size={20} />
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`profileInput ${!isEditing ? "disabled" : ""}`}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`profileTextarea ${!isEditing ? "disabled" : ""}`}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="actionButtons">
              {!isEditing ? (
                <button
                  type="button"
                  className="editBtn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="editActions">
                  <button
                    type="button"
                    className="cancelBtn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="saveBtn"
                    disabled={isUploading.avatar || isUploading.cover}
                  >
                    {isUploading.avatar || isUploading.cover ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Logout Button */}
          <div className="profileFooter">
            <button className="logoutBtn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <canvas ref={cropCanvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default ProfileModal;
