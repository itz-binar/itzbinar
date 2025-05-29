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

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={`relative w-full max-w-md mx-auto px-4 sm:px-8 py-6 sm:py-10 rounded-xl bg-black/40 backdrop-blur-md border border-green-500/30 card-glow ${isMobile ? 'mt-4' : 'mt-8'}`}
    >
      <Toaster position="top-center" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 to-transparent rounded-xl -z-10"></div>
      
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
              <path d="M8 11l3 3 5-5" />
            </svg>
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-green-500 mb-2 sm:mb-3 font-mono tracking-wider glitch-text`}
          whileHover={{ scale: 1.05 }}
        >
          BINAR
        </motion.h1>
        <TypewriterText
          text="Security researcher & digital explorer"
          className={`text-green-400 font-mono mb-3 sm:mb-4 ${isMobile ? 'text-sm' : ''}`}
          delay={isMobile ? 80 : 60}
        />
        <div className="flex justify-center gap-2 mb-4 sm:mb-6">
          <Code className="w-5 h-5 text-green-500" />
          <TypewriterText
            text="Exploring the digital frontier"
            className={`text-green-300/70 ${isMobile ? 'text-xs' : 'text-sm'} font-mono`}
            delay={isMobile ? 60 : 40}
          />
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <motion.a
          href="https://github.com/itz-binar"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-3 sm:px-5 py-3 sm:py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          variants={scaleOnHover}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-white group-hover:text-purple-500" />
            </motion.div>
            <span className="font-mono text-white text-sm sm:text-base">itz-binar</span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] sm:text-xs font-mono text-gray-400 group-hover:text-green-400 mr-2">@github</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-green-400" />
          </div>
        </motion.a>

        <motion.a
          href="https://www.youtube.com/@Binar_tech"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          variants={scaleOnHover}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <FaYoutube className="w-6 h-6 mr-4 text-white group-hover:text-red-500" />
            </motion.div>
            <span className="font-mono text-white">Binar_tech</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-mono text-gray-400 group-hover:text-green-400 mr-2">@youtube</span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
          </div>
        </motion.a>

        <motion.a
          href="https://www.tiktok.com/@itz._.binar"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          variants={scaleOnHover}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <FaTiktok className="w-6 h-6 mr-4 text-white group-hover:text-blue-400" />
            </motion.div>
            <span className="font-mono text-white">itz._.binar</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-mono text-gray-400 group-hover:text-green-400 mr-2">@tiktok</span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
          </div>
        </motion.a>
        
        <motion.a
          href="https://t.me/itz_binar"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          variants={scaleOnHover}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <FaTelegram className="w-6 h-6 mr-4 text-white group-hover:text-blue-400" />
            </motion.div>
            <span className="font-mono text-white">itz_binar</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-mono text-gray-400 group-hover:text-green-400 mr-2">@telegram</span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
          </div>
        </motion.a>
        
        {!showContactForm ? (
          <div className="space-y-4 mt-8">
        <motion.button
              onClick={() => setShowContactForm(true)}
              className="cyber-button flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg"
              variants={scaleOnHover}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-mono">Contact Me</span>
        </motion.button>

        <motion.button
              onClick={handleCopyEmail}
              className="cyber-button flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg"
              variants={scaleOnHover}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Mail className="w-5 h-5" />
              <span className="font-mono">Copy Email</span>
            </motion.button>
          </div>
        ) : (
        <AnimatePresence>
            <motion.form
              variants={slideUpFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-xs font-mono text-green-500 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="cyber-input w-full px-4 py-2 rounded-md focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono text-green-500 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="cyber-input w-full px-4 py-2 rounded-md focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono text-green-500 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="cyber-input w-full px-4 py-2 rounded-md focus:outline-none resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <div className="flex gap-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                  className="cyber-button flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg disabled:opacity-50"
                  variants={scaleOnHover}
                  initial="initial"
                  whileHover={isSubmitting ? {} : "hover"}
                  whileTap={isSubmitting ? {} : "tap"}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 rounded-full loading-indicator"></div>
                  ) : (
                    <FaPaperPlane className="w-5 h-5" />
                  )}
                  <span className="font-mono">Send</span>
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="cyber-button flex items-center justify-center gap-2 px-5 py-3 rounded-lg"
                  variants={scaleOnHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="font-mono">Cancel</span>
              </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>
          )}
      </div>
      
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-green-500 font-mono text-xs tracking-wider">
          <TypewriterText
            text="&lt; ACCESS GRANTED /&gt;"
            delay={100}
          />
        </p>
      </motion.div>
    </motion.div>
  );
};

export default memo(SocialCard);