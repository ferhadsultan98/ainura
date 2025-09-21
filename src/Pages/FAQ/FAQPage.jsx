import React, { useState } from 'react';
import { 
  ChevronDown, 
  Search,
  Sparkles,
  Shield,
  Zap,
  Users,
  Heart,
  HelpCircle,
  Star,
  Clock,
  Image,
  Download,
  Share2,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import './FAQPage.scss';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'account', label: 'Account', icon: Users },
    { id: 'creation', label: 'AI Creation', icon: Sparkles },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'technical', label: 'Technical', icon: Zap },
    { id: 'billing', label: 'Billing', icon: Star },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const faqData = {
    general: [
      {
        question: "What is AiNura?",
        answer: "AiNura is an advanced AI-powered art generation platform that transforms your ideas into stunning visual artwork. Using cutting-edge artificial intelligence, we help artists, designers, and creative enthusiasts bring their imagination to life through text prompts and reference images."
      },
      {
        question: "How does AiNura work?",
        answer: "AiNura uses state-of-the-art AI models to generate artwork based on your text descriptions (prompts) and optional reference images. Simply describe what you want to create, upload a reference image if desired, and our AI will generate unique artwork tailored to your specifications."
      },
      {
        question: "Is AiNura free to use?",
        answer: "AiNura offers both free and premium plans. Free users get limited generations per month, while premium subscribers enjoy unlimited creations, higher resolution outputs, priority processing, and access to advanced features."
      },
      {
        question: "What makes AiNura different from other AI art platforms?",
        answer: "AiNura stands out with its intuitive interface, high-quality outputs, diverse art styles, community features, and advanced customization options. We focus on both artistic quality and user experience, making AI art creation accessible to everyone."
      },
      {
        question: "Do I need artistic experience to use AiNura?",
        answer: "Not at all! AiNura is designed for users of all skill levels. Whether you're a professional artist or complete beginner, our intuitive interface and helpful prompts make it easy to create beautiful artwork."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button, enter your username, email, and password. You'll receive a verification code via email to confirm your account. Once verified, you can start creating immediately!"
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you reset instructions. Follow the link in the email to create a new password."
      },
      {
        question: "Can I change my username?",
        answer: "Currently, usernames cannot be changed after account creation. If you need to change your username, please contact our support team for assistance."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, go to Settings > Account > Delete Account. This action is permanent and will remove all your creations, favorites, and account data."
      },
      {
        question: "Can I have multiple accounts?",
        answer: "Each person should have only one AiNura account. Multiple accounts per user are against our terms of service and may result in account suspension."
      }
    ],
    creation: [
      {
        question: "What is a prompt and how do I write a good one?",
        answer: "A prompt is a text description of what you want to create. Good prompts are descriptive, specific, and include style references. Example: 'A majestic dragon flying over a medieval castle at sunset, fantasy art style, detailed, vibrant colors.'"
      },
      {
        question: "Can I upload reference images?",
        answer: "Yes! You can upload reference images to guide the AI generation. Supported formats include PNG, JPG, and WEBP up to 10MB. The AI will use your reference to influence the style, composition, or subject matter."
      },
      {
        question: "What art styles are available?",
        answer: "AiNura supports numerous styles including realistic, artistic, anime, cartoon, abstract, oil painting, watercolor, digital art, photography, and many more. You can specify styles in your prompt or use our style presets."
      },
      {
        question: "How long does it take to generate an image?",
        answer: "Generation times vary based on complexity and server load, typically 30 seconds to 2 minutes. Premium users get priority processing for faster results."
      },
      {
        question: "Can I edit or modify generated images?",
        answer: "Currently, AiNura generates final images. However, you can create variations by adjusting your prompt and regenerating. Advanced editing tools are planned for future updates."
      },
      {
        question: "What image sizes can I generate?",
        answer: "Available sizes include 512x512, 1024x1024, 1024x1792 (portrait), and 1792x1024 (landscape). Premium users have access to larger sizes and custom dimensions."
      },
      {
        question: "Why didn't my generation work as expected?",
        answer: "AI generation can be unpredictable. Try refining your prompt with more specific details, different style keywords, or adjusting your reference image. Experimentation often leads to better results."
      }
    ],
    gallery: [
      {
        question: "How do I save my creations?",
        answer: "All your generations are automatically saved to your personal gallery. You can access them anytime through your profile or the Gallery section."
      },
      {
        question: "Can I download my images?",
        answer: "Yes! Click the download button on any of your creations to save them to your device. Premium users can download in higher resolutions."
      },
      {
        question: "How do I share my artwork?",
        answer: "Use the share button to get a direct link to your artwork, or share directly to social media platforms. You can also make your creations public for others to discover."
      },
      {
        question: "What is the Favorites feature?",
        answer: "You can favorite artwork from other users or your own creations for easy access later. Your favorites are private and only visible to you."
      },
      {
        question: "Can I organize my gallery?",
        answer: "Yes! You can organize your creations with custom tags, create collections, and sort by date, popularity, or custom categories."
      },
      {
        question: "How do I make my gallery public or private?",
        answer: "In your profile settings, you can choose to make your gallery public (visible to others) or private (only visible to you). You can also set individual pieces as public or private."
      }
    ],
    technical: [
      {
        question: "What browsers does AiNura support?",
        answer: "AiNura works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
      },
      {
        question: "Can I use AiNura on mobile devices?",
        answer: "Yes! AiNura is fully responsive and works great on smartphones and tablets. We also plan to release dedicated mobile apps in the future."
      },
      {
        question: "What file formats can I upload?",
        answer: "Supported upload formats include PNG, JPG, JPEG, and WEBP. Maximum file size is 10MB per image."
      },
      {
        question: "Why is my image generation slow?",
        answer: "Generation speed depends on server load, image complexity, and your plan type. Premium users get priority processing. Try generating during off-peak hours for faster results."
      },
      {
        question: "I'm experiencing technical issues. What should I do?",
        answer: "First, try refreshing the page or clearing your browser cache. If issues persist, check our status page or contact support with details about the problem."
      },
      {
        question: "Does AiNura work offline?",
        answer: "No, AiNura requires an internet connection as all AI processing happens on our servers. However, you can download your creations to view offline."
      }
    ],
    billing: [
      {
        question: "What subscription plans are available?",
        answer: "We offer Free, Pro ($9.99/month), and Studio ($19.99/month) plans. Each plan includes different generation limits, features, and priority levels. See our pricing page for full details."
      },
      {
        question: "How do I upgrade my plan?",
        answer: "Go to Settings > Subscription and choose your desired plan. We accept all major credit cards and PayPal. Upgrades are instant and you'll get immediate access to premium features."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time. You'll continue to have premium access until the end of your current billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for new subscribers. If you're not satisfied within 30 days of your first purchase, contact support for a full refund."
      },
      {
        question: "What happens if I exceed my generation limit?",
        answer: "Free users who reach their monthly limit can either wait for the next month or upgrade to a premium plan. Premium plans have much higher limits or unlimited generations."
      },
      {
        question: "Are there discounts for students or educators?",
        answer: "Yes! We offer special pricing for students and educators. Contact support with verification of your status to learn about available discounts."
      }
    ],
    privacy: [
      {
        question: "Is my artwork private?",
        answer: "By default, your creations are private and only visible to you. You can choose to make specific artworks public or share them with others via direct links."
      },
      {
        question: "What data do you collect?",
        answer: "We collect only necessary data for service operation: email, username, creations, and usage analytics. We never sell personal data to third parties. See our Privacy Policy for full details."
      },
      {
        question: "Can I delete my creations?",
        answer: "Yes, you can delete individual creations or your entire gallery at any time. Deleted creations are permanently removed from our servers."
      },
      {
        question: "Who owns the rights to my generated artwork?",
        answer: "You own the rights to artwork you generate with AiNura. You're free to use your creations for personal or commercial purposes without attribution required."
      },
      {
        question: "Is my prompt data stored?",
        answer: "Prompts are stored with your creations to help you recreate or modify results. You can delete individual creations and their associated prompts at any time."
      },
      {
        question: "How secure is my account?",
        answer: "We use industry-standard encryption and security measures to protect your account and data. We recommend using strong passwords and enabling two-factor authentication when available."
      }
    ]
  };

  const toggleItem = (itemIndex) => {
    setOpenItems(prev => ({
      ...prev,
      [itemIndex]: !prev[itemIndex]
    }));
  };

  const filteredFAQs = faqData[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="faqPage">
      <div className="faqContainer">
        {/* Header */}
        <div className="faqHeader">
          <div className="headerIcon">
          
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about AiNura. Can't find what you're looking for? Contact our support team!</p>
        </div>

        {/* Search */}
        <div className="searchSection">
          <div className="searchContainer">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="faqContent">
          {/* Categories */}
          <div className="categoriesSection">
            <h3>Categories</h3>
            <div className="categoriesList">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`categoryBtn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <IconComponent size={18} />
                    <span>{category.label}</span>
                    <span className="count">({faqData[category.id]?.length || 0})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="faqSection">
            <div className="sectionHeader">
              <h2>{categories.find(cat => cat.id === activeCategory)?.label} Questions</h2>
              <span className="resultCount">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
              </span>
            </div>

            <div className="faqList">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className={`faqItem ${openItems[`${activeCategory}_${index}`] ? 'open' : ''}`}
                  >
                    <button
                      className="faqQuestion"
                      onClick={() => toggleItem(`${activeCategory}_${index}`)}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown 
                        size={20} 
                        className={`chevron ${openItems[`${activeCategory}_${index}`] ? 'open' : ''}`}
                      />
                    </button>
                    <div className="faqAnswer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noResults">
                  <Search size={48} />
                  <h3>No results found</h3>
                  <p>Try adjusting your search terms or browse different categories.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contactSection">
          <div className="contactHeader">
            <h2>Still have questions?</h2>
            <p>Our support team is here to help you get the most out of AiNura</p>
          </div>
          
          <div className="contactMethods">
            <div className="contactCard">
              <Mail size={24} />
              <h4>Email Support</h4>
              <p>Get detailed help via email</p>
              <a href="mailto:support@ainura.com" className="contactBtn">
                support@ainura.com
              </a>
            </div>
            
            <div className="contactCard">
              <MessageCircle size={24} />
              <h4>Live Chat</h4>
              <p>Chat with our team in real-time</p>
              <button className="contactBtn">
                Start Chat
              </button>
            </div>
            
            <div className="contactCard">
              <Phone size={24} />
              <h4>Phone Support</h4>
              <p>Premium users only</p>
              <span className="contactInfo">
                +1 (555) 123-4567
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
