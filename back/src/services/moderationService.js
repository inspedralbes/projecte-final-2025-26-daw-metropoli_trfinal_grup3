import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model per text
const modeloTexto = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Model per imatges
const modeloImagen = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// ─── Lista local de palabras SIEMPRE bloqueadas (red de seguridad) ─────────────
// Gemini puede ser permisivo con palabras leves — esta lista garantiza el bloqueo
const PALABRAS_BLOQUEADAS = [
  // Español
  "mierda",
  "puta",
  "puto",
  "coño",
  "hostia",
  "joder",
  "gilipollas",
  "capullo",
  "cabron",
  "follar",
  "verga",
  "polla",
  "culo",
  "idiota",
  "imbecil",
  "estupido",
  "bastardo",
  "zorra",
  "pendejo",
  "chingar",
  "marica",
  "maricon",
  "hijoputa",
  "hijo de puta",
  // Catalán
  "merda",
  "cony",
  "collons",
  "putada",
  "gilipolles",
  "imbecil",
  "cabro",
  "foti",
  "punyeta",
  // Inglés
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "dick",
  "pussy",
  "motherfucker",
  "nigger",
  "faggot",
];

/**
 * Comprueba si el texto contiene alguna palabra de la lista de bloqueo.
 * Normaliza acentos para detectar variantes (ej: "mierda" y "miérda").
 */
const checkLocalBlocklist = (texto) => {
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const textoNorm = normalize(texto);

  for (const palabra of PALABRAS_BLOQUEADAS) {
    const palabraNorm = normalize(palabra);
    const escaped = palabraNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(?:^|[\\s,!?.;:])${escaped}(?:$|[\\s,!?.;:])`,
      "i",
    );
    if (regex.test(` ${textoNorm} `)) {
      return { bloqueado: true, razon: `Contiene lenguaje inapropiado.` };
    }
  }
  return { bloqueado: false, razon: "" };
};

// ─── Filtro de texto ───────────────────────────────────────────────────────────

export const filterText = async (texto) => {
  if (!texto || texto.trim() === "") return { bloqueado: false, razon: "" };

  // 1️⃣ Lista local — rápido y sin llamada a API
  const localCheck = checkLocalBlocklist(texto);
  if (localCheck.bloqueado) return localCheck;

  // 2️⃣ Gemini — análisis contextual para todo lo que no esté en la lista
  try {
    const prompt = `Eres un moderador ESTRICTO de contenido para una app familiar de fans de Fórmula 1.
Tu misión es garantizar que el contenido sea apto para todas las edades.

Debes bloquear el texto si contiene CUALQUIERA de esto:
- Palabras soeces o vulgares (aunque sean leves), en cualquier idioma
- Insultos o descalificaciones
- Referencias sexuales o sugestivas
- Violencia, amenazas o intimidación
- Discurso de odio o discriminación

Sé ESTRICTO: ante la duda, bloquea.

Responde ÚNICAMENTE con un JSON sin ningún texto adicional:
{"bloqueado": true/false, "razon": "motivo breve en español si bloqueado, cadena vacía si no"}

Texto a analizar: "${texto.replace(/"/g, "'")}"`;

    const result = await modeloTexto.generateContent(prompt);
    const respuesta = result.response.text().trim();

    const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { bloqueado: false, razon: "" };

    const parsed = JSON.parse(jsonMatch[0]);
    return { bloqueado: !!parsed.bloqueado, razon: parsed.razon || "" };
  } catch (error) {
    if (
      error.message?.includes("SAFETY") ||
      error.message?.includes("blocked")
    ) {
      return {
        bloqueado: true,
        razon: "Contenido detectado como inapropiado.",
      };
    }
    console.error("[Moderation] Error analitzant text:", error.message);
    return { bloqueado: false, razon: "" };
  }
};

// ─── Filtro de imágenes ────────────────────────────────────────────────────────

export const filterImageUrl = async (url) => {
  if (!url || url.trim() === "") return { bloqueado: false, razon: "" };

  try {
    // Intentar descargar la imagen y analizarla con Gemini Vision
    let parts;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const imageResponse = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      clearTimeout(timeout);

      if (imageResponse.ok) {
        const contentType =
          imageResponse.headers.get("content-type") || "image/jpeg";
        if (contentType.startsWith("image/")) {
          const buffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          parts = [
            { inlineData: { mimeType: contentType, data: base64 } },
            'Eres un moderador de imágenes ESTRICTO para una app familiar de fans de F1. Analiza esta imagen y determina si contiene: desnudez, contenido sexual o erótico (aunque sea parcial), violencia extrema, o cualquier contenido inapropiado para menores o para un entorno profesional. Sé ESTRICTO: si hay duda, bloquea. Responde ÚNICAMENTE con JSON: {"bloqueado": true/false, "razon": "motivo breve si bloqueado, vacío si no"}',
          ];
          console.log("[Moderation] Analizando imagen descargada...");
        }
      }
    } catch (fetchError) {
      console.warn(
        "[Moderation] No se pudo descargar la imagen, usando análisis por URL:",
        fetchError.message,
      );
    }

    // Si no pudimos descargar la imagen, analizamos la URL textualmente
    if (!parts) {
      parts = [
        `Eres un moderador ESTRICTO para una app familiar de fans de Fórmula 1.
El usuario ha subido esta URL de imagen: "${url}"

Analiza ÚNICAMENTE la URL/dominio para determinar si el origen parece ser un sitio de contenido adulto, pornografía, imágenes explícitas o inapropiadas para menores.
También indica si el nombre del dominio o la ruta contienen palabras clave explícitas.

Responde ÚNICAMENTE con JSON: {"bloqueado": true/false, "razon": "motivo breve si bloqueado, vacío si no"}`,
      ];
      console.log("[Moderation] Analizando URL textualmente:", url);
    }

    const result = await modeloImagen.generateContent(parts);

    // Verificar si Gemini bloqueó la respuesta por sus propios safety settings
    const candidate = result.response.candidates?.[0];
    if (!candidate || candidate.finishReason === "SAFETY") {
      console.log("[Moderation] Gemini bloqueó la imagen por SAFETY filters");
      return { bloqueado: true, razon: "Imagen detectada como inapropiada." };
    }

    const respuesta = result.response.text().trim();
    console.log("[Moderation] Respuesta Gemini imagen:", respuesta);

    const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { bloqueado: false, razon: "" };

    const parsed = JSON.parse(jsonMatch[0]);
    return { bloqueado: !!parsed.bloqueado, razon: parsed.razon || "" };
  } catch (error) {
    if (
      error.message?.includes("SAFETY") ||
      error.message?.includes("blocked")
    ) {
      return { bloqueado: true, razon: "Imagen detectada como inapropiada." };
    }
    console.error("[Moderation] Error analitzant imatge:", error.message);
    return { bloqueado: false, razon: "" };
  }
};
