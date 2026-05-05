import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Trash2, MapPin, Sparkles, Navigation } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatWindow = ({ isOpen, onClose, messages, sendMessage, isLoading, clearChat }) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  // Sugerencias rápidas para el estado vacío
  const quickActions = [
    "📍 ¿Cómo creo una ruta?",
    "🤳 ¿Cómo comparto con amigos?",
    "👗 Ruta de tiendas vintage",
    "🌟 ¿Qué puedo hacer aquí?",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-[105px] md:bottom-28 right-4 md:right-8 w-[92vw] md:w-[420px] h-[600px] max-h-[85vh] bg-white/70 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/10 flex flex-col overflow-hidden z-[9997]"
        >
          {/* --- HEADER --- */}
          <div className="relative px-6 py-4 flex justify-between items-center border-b border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                  <MapPin size={22} strokeWidth={2.5} />
                </div>
                {/* Indicador de estado "En línea" */}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
                  Mapis AI
                </h3>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles size={10} className="text-blue-500" />
                  Tu guía de wemap
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95"
                title="Limpiar chat"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* --- MESSAGES AREA --- */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full flex flex-col items-center justify-center mt-8 space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center shadow-inner">
                  <Navigation size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">¡Hola! Soy Mapis</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] mx-auto">
                    Estoy aquí para ayudarte a crear y compartir las mejores rutas con tus amigos.
                  </p>
                </div>
                
                {/* Chips de sugerencias */}
                <div className="flex flex-col gap-2 w-full max-w-[280px] mt-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={() => handleQuickAction(action)}
                      className="text-left text-sm font-medium px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-sm"
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-[4px]"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-[4px] border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-white" : "dark:text-gray-200"}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-3.5 rounded-2xl rounded-bl-[4px] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* --- INPUT AREA --- */}
          <div className="p-4 bg-white/60 dark:bg-black/40 backdrop-blur-md border-t border-gray-200/50 dark:border-white/10 relative">
            {/* Efecto de brillo condicional en el input */}
            <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'} pointer-events-none`} />
            
            <form onSubmit={handleSubmit} className="relative flex items-center max-w-full z-10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Pregunta sobre wemap..."
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all active:scale-90 flex items-center justify-center shadow-md shadow-blue-500/20"
              >
                <Send size={18} className={`${input.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5' : ''} transition-transform`} />
              </button>
            </form>
            
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                Impulsado por Mapis AI
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;