// Importar librerías necesarias
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importar archivos de traducción directamente
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import ca from "./locales/ca/translation.json";
import fr from "./locales/fr/translation.json";

// Definir el objeto de recursos que contiene las traducciones para cada idioma
const resources = {
  en: {
    translation: en, // inglés
  },
  es: {
    translation: es, // español
  },
  ca: {
    translation: ca, // catalán
  },
  fr: {
    translation: fr, // francés
  },
};

i18n
  // Detecta el idioma del usuario (desde la configuración del navegador, cookies, localStorage, etc.)
  .use(LanguageDetector)
  // Pasa la instancia i18n a react-i18next para componentes de React
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources, // Los recursos de traducción definidos anteriormente
    fallbackLng: "en", // Idioma de respaldo si el idioma detectado no está disponible
    interpolation: {
      escapeValue: false, // React ya previene XSS, así que deshabilitamos el escape
    },
    detection: {
      // Orden de detección de idioma: parámetro de consulta URL, cookie, almacenamiento local, configuración del navegador
      order: ["queryString", "cookie", "localStorage", "navigator"],
      // Dónde almacenar en caché el idioma seleccionado por el usuario
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
