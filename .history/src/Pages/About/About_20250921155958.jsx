import React, { useState } from "react";
import { 
  Sparkles, 
  Users, 
  Target, 
  Heart, 
  Lightbulb, 
  Globe, 
  ArrowRight,
  Play
} from "lucide-react";
import "./About.scss";
import AiNuraLogo from '../../../public/assets/ainuracolorlogo.png';

function About() {
  const [activeSection, setActiveSection] = useState('mission');
  const [playVideo, setPlayVideo] = useState(false);

  const features = [
    {
      icon: Lightbulb,
      title: "Advanced AI Technology",
      description: "State-of-the-art machine learning models including DALL-E, Midjourney, and Stable Diffusion for exceptional creative output.",
      color: "#BB86FC"
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with thousands of artists, share your creations, get feedback, and collaborate on amazing projects.",
      color: "#6C63FF"
    },
    {
      icon: Globe,
      title: "Global Platform",
      description: "Access our platform from anywhere in the world with multilingual support and cultural sensitivity.",
      color: "#4CD964"
    },
    {
      icon: Heart,
      title: "User-Centric Design",
      description: "Intuitive interface designed with artists in mind, making AI art creation accessible to everyone.",
      color: "#FF6B6B"
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "AiNura was born from a vision to democratize AI art creation."
    },
    {
      year: "2022", 
      title: "Platform Launch",
      description: "Released our first AI art generation platform with 3 base models."
    },
    {
      year: "2023",
      title: "Community Growth",
      description: "Reached 1,000 active users and launched community features."
    },
    {
      year: "2024",
      title: "Advanced Models",
      description: "Integrated cutting-edge AI models and real-time generation."
    },
    {
      year: "2025",
      title: "Global Expansion", 
      description: "Serving 10K+ creators worldwide with 50+ AI models."
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible with AI technology.",
      icon: Lightbulb
    },
    {
      title: "Community Driven",
      description: "Our users are at the heart of every decision we make.",
      icon: Users
    },
    {
      title: "Ethical AI",
      description: "We believe in responsible AI development and usage.",
      icon: Heart
    },
    {
      title: "Creative Freedom",
      description: "Empowering artists to explore unlimited creative possibilities.",
      icon: Sparkles
    }
  ];

  return (
    <div className="aboutPage">
      {/* Hero Section */}
      <section className="heroSection">
        <div className="heroContent">
          <div className="heroText">
            <div className="logoContainer">
              <img src={AiNuraLogo} alt="AiNura Logo" className="heroLogo" />
              <h1 className="heroTitle">
                <span className="aiText">AI</span>
                <span className="nuraText">Nura</span>
              </h1>
            </div>
            
            <p className="heroSubtitle">
              Revolutionizing creativity through the power of artificial intelligence
            </p>
            
            <div className="heroDescription">
              <p>
                AiNura is more than just an AI art platform – we're a creative ecosystem 
                where technology meets imagination. Our cutting-edge AI models empower 
                artists, designers, and creators to bring their wildest visions to life.
              </p>
            </div>
            
            <div className="heroActions">
              <button className="primaryBtn">
                <Sparkles size={16} />
                Start Creating
              </button>
              
              <button 
                className="secondaryBtn"
                onClick={() => setPlayVideo(!playVideo)}
              >
                <Play size={16} />
                Watch Story
              </button>
            </div>
          </div>
          
          <div className="heroVisual">
            <div className="imageGallery">
              <div className="galleryGrid">
                <div className="galleryItem">
                  <img src="https://picsum.photos/300/200?random=1" alt="AI Art" />
                </div>
                <div className="galleryItem">
                  <img src="https://picsum.photos/300/200?random=2" alt="AI Art" />
                </div>
                <div className="galleryItem">
                  <img src="https://picsum.photos/300/200?random=3" alt="AI Art" />
                </div>
                <div className="galleryItem">
                  <img src="https://picsum.photos/300/200?random=4" alt="AI Art" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="missionSection">
        <div className="sectionContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Our Purpose</h2>
            <p className="sectionSubtitle">
              Driving the future of creative technology
            </p>
          </div>
          
          <div className="missionTabs">
            <button 
              className={`tab ${activeSection === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveSection('mission')}
            >
              <Target size={18} />
              Mission
            </button>
            <button 
              className={`tab ${activeSection === 'vision' ? 'active' : ''}`}
              onClick={() => setActiveSection('vision')}
            >
              <Lightbulb size={18} />
              Vision
            </button>
            <button 
              className={`tab ${activeSection === 'values' ? 'active' : ''}`}
              onClick={() => setActiveSection('values')}
            >
              <Heart size={18} />
              Values
            </button>
          </div>
          
          <div className="missionContent">
            {activeSection === 'mission' && (
              <div className="contentPanel">
                <h3>Our Mission</h3>
                <p>
                  To democratize AI-powered creativity by providing accessible, 
                  powerful tools that enable anyone to create stunning visual art. 
                  We believe that creativity should have no boundaries.
                </p>
                <div className="highlights">
                  <div className="highlight">
                    <Sparkles size={14} />
                    <span>Make AI art accessible to everyone</span>
                  </div>
                  <div className="highlight">
                    <Users size={14} />
                    <span>Build a thriving creative community</span>
                  </div>
                  <div className="highlight">
                    <Globe size={14} />
                    <span>Enable global artistic collaboration</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'vision' && (
              <div className="contentPanel">
                <h3>Our Vision</h3>
                <p>
                  To become the world's leading platform where AI and human creativity 
                  converge, fostering a new era of artistic expression that transcends 
                  traditional boundaries.
                </p>
                <div className="highlights">
                  <div className="highlight">
                    <Lightbulb size={14} />
                    <span>Pioneer next-generation AI models</span>
                  </div>
                  <div className="highlight">
                    <Target size={14} />
                    <span>Shape the future of digital art</span>
                  </div>
                  <div className="highlight">
                    <Globe size={14} />
                    <span>Set industry standards for AI creativity</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'values' && (
              <div className="contentPanel">
                <div className="valuesGrid">
                  {values.map((value, index) => {
                    const IconComponent = value.icon;
                    return (
                      <div key={index} className="valueItem">
                        <div className="valueIcon">
                          <IconComponent size={20} />
                        </div>
                        <h4 className="valueTitle">{value.title}</h4>
                        <p className="valueDescription">{value.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="featuresSection">
        <div className="sectionContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Why Choose AiNura?</h2>
            <p className="sectionSubtitle">
              Cutting-edge technology meets intuitive design
            </p>
          </div>
          
          <div className="featuresGrid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="featureCard">
                  <div 
                    className="featureIcon"
                    style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  >
                    <IconComponent size={28} />
                  </div>
                  <h3 className="featureTitle">{feature.title}</h3>
                  <p className="featureDescription">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timelineSection">
        <div className="sectionContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Our Journey</h2>
            <p className="sectionSubtitle">
              From vision to reality - the AiNura story
            </p>
          </div>
          
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timelineItem">
                <div className="timelineYear">{milestone.year}</div>
                <div className="timelineContent">
                  <h4 className="timelineTitle">{milestone.title}</h4>
                  <p className="timelineDescription">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
