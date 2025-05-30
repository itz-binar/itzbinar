import React, { useState, useContext, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Terminal, Shield, Code, ExternalLink, MessageSquare, Send } from 'lucide-react';
import { FaGithub, FaYoutube, FaTiktok, FaTelegram, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import TypewriterText from './TypewriterText';
import { ThemeContext } from '../App';
import { fadeIn, slideUpFade, scaleOnHover, cardHover } from '../utils/animations';

interface SocialCardProps {
  isMobile?: boolean;
}

const SocialCard: React.FC<SocialCardProps> = ({ isMobile = false }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('links'); // 'links', 'contact', 'about'
  const { isDarkTheme } = useContext(ThemeContext);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('binarrbinar1@gmail.com');
      toast.success('Email copied to clipboard!', {
        style: {
          background: isDarkTheme ? '#121212' : '#fff',
          color: isDarkTheme ? '#3b82f6' : '#2563eb',
          border: `1px solid ${isDarkTheme ? '#3b82f6' : '#2563eb'}`,
        },
        iconTheme: {
          primary: isDarkTheme ? '#3b82f6' : '#2563eb',
          secondary: isDarkTheme ? '#121212' : '#fff',
        },
      });
    } catch (err) {
      toast.error('Failed to copy email', {
        style: {
          background: isDarkTheme ? '#121212' : '#fff',
          color: '#ef4444',
          border: '1px solid #ef4444',
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success('Message sent successfully!', {
        style: {
          background: isDarkTheme ? '#121212' : '#fff',
          color: isDarkTheme ? '#3b82f6' : '#2563eb',
          border: `1px solid ${isDarkTheme ? '#3b82f6' : '#2563eb'}`,
        },
        iconTheme: {
          primary: isDarkTheme ? '#3b82f6' : '#2563eb',
          secondary: isDarkTheme ? '#121212' : '#fff',
        },
      });

      form.reset();
      setShowContactForm(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        style: {
          background: isDarkTheme ? '#121212' : '#fff',
          color: '#ef4444',
          border: '1px solid #ef4444',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab animations
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={`relative w-full max-w-md mx-auto px-4 sm:px-8 py-6 sm:py-10 rounded-xl backdrop-blur-lg border card ${
        isDarkTheme 
          ? 'bg-gray-800/90 border-blue-500/30 shadow-lg'
          : 'bg-white/90 border-blue-500/20 shadow-md'
      }`}
    >
      <Toaster position="top-center" />
      
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`relative ${isMobile ? 'w-20 h-20' : 'w-24 h-24'} mx-auto mb-4 sm:mb-6 rounded-full border-2 overflow-hidden flex items-center justify-center ${
            isDarkTheme ? 'border-blue-500 bg-gray-900' : 'border-blue-500 bg-gray-100'
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <Terminal 
              className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} ${
                isDarkTheme ? 'text-blue-400' : 'text-blue-600'
              }`} 
            />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`text-xl sm:text-2xl font-semibold mb-1 ${
            isDarkTheme ? 'text-white' : 'text-gray-800'
          }`}
        >
          <TypewriterText text="Binar Security" delay={50} />
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`text-sm sm:text-base ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Security Researcher & Developer
        </motion.p>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-6 border-b border-gray-700/20 pb-2">
        <button 
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'links' 
              ? isDarkTheme 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-blue-600 border-b-2 border-blue-600'
              : isDarkTheme
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Links
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'about' 
              ? isDarkTheme 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-blue-600 border-b-2 border-blue-600'
              : isDarkTheme
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          About
        </button>
        <button 
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'contact' 
              ? isDarkTheme 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-blue-600 border-b-2 border-blue-600'
              : isDarkTheme
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Contact
        </button>
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'links' && (
          <motion.div
            key="links"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3"
          >
            <a 
              href="https://github.com/itzbinar" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center p-3 rounded-lg transition-all ${
                isDarkTheme 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <FaGithub className={`w-5 h-5 mr-3 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="flex-grow">GitHub</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
            
            <a 
              href="https://youtube.com/@itzbinar" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center p-3 rounded-lg transition-all ${
                isDarkTheme 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <FaYoutube className={`w-5 h-5 mr-3 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="flex-grow">YouTube</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
            
            <a 
              href="https://tiktok.com/@itzbinar" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center p-3 rounded-lg transition-all ${
                isDarkTheme 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <FaTiktok className={`w-5 h-5 mr-3 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="flex-grow">TikTok</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
            
            <a 
              href="https://t.me/itzbinar" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center p-3 rounded-lg transition-all ${
                isDarkTheme 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <FaTelegram className={`w-5 h-5 mr-3 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="flex-grow">Telegram</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
            
            <button 
              onClick={handleCopyEmail}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                isDarkTheme 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Mail className={`w-5 h-5 mr-3 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="flex-grow text-left">binarrbinar1@gmail.com</span>
              <FaPaperPlane className="w-4 h-4 opacity-70" />
            </button>
          </motion.div>
        )}
        
        {activeTab === 'about' && (
          <motion.div
            key="about"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`space-y-4 text-sm sm:text-base ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <p>
              Security researcher and developer focused on cybersecurity, penetration testing, and secure application development.
            </p>
            <p>
              Specialized in vulnerability assessment, security auditing, and building secure applications with modern frameworks.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`px-3 py-1 text-xs rounded-full ${
                isDarkTheme 
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                Penetration Testing
              </span>
              <span className={`px-3 py-1 text-xs rounded-full ${
                isDarkTheme 
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                Web Security
              </span>
              <span className={`px-3 py-1 text-xs rounded-full ${
                isDarkTheme 
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                Secure Development
              </span>
              <span className={`px-3 py-1 text-xs rounded-full ${
                isDarkTheme 
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                Vulnerability Research
              </span>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'contact' && (
          <motion.div
            key="contact"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className={`w-full p-3 rounded-lg outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500'
                      : 'bg-gray-100 border border-gray-300 text-gray-800 focus:border-blue-500'
                  }`}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className={`w-full p-3 rounded-lg outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500'
                      : 'bg-gray-100 border border-gray-300 text-gray-800 focus:border-blue-500'
                  }`}
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  required
                  className={`w-full p-3 rounded-lg outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500'
                      : 'bg-gray-100 border border-gray-300 text-gray-800 focus:border-blue-500'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all ${
                  isDarkTheme
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(SocialCard);