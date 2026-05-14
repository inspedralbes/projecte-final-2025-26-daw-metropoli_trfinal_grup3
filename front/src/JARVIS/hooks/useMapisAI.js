import { useState } from "react";

const useMapisAI = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/api/jarvis/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6), // Send last 6 messages for context
        }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const botMessage = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Mapis Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "¡Uy! Parece que mi conexión de mapa se ha cortado un poco. ¿Podrías repetirlo? 🗺️🔌" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return { messages, sendMessage, isLoading, clearChat };
};

export default useMapisAI;
