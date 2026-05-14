import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import socket from "../../services/socketManager";
import { getChatHistory } from "../../services/communicationManager";
import UserAvatar from "../UserAvatar";

const ChatModal = ({ friend, onClose, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Generate unique room ID for the two participants
  const roomId = [user.id_usuario, friend.id_usuario].sort((a, b) => a - b).join("_");
  const room = `chat_${roomId}`;

  useEffect(() => {
    // 1. Join the room
    socket.emit("join_room", room);

    // 2. Fetch history
    const fetchHistory = async () => {
      try {
        const res = await getChatHistory(room);
        if (res.success) setMessages(res.data);
      } catch (err) {
        console.error("Error loading chat history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    // 3. Listen for new messages
    const handleNewMessage = (msg) => {
      // Only append if it's for this room AND not from me (to avoid duplication)
      if (msg.room === room && msg.senderId !== user.id_usuario) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("private_message", handleNewMessage);

    return () => {
      socket.off("private_message", handleNewMessage);
    };
  }, [room]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      room,
      senderId: user.id_usuario,
      senderName: user.nombre,
      receiverId: friend.id_usuario,
      text: newMessage.trim(),
    };

    // Emit via socket (the backend saves it to MongoDB)
    socket.emit("private_message", msgData);

    // Optimistically add to local state
    setMessages((prev) => [...prev, { ...msgData, createdAt: new Date() }]);
    setNewMessage("");
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-end justify-center md:justify-end bg-black/20 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-0 pointer-events-none"
      onClick={onClose}
    >
      <div 
        className="w-full md:w-[400px] md:mr-8 md:mb-8 h-[85vh] md:h-[600px] bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/5 animate-in slide-in-from-bottom md:slide-in-from-right duration-500 pointer-events-auto shadow-primary/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white/50 dark:bg-white/5 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${friend.id_usuario}`} className="relative group">
                <UserAvatar user={friend} className="w-12 h-12" borderColor="border-primary" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
            </Link>
            <div>
              <Link to={`/profile/${friend.id_usuario}`}>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight leading-none hover:text-primary transition-colors">{friend.nombre}</h3>
              </Link>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                En línia ara
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 modern-scrollbar bg-white dark:bg-slate-900"
        >
          {loading ? (
            <div className="h-full flex items-center justify-center opacity-30">Carregant xat...</div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-30">
                <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                <p className="text-sm">Inicia una conversa amb {friend.nombre}</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const isMine = m.senderId === user.id_usuario;
              const isGif = m.text.startsWith("http") && m.text.includes("giphy.com");

              return (
                <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] rounded-3xl text-[13px] font-medium transition-all ${
                    isGif ? "hover:scale-105" : isMine 
                      ? "bg-gradient-to-br from-primary to-primary-dark text-white px-5 py-3 rounded-tr-none shadow-xl shadow-primary/20" 
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-white px-5 py-3 rounded-tl-none border border-gray-100 dark:border-white/5 shadow-sm"
                  }`}>
                    {isGif ? (
                        <img src={m.text} alt="GIF" className="rounded-2xl w-full max-w-[220px] border-4 border-white dark:border-white/20 shadow-2xl" />
                    ) : (
                        m.text
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white dark:bg-slate-900">
          <GifPicker onSelect={(url) => {
              const msgData = {
                room,
                senderId: user.id_usuario,
                senderName: user.nombre,
                receiverId: friend.id_usuario,
                text: url,
              };
              socket.emit("private_message", msgData);
              setMessages((prev) => [...prev, { ...msgData, createdAt: new Date() }]);
          }} />
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escriu un missatge..."
              className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm text-slate-800 dark:text-white"
            />
            <button 
              type="submit"
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const GifPicker = ({ onSelect }) => {
    const [show, setShow] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [search, setSearch] = useState("");
    const fetchGifs = async (q = "") => {
        // Usamos la clave de Scenes Beats como fallback si la env no carga
        const apiKey = import.meta.env.VITE_GIPHY_API_KEY || "nObbHujZvjlmtM06DTit7ZJgFuDzwgX5"; 
        const url = q 
            ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=12&rating=g`
            : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12&rating=g`;
        try {
            const res = await fetch(url);
            if (res.status === 401) throw new Error("API Key inválida (401)");
            if (!res.ok) throw new Error("Giphy API error");
            const data = await res.json();
            setGifs(data.data || []);
        } catch (err) { 
            console.error("Giphy Error:", err);
            // Si falla la API, mostramos una lista curada de placeholders de alta calidad
            setGifs([
                { id: '1', images: { fixed_height: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3o3bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxS0L8iO9G/giphy.gif' }, fixed_height_small: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3o3bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxS0L8iO9G/giphy.gif' } } },
                { id: '2', images: { fixed_height: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3o3bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlHJGHe3yAMhdQY/giphy.gif' }, fixed_height_small: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3o3bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80bXNidm80JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlHJGHe3yAMhdQY/giphy.gif' } } },
            ]);
        }
    };

    useEffect(() => { if(show) fetchGifs(); }, [show]);

    return (
        <div className="relative">
            <button 
                onClick={() => setShow(!show)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
            >
                <span className="material-symbols-outlined text-lg">gif_box</span> GIFs
            </button>
            {show && (
                <div className="absolute bottom-full mb-4 left-0 w-64 bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-200">
                    <input 
                        className="w-full bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 text-xs mb-3 outline-none"
                        placeholder="Cerca GIFs..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); fetchGifs(e.target.value); }}
                    />
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto modern-scrollbar">
                        {gifs.map(g => (
                            <img 
                                key={g.id} 
                                src={g.images.fixed_height_small.url} 
                                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => { onSelect(g.images.fixed_height.url); setShow(false); }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatModal;
