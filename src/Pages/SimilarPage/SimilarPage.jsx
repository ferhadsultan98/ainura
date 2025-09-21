import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import ImageCard from "../ImageCard/ImageCard";
import VideoCard from "../VideoCard/VideoCard";
import ImageModal from "../ImageModal/ImageModal";
import VideoModal from "../VideoModal/VideoModal";
import imagesData from "../ImageGallery/imagesData.json";
import videosData from "../VideoGallery/videosData.json";
import "./SimilarPage.scss";

function SimilarPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleItems, setVisibleItems] = useState(12);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // Advanced Text Processing Utils
  const textProcessingUtils = useMemo(() => ({
    // Stemming - Simple English stemmer
    stem: (word) => {
      const stemRules = [
        [/ies$/i, 'y'],
        [/ied$/i, 'y'],
        [/ying$/i, 'y'],
        [/ing$/i, ''],
        [/ly$/i, ''],
        [/ed$/i, ''],
        [/ies$/i, 'y'],
        [/ied$/i, 'y'],
        [/ies$/i, 'y'],
        [/s$/i, '']
      ];
      
      let stemmed = word.toLowerCase();
      for (let [pattern, replacement] of stemRules) {
        if (pattern.test(stemmed)) {
          stemmed = stemmed.replace(pattern, replacement);
          break;
        }
      }
      return stemmed;
    },

    // Synonym dictionary for semantic matching
    synonyms: {
      'fantasy': ['magical', 'mythical', 'enchanted', 'mystical', 'fairy', 'legendary'],
      'dragon': ['wyvern', 'drake', 'serpent', 'beast', 'monster'],
      'castle': ['fortress', 'palace', 'citadel', 'stronghold', 'keep'],
      'cyberpunk': ['futuristic', 'dystopian', 'neon', 'cyber', 'digital', 'tech'],
      'space': ['cosmic', 'stellar', 'galactic', 'universe', 'astronomy', 'planetary'],
      'ocean': ['sea', 'marine', 'aquatic', 'underwater', 'nautical', 'maritime'],
      'forest': ['woodland', 'jungle', 'trees', 'nature', 'wilderness'],
      'robot': ['android', 'cyborg', 'automaton', 'ai', 'artificial', 'mechanical'],
      'magic': ['spell', 'enchantment', 'sorcery', 'wizardry', 'mystical'],
      'urban': ['city', 'metropolitan', 'downtown', 'street', 'cityscape'],
      'vintage': ['retro', 'classic', 'antique', 'old-fashioned', 'nostalgic'],
      'bright': ['colorful', 'vibrant', 'brilliant', 'luminous', 'radiant'],
      'dark': ['gloomy', 'shadowy', 'mysterious', 'noir', 'gothic']
    },

    // Get all related words (including synonyms)
    getRelatedWords: function(word) {
      const stemmed = this.stem(word);
      let related = [word, stemmed];
      
      // Add synonyms
      if (this.synonyms[stemmed]) {
        related = [...related, ...this.synonyms[stemmed]];
      }
      
      // Check if word is synonym of something
      Object.entries(this.synonyms).forEach(([key, synonymList]) => {
        if (synonymList.includes(stemmed)) {
          related.push(key, ...synonymList);
        }
      });
      
      return [...new Set(related)]; // Remove duplicates
    },

    // TF-IDF-like scoring
    calculateTermFrequency: (term, text) => {
      const words = text.toLowerCase().split(/\s+/);
      const termCount = words.filter(word => word.includes(term)).length;
      return termCount / words.length;
    },

    // Cosine similarity between two text arrays
    cosineSimilarity: (vec1, vec2) => {
      const intersection = vec1.filter(x => vec2.includes(x));
      const magnitude1 = Math.sqrt(vec1.length);
      const magnitude2 = Math.sqrt(vec2.length);
      
      if (magnitude1 === 0 || magnitude2 === 0) return 0;
      return intersection.length / (magnitude1 * magnitude2);
    }
  }), []);

  // Original item bulma
  const originalItem = useMemo(() => {
    if (type === 'image') {
      return imagesData.images.find(img => img.id === parseInt(id));
    } else if (type === 'video') {
      return videosData.videos.find(video => video.id === parseInt(id));
    }
    return null;
  }, [type, id]);

  // Advanced Similar items algorithm
  const similarItems = useMemo(() => {
    if (!originalItem) return [];

    const originalPrompt = originalItem.prompt.toLowerCase();
    
    // Advanced keyword extraction with stemming and synonyms
    const originalWords = originalPrompt.split(/[,\s]+/).filter(word => 
      word.length > 2 && 
      !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'her', 'way', 'say'].includes(word)
    );

    // Get enhanced keywords with stemming and synonyms
    const enhancedKeywords = [];
    originalWords.forEach(word => {
      const relatedWords = textProcessingUtils.getRelatedWords(word);
      enhancedKeywords.push(...relatedWords);
    });

    let allItems = [];
    
    if (type === 'image') {
      allItems = imagesData.images
        .filter(img => img.id !== originalItem.id)
        .map(img => ({ ...img, type: 'image' }));
    } else if (type === 'video') {
      allItems = videosData.videos
        .filter(video => video.id !== originalItem.id)
        .map(video => ({ ...video, type: 'video' }));
    }

    // Advanced similarity scoring
    const scoredItems = allItems.map(item => {
      const itemPrompt = item.prompt.toLowerCase();
      const itemWords = itemPrompt.split(/[,\s]+/).filter(word => word.length > 2);
      
      let score = 0;

      // 1. Enhanced Keyword Matching with Stemming & Synonyms
      enhancedKeywords.forEach(keyword => {
        const keywordStem = textProcessingUtils.stem(keyword);
        itemWords.forEach(itemWord => {
          const itemWordStem = textProcessingUtils.stem(itemWord);
          if (itemWordStem === keywordStem || itemWord.includes(keyword) || keyword.includes(itemWord)) {
            score += 15; // Higher weight for enhanced matching
          }
        });
      });

      // 2. Cosine Similarity between prompts
      const originalVector = originalWords.map(w => textProcessingUtils.stem(w));
      const itemVector = itemWords.map(w => textProcessingUtils.stem(w));
      const cosineSim = textProcessingUtils.cosineSimilarity(originalVector, itemVector);
      score += cosineSim * 25;

      // 3. TF-IDF-like scoring for important terms
      originalWords.forEach(word => {
        const tf = textProcessingUtils.calculateTermFrequency(word, itemPrompt);
        if (tf > 0) {
          score += tf * 20;
        }
      });

      // 4. Author bonus with dynamic weighting
      if (item.author === originalItem.author) {
        score += 8; // Slightly reduced as it's not always indicative
      }

      // 5. Dynamic popularity scoring
      const likeDiff = Math.abs(item.likes - originalItem.likes);
      const maxLikes = Math.max(item.likes, originalItem.likes);
      const likeSimilarity = 1 - (likeDiff / (maxLikes + 1));
      
      if (likeSimilarity > 0.8) score += 5;
      else if (likeSimilarity > 0.6) score += 3;
      else if (likeSimilarity > 0.4) score += 1;

      // 6. Advanced theme detection with better categories
      const themes = {
        fantasy: {
          keywords: ['fantasy', 'dragon', 'castle', 'magic', 'mystical', 'mythical', 'enchanted', 'wizard', 'fairy', 'spell', 'legendary', 'magical'],
          weight: 1.2
        },
        scifi: {
          keywords: ['cyberpunk', 'futuristic', 'robot', 'space', 'alien', 'tech', 'cyber', 'sci-fi', 'android', 'ai', 'digital', 'neon'],
          weight: 1.3
        },
        nature: {
          keywords: ['forest', 'ocean', 'mountain', 'tree', 'flower', 'landscape', 'natural', 'garden', 'wildlife', 'organic', 'earth'],
          weight: 1.1
        },
        urban: {
          keywords: ['city', 'urban', 'street', 'building', 'lights', 'downtown', 'metropolitan', 'architecture', 'skyline'],
          weight: 1.0
        },
        abstract: {
          keywords: ['abstract', 'geometric', 'pattern', 'digital', 'modern', 'artistic', 'creative', 'conceptual', 'surreal'],
          weight: 1.1
        },
        vintage: {
          keywords: ['vintage', 'retro', 'old', 'classic', 'antique', 'steampunk', 'nostalgic', 'historical', 'traditional'],
          weight: 1.0
        }
      };

      let originalThemes = [];
      let itemThemes = [];

      Object.entries(themes).forEach(([theme, config]) => {
        const originalMatch = config.keywords.some(keyword => originalPrompt.includes(keyword));
        const itemMatch = config.keywords.some(keyword => itemPrompt.includes(keyword));
        
        if (originalMatch) originalThemes.push({ theme, weight: config.weight });
        if (itemMatch) itemThemes.push({ theme, weight: config.weight });
      });

      // Enhanced theme matching with weights
      originalThemes.forEach(originalTheme => {
        const matchingItemTheme = itemThemes.find(itemTheme => itemTheme.theme === originalTheme.theme);
        if (matchingItemTheme) {
          score += 20 * originalTheme.weight; // Weighted theme bonus
        }
      });

      // 7. Length similarity bonus (similar complexity)
      const lengthDiff = Math.abs(originalPrompt.length - itemPrompt.length);
      if (lengthDiff < 20) score += 2;
      else if (lengthDiff < 50) score += 1;

      return {
        ...item,
        score: Math.round(score * 10) / 10 // Round for cleaner scores
      };
    });

    // Sort by score and return top matches with better distribution
    return scoredItems
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 5) // Filter out very low scores
      .slice(0, 60) // Increased from 50 to get more variety
      .map((item, index) => {
        // More varied size distribution
        let size = 'standard';
        if (index < 8 && index % 3 === 0) {
          size = 'tall';
        } else if (index % 7 === 0 && index > 8) {
          size = 'tall';
        }
        return { ...item, size };
      });
  }, [originalItem, type, textProcessingUtils]);

  // Load more items
  const loadMoreItems = () => {
    if (loading || visibleItems >= similarItems.length) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 12, similarItems.length));
      setLoading(false);
    }, 300);
  };

  // Intersection Observer
  useEffect(() => {
    const currentObserver = observerRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreItems();
          }
        });
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [visibleItems, loading]);

  // Handlers
  const handleImageClick = (image) => setSelectedImage(image);
  const handleVideoClick = (video) => setSelectedVideo(video);
  const handleCloseImageModal = () => setSelectedImage(null);
  const handleCloseVideoModal = () => setSelectedVideo(null);

  const handleLike = (itemId) => {
    console.log('Liked similar item:', itemId);
  };

  const handleSearchSimilar = (itemId) => {
    const item = similarItems.find(item => item.id === itemId);
    if (item) {
      navigate(`/similar/${item.type}/${item.id}`);
    }
  };

  if (!originalItem) {
    return (
      <div className="imageGallery">
        <div className="errorState">
          <h2>Item not found</h2>
          <button onClick={() => navigate(-1)} className="backButton">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const visibleSimilarItems = similarItems.slice(0, visibleItems);

  return (
    <div className="imageGallery">
      {/* Header */}
      <div className="galleryHeader">
        <div className="headerContent">
          <button onClick={() => navigate(-1)} className="backButton">
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="titleSection">
           
            <h2 className="galleryTitle">Similar {type === 'image' ? 'Images' : 'Videos'}</h2>
          </div>
          
          <div className="originalItemInfo">
            <span className="originalPrompt">"{originalItem.prompt}"</span>
            <span className="resultCount">
              {similarItems.length} similar items found 
              {similarItems.length > 0 && (
                <span className="scoreRange">
                  (Score: {Math.max(...similarItems.map(i => i.score))}↗ - {Math.min(...similarItems.map(i => i.score))}↘)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Similar Items Grid */}
      {similarItems.length === 0 ? (
        <div className="emptyState">
          <Search size={48} />
          <h3>No similar items found</h3>
          <p>Our advanced AI couldn't find matching content. Try exploring our gallery!</p>
          <button onClick={() => navigate('/')} className="exploreButton">
            Explore Gallery
          </button>
        </div>
      ) : (
        <div className="featureColumnGrid">
          {visibleSimilarItems.map((item, index) => (
            <div
              key={`${item.type}-${item.id}`}
              className={`gridItem item-${item.size} ${index >= 12 ? 'lazy-item' : ''}`}
              onClick={() => item.type === 'image' ? handleImageClick(item) : handleVideoClick(item)}
              style={{ animationDelay: `${(index - 12) * 0.05}s` }}
              title={`Similarity Score: ${item.score}`}
            >
              {item.type === 'image' ? (
                <ImageCard 
                  image={item}
                  onLike={handleLike}
                  onSearchSimilar={handleSearchSimilar}
                />
              ) : (
                <VideoCard 
                  video={item}
                  onLike={handleLike}
                  onSearchSimilar={handleSearchSimilar}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Blur Fade Overlay */}
      {visibleItems < similarItems.length && (
        <div className="blurFadeOverlay">
          <div className="blurGradient"></div>
        </div>
      )}

      {/* Loading Trigger */}
      {visibleItems < similarItems.length && (
        <div ref={observerRef} className="loadingTrigger">
          {loading && <div className="loadingSpinner">Loading more similar items...</div>}
        </div>
      )}

      {/* Modals */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseImageModal}
          onLike={handleLike}
          onComment={(imageId, comment) => console.log('Comment:', imageId, comment)}
        />
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseVideoModal}
          onLike={handleLike}
          onComment={(videoId, comment) => console.log('Comment:', videoId, comment)}
        />
      )}
    </div>
  );
}

export default SimilarPage;
