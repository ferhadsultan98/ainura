import React, { useEffect } from 'react';
import { Aperture, Target, Zap, Heart, Users, Code, Linkedin, Twitter, Github } from 'lucide-react';
import './AboutPage.scss';

const teamMembers = [
  {
    name: "Farhad Sultanov",
    role: "Full-Stack Developer & Project Lead",
    avatar: "https://avatars.githubusercontent.com/u/95325884?v=4", // Buraya öz profil şəklinizi qoyun
    bio: "Passionate about creating beautiful and functional web experiences. Bridging the gap between powerful backend systems and intuitive user interfaces.",
    social: {
      linkedin: "https://linkedin.com/in/farhadsultanov",
      twitter: "https://twitter.com/farhadsultanov",
      github: "https://github.com/Farhad-Sultanov",
    }
  },
  // Komandaya başqa üzvlər əlavə etmək üçün bu bloku kopyalayın
  // {
  //   name: "Jane Doe",
  //   role: "UI/UX Designer",
  //   avatar: "URL_TO_AVATAR",
  //   bio: "Designing with a focus on user-centric solutions and aesthetic details.",
  //   social: { ... }
  // },
];

const AboutPage = () => {
  useEffect(() => {
    // Səhifənin yuxarısına scroll etmək üçün
    window.scrollTo(0, 0);

    // Animasiyalar üçün scroll listener
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // İlkin yoxlama

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <header className="about-hero">
        <div className="hero-content">
          <Aperture size={64} className="hero-icon" />
          <h1 className="hero-title">Creativity Meets Technology.</h1>
          <p className="hero-subtitle">
            We are a community-driven platform dedicated to showcasing the incredible potential of AI-generated art and video.
          </p>
        </div>
        <div className="hero-background-overlay"></div>
      </header>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section fade-in-section">
        <div className="mission-card">
          <Target size={48} className="card-icon" />
          <h2 className="card-title">Our Mission</h2>
          <p className="card-text">
            To empower creators by providing a space to share, discover, and be inspired by the fusion of human imagination and artificial intelligence. We believe in making AI art accessible to everyone.
          </p>
        </div>
        <div className="vision-card">
          <Zap size={48} className="card-icon" />
          <h2 className="card-title">Our Vision</h2>
          <p className="card-text">
            To become the leading global gallery for AI-generated media, fostering a vibrant community where technology and art evolve together, pushing the boundaries of what's possible.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="core-values-section fade-in-section">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <Heart size={32} />
            <h3>Passion for Creativity</h3>
            <p>We celebrate the spark of inspiration in every creation.</p>
          </div>
          <div className="value-item">
            <Users size={32} />
            <h3>Community First</h3>
            <p>Our platform is built for and by the community of creators.</p>
          </div>
          <div className="value-item">
            <Code size={32} />
            <h3>Technological Excellence</h3>
            <p>We are committed to building a robust and cutting-edge platform.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section fade-in-section">
        <h2 className="section-title">Meet the Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              <div className="member-avatar">
                <img src={member.avatar} alt={member.name} />
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
                <div className="member-socials">
                  {member.social.linkedin && <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>}
                  {member.social.twitter && <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>}
                  {member.social.github && <a href={member.social.github} target="_blank" rel="noopener noreferrer"><Github size={20} /></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack-section fade-in-section">
        <h2 className="section-title">Powered By</h2>
        <div className="tech-logos">
          <div className="tech-logo-item" title="React">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" />
            <span>React</span>
          </div>
          <div className="tech-logo-item" title="Django">
            <img src="https://static.djangoproject.com/img/logos/django-logo-positive.svg" alt="Django" />
            <span>Django</span>
          </div>
          <div className="tech-logo-item" title="Python">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" />
            <span>Python</span>
          </div>
          <div className="tech-logo-item" title="PostgreSQL">
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL" />
            <span>PostgreSQL</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

