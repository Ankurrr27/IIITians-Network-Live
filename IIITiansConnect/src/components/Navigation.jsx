import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoBlue from "/IIITians-Network-Logo-Blue.png";
import logoLight from "/IIITians-Network-Logo-Light.png";
import ThemeToggle from "./ThemeToggle";
import useThemeMode from "../hooks/useThemeMode.jsx";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleThemeMode } = useThemeMode();

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Colleges", href: "/colleges" },
    { name: "Events", href: "/events" },
    { name: "IIIT Placements", href: "/placement" },
    { name: "Alumni", href: "/alumni" },
    { name: "Our Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setIsScrolled(window.scrollY > 10);
        return;
      }

      setIsScrolled(hero.getBoundingClientRect().bottom <= 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (event, href) => {
    event.preventDefault();
    setIsOpen(false);

    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/");
        return;
      }

      const target = document.getElementById(href.slice(1));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }

      return;
    }

    navigate(href);
  };

  const isSolidNav = isDarkMode || isScrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all ${
          isSolidNav
            ? isDarkMode
              ? "border-b border-slate-800 bg-slate-950/92 py-2 shadow-[0_10px_40px_rgba(15,23,42,0.3)] backdrop-blur-md"
              : "border-b border-slate-200 bg-white/88 py-2 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-md"
            : "bg-indigo-600 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <a href="/" className="flex items-center gap-3">
            <img
              src={isSolidNav ? logoBlue : logoLight}
              className="h-auto w-14"
              alt="IIITians Network"
            />
            <span
              className={`hidden font-semibold sm:inline ${
                isDarkMode
                  ? "text-slate-100"
                  : isSolidNav
                    ? "text-indigo-600"
                    : "text-white"
              }`}
            >
              IIITians Network
            </span>
          </a>

          <div className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={`relative text-sm font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  isDarkMode
                    ? "text-slate-200 after:bg-indigo-400 hover:text-white"
                    : isSolidNav
                      ? "text-slate-700 after:bg-indigo-600 hover:text-indigo-600"
                      : "text-slate-100 after:bg-white hover:text-white"
                }`}
              >
                {item.name}
              </a>
            ))}

            <ThemeToggle
              isDarkMode={isDarkMode}
              onToggle={toggleThemeMode}
              className={
                isDarkMode
                  ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                  : isSolidNav
                    ? "border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              }
            />
          </div>

          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <Menu
              className={`h-6 w-6 ${
                isDarkMode
                  ? "text-slate-100"
                  : isSolidNav
                    ? "text-indigo-600"
                    : "text-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 transform shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white"}`}
      >
        <div
          className={`flex items-center justify-between px-5 py-4 ${
            isDarkMode ? "border-b border-slate-800" : "border-b border-slate-200"
          }`}
        >
          <span
            className={`font-semibold ${
              isDarkMode ? "text-slate-100" : "text-indigo-600"
            }`}
          >
            Menu
          </span>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={toggleThemeMode}
            className={
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                : "border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50"
            }
          />

          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={`rounded-xl px-4 py-3 font-medium transition ${
                isDarkMode
                  ? "text-slate-100 hover:bg-slate-900"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navigation;
