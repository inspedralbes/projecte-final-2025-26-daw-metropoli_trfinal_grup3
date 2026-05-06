import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SpeechBubble = ({ show, message, onDismiss }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20, x: 20 }}
          className="absolute bottom-full right-0 mb-6 w-72 p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-[2rem] rounded-br-none shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-2 border-primary/20 dark:border-primary/30 z-[9998] font-display group"
        >
          {/* Close button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute -top-2 -left-2 w-7 h-7 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-full shadow-lg flex items-center justify-center text-[10px] text-gray-400 hover:text-red-500 transition-all z-10"
          >
            <i className="fas fa-x"></i>
          </button>

          <div className="text-[#1a1a1a] dark:text-white text-sm font-medium leading-relaxed font-display">
            {message}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white/90 dark:bg-gray-900 transform rotate-45 border-r border-b border-white/20 dark:border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
