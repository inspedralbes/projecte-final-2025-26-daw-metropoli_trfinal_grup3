import { createContext, useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const SearchContext = createContext(null);

/**
 * Provides a shared searchQuery state for the Header search bar
 * and the pages that consume it (Home, Community, Collections).
 * Only active on desktop — mobile views manage their own search UI.
 */
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
};
