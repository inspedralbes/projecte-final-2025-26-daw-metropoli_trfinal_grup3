import React from "react";
import { motion } from "framer-motion";
import mapisImg from "../assets/mapis.png";

const MapisAvatar = ({ onClick, isChatOpen }) => {
  return (
    <motion.div
      className="relative cursor-pointer z-[9999]"
      animate={{
        y: isChatOpen ? [0, -10, 0] : [0, -20, 0],
        scale: isChatOpen ? 0.8 : 1,
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
      
      <img
        src={mapisImg}
        alt="Mapis"
        className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
};

export default MapisAvatar;
