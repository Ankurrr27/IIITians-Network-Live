import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ isDarkMode, onToggle, className = "" }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${className}`}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDarkMode ? "Light mode" : "Dark mode"}
    </button>
  );
}
