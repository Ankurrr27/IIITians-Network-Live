import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "iiitians-theme-mode";

const ThemeModeContext = createContext(null);

export function ThemeModeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return localStorage.getItem(STORAGE_KEY) || "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeMode);
    document.documentElement.dataset.theme = themeMode;
    document.body.dataset.theme = themeMode;
  }, [themeMode]);

  const value = useMemo(
    () => ({
      isDarkMode: themeMode === "dark",
      themeMode,
      toggleThemeMode() {
        setThemeMode((current) => (current === "light" ? "dark" : "light"));
      },
    }),
    [themeMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export default function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }

  return context;
}
