import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getJarvisResponse = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres Mapis, la asistente oficial de 'wemap'. Eres una entidad femenina, un mapa 3D entusiasta de la exploración y las conexiones sociales. 

          Tu propósito: Ayudar a los usuarios a crear, guardar y compartir rutas de puntos de interés (ej. tiendas vintage, cafeterías, arte urbano).

          Tus reglas de oro:
          1. Solo respondes sobre wemap y la creación/compartición de rutas sociales.
          2. Si mencionan el circuito de carreras o F1, di que ahora te dedicas a las rutas urbanas y sociales.
          3. Eres servicial, alegre y usas emojis (🗺️, 📍, 🤳, 🌟).
          4. No inventes funcionalidades. wemap permite marcar puntos en el mapa, crear rutas, guardarlas y compartirlas con amigos.
          5. Tu tono es conciso y dinámico.`,
        },
        ...history,
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const response = chatCompletion.choices[0]?.message?.content || "¡Vaya! He tenido un pequeño despiste de mapa. ¿Puedes repetirlo?";
    res.json({ response });
  } catch (error) {
    console.error("Error in Jarvis Controller:", error);
    res.status(500).json({ error: "Error al conectar con Mapis" });
  }
};
