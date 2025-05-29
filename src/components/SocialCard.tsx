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

  // Add styles for 3D animations
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      // Only run in browser environment
      const style = document.createElement('style');
      style.setAttribute('data-social-card-styles', 'true');
      style.innerHTML = `
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .card-hover-3d {
          transition: transform 0.3s ease;
        }
        .card-hover-3d:hover {
          transform: translateY(-5px) scale(1.01);
        }
      `;
      document.head.appendChild(style);
    }
    
    // Clean up function to remove styles when component unmounts
    return () => {
      if (typeof document !== 'undefined') {
        const styleElement = document.querySelector('style[data-social-card-styles]');
        if (styleElement) {
          styleElement.remove();
        }
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('binarrbinar1@gmail.com');
      toast.success('Email copied to clipboard!', {
        style: {
          background: isDarkTheme ? '#000' : '#fff',
          color: isDarkTheme ? '#00FF41' : '#007733',
          border: `1px solid ${isDarkTheme ? '#00FF41' : '#007733'}`,
        },
        iconTheme: {
          primary: isDarkTheme ? '#00FF41' : '#007733',
          secondary: isDarkTheme ? '#000' : '#fff',
        },
      });
    } catch (err) {
      toast.error('Failed to copy email', {
        style: {
          background: isDarkTheme ? '#000' : '#fff',
          color: '#FF4141',
          border: '1px solid #FF4141',
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
          background: isDarkTheme ? '#000' : '#fff',
          color: isDarkTheme ? '#00FF41' : '#007733',
          border: `1px solid ${isDarkTheme ? '#00FF41' : '#007733'}`,
        },
        iconTheme: {
          primary: isDarkTheme ? '#00FF41' : '#007733',
          secondary: isDarkTheme ? '#000' : '#fff',
        },
      });

      form.reset();
      setShowContactForm(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        style: {
          background: isDarkTheme ? '#000' : '#fff',
          color: '#FF4141',
          border: '1px solid #FF4141',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.2,
      rotate: 360,
      transition: { duration: 0.5 }
    }
  };
  
  // Tab animations
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={`relative w-full max-w-md mx-auto px-4 sm:px-8 py-6 sm:py-10 rounded-xl backdrop-blur-lg border border-green-500/30 card-hover-3d ${
        isDarkTheme 
          ? 'bg-black/40 shadow-[0_0_15px_rgba(0,255,65,0.3)]' 
          : 'bg-white/40 shadow-[0_0_15px_rgba(0,119,51,0.15)]'
      }`}
    >
      <Toaster position="top-center" />
      
      {/* Gradient overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-full rounded-xl -z-10 overflow-hidden"
        style={{
          background: isDarkTheme 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,30,0,0.8) 100%)' 
            : 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,255,240,0.8) 100%)',
          boxShadow: isDarkTheme
            ? 'inset 0 0 30px rgba(0,255,65,0.1)'
            : 'inset 0 0 30px rgba(0,119,51,0.05)'
        }}
      />
      
      {/* Animated border */}
      <div 
        className="absolute top-0 left-0 w-full h-full rounded-xl -z-5 overflow-hidden"
        style={{
          background: `linear-gradient(90deg, 
            ${isDarkTheme ? 'rgba(0,255,65,0)' : 'rgba(0,119,51,0)'} 0%, 
            ${isDarkTheme ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,51,0.1)'} 25%, 
            ${isDarkTheme ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,51,0.1)'} 75%, 
            ${isDarkTheme ? 'rgba(0,255,65,0)' : 'rgba(0,119,51,0)'} 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s infinite linear'
        }}
      />
      
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`relative ${isMobile ? 'w-20 h-20' : 'w-28 h-28'} mx-auto mb-4 sm:mb-6 rounded-full border-2 border-green-500 overflow-hidden bg-black flex items-center justify-center group perspective`}
        >
          <motion.div
            variants={{
              initial: { 
                scale: 1, 
                opacity: 1,
                rotateY: 0,
                z: 0
              },
              hover: { 
                scale: 0.8, 
                opacity: 0,
                rotateY: 90,
                z: -50,
                transition: { 
                  duration: 0.4,
                  ease: "easeInOut"
                }
              }
            }}
            initial="initial"
            whileHover="hover"
            className="absolute inset-0 flex items-center justify-center backface-hidden"
          >
            <Terminal className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-green-500`} />
          </motion.div>
          <motion.div
            variants={{
              initial: { 
                scale: 0.8, 
                opacity: 0,
                rotateY: -90,
                z: -50
              },
              hover: { 
                scale: 1, 
                opacity: 1,
                rotateY: 0,
                z: 0,
                transition: { 
                  duration: 0.4,
                  delay: 0.2,
                  ease: "easeInOut"
                }
              }
            }}
            initial="initial"
            whileHover="hover"
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ transform: 'none' }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-green-500`}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </motion.div>
        </motion.div>
        
        <h2 className={`text-xl sm:text-2xl font-mono font-bold ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}>
          <TypewriterText text="Binar Security" delay={50} />
        </h2>
        <p className={`text-sm sm:text-base ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mt-1 font-mono`}>
          Security Researcher & Developer
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 border-b border-green-500/20">
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 text-sm font-mono transition-all duration-300 relative ${
            activeTab === 'links'
              ? isDarkTheme 
                ? 'text-green-400 font-bold' 
                : 'text-green-700 font-bold'
              : isDarkTheme
                ? 'text-gray-400 hover:text-green-400'
                : 'text-gray-600 hover:text-green-700'
          }`}
        >
          Links
          {activeTab === 'links' && (
            <motion.div
              layoutId="activeTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkTheme ? 'bg-green-400' : 'bg-green-700'}`}
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 text-sm font-mono transition-all duration-300 relative ${
            activeTab === 'contact'
              ? isDarkTheme 
                ? 'text-green-400 font-bold' 
                : 'text-green-700 font-bold'
              : isDarkTheme
                ? 'text-gray-400 hover:text-green-400'
                : 'text-gray-600 hover:text-green-700'
          }`}
        >
          Contact
          {activeTab === 'contact' && (
            <motion.div
              layoutId="activeTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkTheme ? 'bg-green-400' : 'bg-green-700'}`}
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-sm font-mono transition-all duration-300 relative ${
            activeTab === 'about'
              ? isDarkTheme 
                ? 'text-green-400 font-bold' 
                : 'text-green-700 font-bold'
              : isDarkTheme
                ? 'text-gray-400 hover:text-green-400'
                : 'text-gray-600 hover:text-green-700'
          }`}
        >
          About
          {activeTab === 'about' && (
            <motion.div
              layoutId="activeTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkTheme ? 'bg-green-400' : 'bg-green-700'}`}
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
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
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.a
                href="https://github.com/binar-dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-black/50 hover:bg-black/70 text-white border border-green-500/30 hover:border-green-500/60' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-800 border border-green-700/20 hover:border-green-700/40'
                } hover:shadow-lg hover:-translate-y-1`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="mr-2 text-green-500"
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <FaGithub size={isMobile ? 18 : 22} />
                </motion.div>
                <span className="font-mono text-sm">GitHub</span>
              </motion.a>
              
              <motion.a
                href="https://www.youtube.com/c/BinarSecurity"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-black/50 hover:bg-black/70 text-white border border-green-500/30 hover:border-green-500/60' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-800 border border-green-700/20 hover:border-green-700/40'
                } hover:shadow-lg hover:-translate-y-1`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="mr-2 text-red-500"
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <FaYoutube size={isMobile ? 18 : 22} />
                </motion.div>
                <span className="font-mono text-sm">YouTube</span>
              </motion.a>
              
              <motion.a
                href="https://t.me/binarsec"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-black/50 hover:bg-black/70 text-white border border-green-500/30 hover:border-green-500/60' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-800 border border-green-700/20 hover:border-green-700/40'
                } hover:shadow-lg hover:-translate-y-1`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="mr-2 text-blue-500"
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <FaTelegram size={isMobile ? 18 : 22} />
                </motion.div>
                <span className="font-mono text-sm">Telegram</span>
              </motion.a>
              
              <motion.a
                href="https://www.tiktok.com/@binarsecurity"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-black/50 hover:bg-black/70 text-white border border-green-500/30 hover:border-green-500/60' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-800 border border-green-700/20 hover:border-green-700/40'
                } hover:shadow-lg hover:-translate-y-1`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="mr-2 text-pink-500"
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <FaTiktok size={isMobile ? 18 : 22} />
                </motion.div>
                <span className="font-mono text-sm">TikTok</span>
              </motion.a>
              
              <motion.button
                onClick={handleCopyEmail}
                className={`col-span-2 flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-green-900/20 hover:bg-green-900/30 text-white border border-green-500/30 hover:border-green-500/60' 
                    : 'bg-green-100/50 hover:bg-green-100/70 text-gray-800 border border-green-700/20 hover:border-green-700/40'
                } hover:shadow-lg hover:-translate-y-1 mt-2`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={`mr-2 ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Mail size={isMobile ? 16 : 20} />
                </motion.div>
                <span className="font-mono text-sm">binarrbinar1@gmail.com</span>
              </motion.button>
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
                <label 
                  htmlFor="name" 
                  className={`block mb-1 text-sm font-mono ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`w-full p-2 rounded-md font-mono text-sm ${
                    isDarkTheme 
                      ? 'bg-black/50 text-white border border-green-500/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500' 
                      : 'bg-white/70 text-gray-800 border border-green-700/20 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700'
                  }`}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className={`block mb-1 text-sm font-mono ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`w-full p-2 rounded-md font-mono text-sm ${
                    isDarkTheme 
                      ? 'bg-black/50 text-white border border-green-500/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500' 
                      : 'bg-white/70 text-gray-800 border border-green-700/20 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700'
                  }`}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="message" 
                  className={`block mb-1 text-sm font-mono ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className={`w-full p-2 rounded-md font-mono text-sm ${
                    isDarkTheme 
                      ? 'bg-black/50 text-white border border-green-500/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500' 
                      : 'bg-white/70 text-gray-800 border border-green-700/20 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700'
                  }`}
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md font-mono text-sm transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-green-500 hover:bg-green-600 text-black' 
                    : 'bg-green-700 hover:bg-green-800 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <Send size={16} className="mr-2" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        )}
        
        {activeTab === 'about' && (
          <motion.div
            key="about"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`font-mono text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} space-y-3`}
          >
            <p>
              Security researcher and developer focused on cybersecurity, penetration testing, and secure application development.
            </p>
            <p>
              Specialized in vulnerability assessment, exploit development, and security awareness training.
            </p>
            <div className={`mt-4 p-3 rounded-md ${isDarkTheme ? 'bg-green-900/20' : 'bg-green-100/50'} border ${isDarkTheme ? 'border-green-500/30' : 'border-green-700/20'}`}>
              <h3 className={`text-base font-bold mb-2 ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Penetration Testing', 'Secure Coding', 'Network Security', 'OSINT', 'Vulnerability Analysis'].map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 rounded-md text-xs ${
                      isDarkTheme 
                        ? 'bg-black/50 text-green-400 border border-green-500/30' 
                        : 'bg-white/70 text-green-700 border border-green-700/20'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(SocialCard);