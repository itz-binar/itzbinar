import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Terminal, Shield, Code, MessageSquare, Send, User } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import TypewriterText from './TypewriterText';

// SVG icons for social media platforms
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-4 text-white group-hover:text-purple-500">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-4 text-white group-hover:text-red-500">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-4 text-white group-hover:text-pink-500">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.819l-.002-.001a2.895 2.895 0 0 1 2.735-4.028l.001-.001a2.793 2.793 0 0 1 .398.034V9.999a6.459 6.459 0 0 0-.398-.018A6.45 6.45 0 0 0 3.462 16.4c0 3.572 2.878 6.454 6.456 6.454 3.575 0 6.456-2.882 6.456-6.454V9.075a8.187 8.187 0 0 0 4.77 1.526V7.16a4.864 4.864 0 0 1-1.055-.474z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-4 text-white group-hover:text-blue-500">
    <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .045 4.222l3.3 1.65 1.155 3.465a2.246 2.246 0 0 0 4.02.995l2.325-2.325 3.6 2.4c.75.498 1.742.32 2.25-.38.13-.18.232-.4.298-.645l3-16.5a2.25 2.25 0 0 0-2.47-2.595zM12 17.745l-4.53-3.015L14.25 9.75 10.5 13.5 12 17.745z"/>
  </svg>
);

const SocialCard: React.FC = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('binarrbinar1@gmail.com');
      toast.success('Email copied to clipboard!', {
        style: {
          background: '#000',
          color: '#00FF41',
          border: '1px solid #00FF41',
        },
        iconTheme: {
          primary: '#00FF41',
          secondary: '#000',
        },
      });
    } catch (err) {
      toast.error('Failed to copy email', {
        style: {
          background: '#000',
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
          background: '#000',
          color: '#00FF41',
          border: '1px solid #00FF41',
        },
        iconTheme: {
          primary: '#00FF41',
          secondary: '#000',
        },
      });

      form.reset();
      setShowContactForm(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        style: {
          background: '#000',
          color: '#FF4141',
          border: '1px solid #FF4141',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative max-w-md w-full mx-auto mb-8 px-8 py-10 rounded-xl bg-black/40 backdrop-blur-md border border-green-500/30 card-glow"
    >
      <Toaster position="top-center" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 to-transparent rounded-xl -z-10"></div>
      
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-28 h-28 mx-auto mb-6 rounded-full border-2 border-green-500 overflow-hidden bg-black flex items-center justify-center group"
        >
          <motion.div
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className="absolute inset-0 flex items-center justify-center"
          >
            <Terminal className="w-12 h-12 text-green-500" />
          </motion.div>
          <motion.div
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <Shield className="w-12 h-12 text-green-500" />
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-white mb-3 font-mono tracking-wider glitch-text"
          whileHover={{ scale: 1.05 }}
        >
          BINAR
        </motion.h1>
        <TypewriterText
          text="Security researcher & digital explorer"
          className="text-green-400 font-mono mb-4"
          delay={60}
        />
        <div className="flex justify-center gap-2 mb-6">
          <Code className="w-5 h-5 text-green-500" />
          <TypewriterText
            text="Exploring the digital frontier"
            className="text-green-300/70 text-sm font-mono"
            delay={40}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <motion.a
          href="https://github.com/itz-binar"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <GithubIcon />
            </motion.div>
            <span className="font-mono text-white">itz-binar</span>
          </div>
          <span className="text-xs font-mono text-gray-400 group-hover:text-green-400">@github</span>
        </motion.a>

        <motion.a
          href="https://www.youtube.com/@Binar_tech"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <YoutubeIcon />
            </motion.div>
            <span className="font-mono text-white">Binar_tech</span>
          </div>
          <span className="text-xs font-mono text-gray-400 group-hover:text-green-400">@youtube</span>
        </motion.a>

        <motion.a
          href="https://www.tiktok.com/@itz._.binar"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <TikTokIcon />
            </motion.div>
            <span className="font-mono text-white">itz._.binar</span>
          </div>
          <span className="text-xs font-mono text-gray-400 group-hover:text-green-400">@tiktok</span>
        </motion.a>
        
        <motion.a
          href="https://t.me/itz_binar01"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <TelegramIcon />
            </motion.div>
            <span className="font-mono text-white">itz_binar01</span>
          </div>
          <span className="text-xs font-mono text-gray-400 group-hover:text-green-400">@telegram</span>
        </motion.a>
        
        <motion.button
          onClick={handleCopyEmail}
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <Mail className="w-6 h-6 mr-4 text-white group-hover:text-green-500" />
            </motion.div>
            <span className="font-mono text-white">binarrbinar1@gmail.com</span>
          </div>
          <span className="text-xs font-mono text-gray-400 group-hover:text-green-400">copy</span>
        </motion.button>

        <motion.button
          onClick={() => setShowContactForm(!showContactForm)}
          className="social-link group flex items-center justify-between w-full px-5 py-4 rounded-lg bg-black/70 border border-gray-800 hover:border-green-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
            >
              <MessageSquare className="w-6 h-6 mr-4 text-white group-hover:text-purple-500" />
            </motion.div>
            <span className="font-mono text-white">Contact me</span>
          </div>
          <span className="text-xs font-mono text-gray-400 group-hover:text-green-400">{showContactForm ? 'hide' : 'show'}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showContactForm && (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-green-500/70 w-5 h-5" />
                <input 
                  type="text" 
                  name="from_name" 
                  placeholder="Your name" 
                  required
                  className="w-full px-12 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white font-mono placeholder:text-green-500/50 focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-green-500/70 w-5 h-5" />
                <input 
                  type="email" 
                  name="reply_to" 
                  placeholder="Your email" 
                  required
                  className="w-full px-12 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white font-mono placeholder:text-green-500/50 focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-green-500/70 w-5 h-5" />
                <textarea 
                  name="message" 
                  placeholder="Your message" 
                  required
                  rows={4}
                  className="w-full px-12 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white font-mono placeholder:text-green-500/50 focus:outline-none focus:border-green-500"
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-full py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-500 font-mono border border-green-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 5, scale: 1.1 }
};

export default SocialCard;