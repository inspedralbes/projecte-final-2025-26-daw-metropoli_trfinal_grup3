import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 text-xs font-bold uppercase rounded ${
          i18n.language === "en"
            ? "bg-primary text-white"
            : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20"
        } transition-colors`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("es")}
        className={`px-2 py-1 text-xs font-bold uppercase rounded ${
          i18n.language === "es"
            ? "bg-primary text-white"
            : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20"
        } transition-colors`}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage("ca")}
        className={`px-2 py-1 text-xs font-bold uppercase rounded ${
          i18n.language === "ca"
            ? "bg-primary text-white"
            : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20"
        } transition-colors`}
      >
        CA
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        className={`px-2 py-1 text-xs font-bold uppercase rounded ${
          i18n.language === "fr"
            ? "bg-primary text-white"
            : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20"
        } transition-colors`}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
