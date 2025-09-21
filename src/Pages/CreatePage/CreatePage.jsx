import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Type, 
  Image as ImageIcon, 
  X,
  AlertCircle,
  Send,
  Loader,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreatePage.scss';

const CreatePage = () => {
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Dosya seçildiğinde veya sürüklendiğinde çalışacak fonksiyon
  const handleFileUpload = (file) => {
    if (!file) return;
    
    // Dosya tipini kontrol et (image veya video)
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Lütfen bir resim veya video dosyası yükleyin.');
      return;
    }
    
    // Dosya boyutunu kontrol et (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('Dosya boyutu 50MB\'dan küçük olmalıdır.');
      return;
    }
    
    // Dosyayı state'e kaydet ve önizlemesini oluştur
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile(file);
      setPreviewUrl(e.target.result);
      setFileType(isImage ? 'image' : 'video');
      setError(''); // Hataları temizle
    };
    reader.readAsDataURL(file);
  };

  // Sürükle-bırak işlemleri için handler'lar
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Dosya inputu değiştiğinde çalışacak handler
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  // Yüklenen dosyayı kaldırma fonksiyonu
  const removeUploadedFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setFileType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Input'u temizle
    }
  };

  // Backend'e gönderme fonksiyonu
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Lütfen bir açıklama (prompt) girin.');
      return;
    }

    if (!uploadedFile) {
      setError('Lütfen bir resim veya video yükleyin.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Lütfen önce giriş yapın.');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      // Backend'in beklediği field isimleri: image veya video
      if (fileType === 'image') {
        formData.append('image', uploadedFile);
      } else {
        formData.append('video', uploadedFile);
      }
      formData.append('prompt', prompt.trim());
      formData.append('type', fileType);

      // Backend'e isteği gönder
      const response = await fetch(`${API_BASE_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Yükleme başarısız oldu.' }));
        throw new Error(errorData.error || `HTTP Hatası: ${response.status}`);
      }

      await response.json();
      
      alert(`${fileType === 'image' ? 'Resim' : 'Video'} başarıyla yüklendi!`);
      
      // Başarılı yükleme sonrası formu sıfırla ve ilgili sayfaya yönlendir
      if (fileType === 'image') {
        navigate('/images');
      } else {
        navigate('/videos');
      }

    } catch (error) {
      setError(error.message || 'Yükleme sırasında bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="createPage">
      <div className="createContainer">
        <div className="createHeader">
          <h1>Oluştur & Paylaş</h1>
          <p>Toplulukla paylaşmak için resimlerinizi ve videolarınızı yaratıcı açıklamalarla yükleyin</p>
        </div>

        <div className="createContent">
          <div className="promptSection">
            <label className="sectionLabel">
              <Type size={20} />
              Eserinizi Tanımlayın
            </label>
            <textarea
              className="promptInput"
              placeholder="Altın saatlerde çekilmiş, canlı renklere sahip dağların üzerinde güzel bir gün batımı..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="promptCounter">
              {prompt.length}/500 karakter
            </div>
          </div>

          <div className="uploadSection">
            <label className="sectionLabel">
              <ImageIcon size={20} />
              Resim veya Video Yükle
            </label>
            
            {!previewUrl ? (
              <div
                className="dropZone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropContent">
                  <Upload size={48} />
                  <h3>İçeriğinizi Yükleyin</h3>
                  <p>Bir resim veya video sürükleyin ya da tıklayarak seçin</p>
                  <div className="fileFormats">
                    <div className="format">
                      <ImageIcon size={20} />
                      <span>Resimler: PNG, JPG, WEBP</span>
                    </div>
                    <div className="format">
                      <Video size={20} />
                      <span>Videolar: MP4, MOV, AVI</span>
                    </div>
                  </div>
                  <span className="fileInfo">Maksimum dosya boyutu: 50MB</span>
                </div>
              </div>
            ) : (
              <div className="filePreview">
                {fileType === 'image' ? (
                  <img src={previewUrl} alt="Önizleme" />
                ) : (
                  <video controls src={previewUrl} />
                )}
                
                <button
                  className="removeFileBtn"
                  onClick={removeUploadedFile}
                  title="Dosyayı kaldır"
                >
                  <X size={20} />
                </button>
                
                <div className="fileInfo">
                  <div className="fileType">
                    {fileType === 'image' ? <ImageIcon size={16} /> : <Video size={16} />}
                    <span>{fileType === 'image' ? 'Resim' : 'Video'}</span>
                  </div>
                  <div className="fileName">{uploadedFile.name}</div>
                  <div className="fileSize">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInputChange}
              className="fileInput"
            />
          </div>

          {error && (
            <div className="errorMessage">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {prompt && previewUrl && (
            <div className="submitSection">
              <button 
                className="submitBtn" 
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader size={20} className="spinning" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Paylaş
                  </>
                )}
              </button>
              
              <div className="submitInfo">
                <p>Eseriniz galerideki {fileType === 'image' ? 'Resimler' : 'Videolar'} bölümünde paylaşılacak</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
