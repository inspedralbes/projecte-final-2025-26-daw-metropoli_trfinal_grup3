import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SpeechBubble = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20, x: 20 }}
          className="absolute bottom-full right-0 mb-6 w-72 p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-[2rem] rounded-br-none shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white/40 dark:border-white/10 z-[9998]"
        >
          <div className="text-gray-800 text-sm font-medium leading-relaxed">
            {message}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white/90 transform rotate-45 border-r border-b border-white/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
