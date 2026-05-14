import React, { useState, useEffect } from "react";
import Mapis3D from "./components/Mapis3D";
import SpeechBubble from "./components/SpeechBubble";
import ChatWindow from "./components/ChatWindow";
import useMapisAI from "./hooks/useMapisAI";

const Mapis = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);
  const { messages, sendMessage, isLoading, clearChat } = useMapisAI();
 
  useEffect(() => {
    // Show initial bubble after a small delay if not dismissed
    const timer = setTimeout(() => {
      if (clickCount === 0 && !isBubbleDismissed) {
        setShowBubble(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [clickCount, isBubbleDismissed]);
 
  const handleAvatarClick = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      return;
    }
 
    if (clickCount === 0) {
      setShowBubble(true);
      setClickCount(1);
    } else {
      setShowBubble(false);
      setIsChatOpen(true);
      setClickCount(2);
    }
  };

  const handleDismissBubble = () => {
    setShowBubble(false);
    setIsBubbleDismissed(true);
  };

  return (
    <div className="fixed bottom-[65px] md:bottom-12 right-4 md:right-8 flex flex-col items-end z-[9999] font-display">
      <SpeechBubble 
        show={showBubble} 
        message={
          <span>
            ¡Hola! Soy Mapis. ¿Quieres crear una ruta increíble y compartirla con tus amigos? ¡Pregúntame cómo! <i className="fas fa-map-location-dot ml-1 text-primary"></i> <i className="fas fa-mobile-screen-button ml-1 text-primary"></i>
          </span>
        }
        onDismiss={handleDismissBubble}
      />
      
      <ChatWindow 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        sendMessage={sendMessage}
        isLoading={isLoading}
        clearChat={clearChat}
      />

      <Mapis3D 
        onClick={handleAvatarClick} 
        isChatOpen={isChatOpen}
      />
    </div>
  );
};

export default Mapis;
