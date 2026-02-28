
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./utils/Home";
import Cars from "./utils/Cars";
import SignIn from "./utils/SignIn";
import SignUp from "./utils/SignUp";
import logo from ".././public/rent car.jpg";
import Book from "./pages/Book";
import { useLang } from "./LangContext";
import type { Lang } from "./i18n";

export interface User {
  email: string;
  password: string;
}

const LANGS: { value: Lang; flag: string; label: string }[] = [
  { value: "ENG", flag: "🇺🇸", label: "EN" },
  { value: "UZB", flag: "🇺🇿", label: "UZ" },
  { value: "RUS", flag: "🇷🇺", label: "RU" },
];

function LangSwitcher({
  lang,
  setLang,
  fullWidth = false,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        padding: 3,
        gap: 2,
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {LANGS.map(({ value, flag, label }) => {
        const isActive = lang === value;
        return (
          <button
            key={value}
            onClick={() => setLang(value)}
            style={{
              flex: fullWidth ? 1 : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: fullWidth ? "9px 12px" : "6px 12px",
              borderRadius: 11,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: isActive ? 700 : 400,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              background: isActive
                ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
              boxShadow: isActive ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
            }}
          >
            <span style={{ fontSize: fullWidth ? 16 : 14 }}>{flag}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

const App = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  return (
    <div>
      <nav className="bg-gray-950 px-4 py-3 sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to={"/cars"} className="shrink-0">
            <img
              src={logo}
              className="w-24 rounded-xl hover:opacity-80 transition duration-200"
              alt="logo"
            />
          </Link>

          <div className="hidden sm:flex flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-2xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              placeholder={t.search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              to={"/signin"}
              className="px-4 py-2 text-sm font-semibold text-decoration-none text-yellow-400 border border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition duration-200"
            >
              {t.signIn}
            </Link>
            <Link
              to={"/signup"}
              className="px-4 py-2 text-sm font-semibold text-decoration-none text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              {t.signUp}
            </Link>
            <Link
              to={"/book"}
              className="px-4 py-2 text-sm font-semibold text-decoration-none text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-200 flex items-center gap-1"
            >
              🗓 {t.myBookings}
            </Link>
            <LangSwitcher lang={lang} setLang={setLang} />
          </div>

          {/* Mobile: lang switcher + burger — ALWAYS visible */}
          <div className="sm:hidden flex items-center gap-2">
            <LangSwitcher lang={lang} setLang={setLang} />
            <button
              className="text-white text-2xl focus:outline-none hover:text-blue-400 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-4 flex flex-col gap-3 px-2 pb-4 border-t border-gray-800 pt-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-2xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                type="text"
                placeholder={t.search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link
              onClick={() => setMenuOpen(false)}
              to={"/signin"}
              className="w-full text-center text-decoration-none py-2.5 text-sm font-semibold text-yellow-400 border border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition duration-200"
            >
              {t.signIn}
            </Link>
            <Link
              onClick={() => setMenuOpen(false)}
              to={"/signup"}
              className="w-full text-center py-2.5 text-decoration-none text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              {t.signUp}
            </Link>
            <Link
              onClick={() => setMenuOpen(false)}
              to={"/book"}
              className="w-full text-center py-2.5 text-decoration-none text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-200"
            >
              🗓 {t.myBookings}
            </Link>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/Home" element={<Home search={search} />} />
        <Route path="/" element={<Cars search={search} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cars" element={<Cars search={search} />} />
        <Route path="/book" element={<Book search={search} />} />
      </Routes>
    </div>
  );
};

export default App;