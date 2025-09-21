import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  User,
  AlertCircle,
  CheckCircle,
  Loader,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Globe,
  HeadphonesIcon
} from 'lucide-react';
import './ContactPage.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media & Press' }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: 'Get help via email',
      content: 'support@ainura.com',
      link: 'mailto:support@ainura.com',
      availability: '24/7 Response within 24 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      subtitle: 'Chat with our team',
      content: 'Start Live Chat',
      link: '#',
      availability: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      subtitle: 'Call us directly',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      availability: 'Premium users only'
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: 'Headquarters',
      content: '123 AI Street, Tech Valley\nSan Francisco, CA 94105\nUnited States'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM PST\nWeekends: 10:00 AM - 4:00 PM PST\nHolidays: Limited Support'
    },
    {
      icon: Globe,
      title: 'Global Presence',
      content: 'Serving customers worldwide\nMultiple data centers\n24/7 uptime monitoring'
    }
  ];

  const socialLinks = [
    { icon: Twitter, url: 'https://twitter.com/ainura', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com/ainura', label: 'Instagram' },
    { icon: Linkedin, url: 'https://linkedin.com/company/ainura', label: 'LinkedIn' },
    { icon: Github, url: 'https://github.com/ainura', label: 'GitHub' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send the data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(''), 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contactPage">
      <div className="contactContainer">
        {/* Header */}
        <div className="contactHeader">
          <div className="headerIcon">
            <HeadphonesIcon size={48} />
          </div>
          <h1>Get in Touch</h1>
          <p>We're here to help! Reach out to us for support, questions, or just to say hello.</p>
        </div>

        {/* Contact Methods */}
        <div className="contactMethods">
          <h2>How can we help you?</h2>
          <div className="methodsGrid">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="methodCard">
                  <div className="methodIcon">
                    <IconComponent size={28} />
                  </div>
                  <div className="methodContent">
                    <h3>{method.title}</h3>
                    <p className="subtitle">{method.subtitle}</p>
                    <div className="methodLink">
                      {method.link.startsWith('http') || method.link.startsWith('mailto:') || method.link.startsWith('tel:') ? (
                        <a href={method.link} target="_blank" rel="noopener noreferrer">
                          {method.content}
                        </a>
                      ) : (
                        <button onClick={() => alert('Live chat feature coming soon!')}>
                          {method.content}
                        </button>
                      )}
                    </div>
                    <span className="availability">{method.availability}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="contactContent">
          {/* Contact Form */}
          <div className="formSection">
            <div className="formHeader">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form className="contactForm" onSubmit={handleSubmit}>
              {/* Name and Email Row */}
              <div className="formRow">
                <div className="inputGroup">
                  <label htmlFor="name">Full Name *</label>
                  <div className="inputContainer">
                    <User size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && (
                    <span className="errorText">
                      <AlertCircle size={14} />
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="inputGroup">
                  <label htmlFor="email">Email Address *</label>
                  <div className="inputContainer">
                    <Mail size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <span className="errorText">
                      <AlertCircle size={14} />
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Category and Subject Row */}
              <div className="formRow">
                <div className="inputGroup">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inputGroup">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={errors.subject ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <span className="errorText">
                      <AlertCircle size={14} />
                      {errors.subject}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="inputGroup">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Please describe your inquiry in detail..."
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? 'error' : ''}
                  disabled={isSubmitting}
                />
                <div className="messageFooter">
                  {errors.message && (
                    <span className="errorText">
                      <AlertCircle size={14} />
                      {errors.message}
                    </span>
                  )}
                  <span className="charCount">
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <div className="statusMessage success">
                  <CheckCircle size={18} />
                  <span>Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="statusMessage error">
                  <AlertCircle size={18} />
                  <span>Failed to send message. Please try again or contact us directly.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="submitBtn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Office Info */}
          <div className="infoSection">
            <div className="infoHeader">
              <h2>Our Office</h2>
              <p>Visit us or learn more about our global presence.</p>
            </div>

            <div className="officeInfo">
              {officeInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="infoCard">
                    <div className="infoIcon">
                      <IconComponent size={24} />
                    </div>
                    <div className="infoContent">
                      <h3>{info.title}</h3>
                      <p>{info.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="socialSection">
              <h3>Follow Us</h3>
              <p>Stay connected for updates and behind-the-scenes content</p>
              <div className="socialLinks">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="socialLink"
                      aria-label={social.label}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="quickLinks">
              <h3>Need Quick Answers?</h3>
              <p>Check out our FAQ section for instant answers to common questions.</p>
              <a href="/faq" className="faqLink">
                Browse FAQ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
