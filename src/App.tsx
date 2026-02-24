import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./utils/Home";
import Cars from "./utils/Cars";
import SignIn from "./utils/SignIn";
import SignUp from "./utils/SignUp";
import Order from "./utils/Order";
import logo from ".././public/rent car.jpg";
import Book from "./pages/Book";
import Books from "./pages/Book";

type Lang = "ENG" | "UZB" | "RUS";

const App = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Lang>("UZB");

  return (
    <div>
      <nav className="bg-gray-950 px-4 py-3 sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to={"/cars"} className="shrink-0">
            <img
              src={logo}
              className="w-24 rounded-xl hover:opacity-80 transition duration-200"
              alt="logo"
            />
          </Link>

          {/* Search - desktop */}
          <div className="hidden sm:flex flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-2xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              placeholder="Qidirish..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to={"/signin"}
              className="px-4 py-2 text-sm font-semibold text-decoration-none text-yellow-400 border border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition duration-200"
            >
              Sign In
            </Link>
            <Link
              to={"/signup"}
              className="px-4 py-2 text-sm font-semibold text-decoration-none text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              Sign Up
            </Link>
            <Link
              to={"/bookings"}
              className="px-4 py-2 text-sm font-semibold text-decoration-none text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-200 flex items-center gap-1"
            >
              🗓 My Bookings
            </Link>

            {/* Language */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Lang)}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
            >
              <option value="ENG">🇺🇸 ENG</option>
              <option value="UZB">🇺🇿 UZB</option>
              <option value="RUS">🇷🇺 RUS</option>
            </select>
          </div>

          {/* Mobile burger */}
          <button
            className="sm:hidden text-white text-2xl focus:outline-none hover:text-blue-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden mt-4 flex flex-col gap-3 px-2 pb-4 border-t border-gray-800 pt-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-2xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                type="text"
                placeholder="Qidirish..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <Link
              onClick={() => setMenuOpen(false)}
              to={"/signin"}
              className="w-full text-center text-decoration-none py-2.5 text-sm font-semibold text-yellow-400 border border-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition duration-200"
            >
              Sign In
            </Link>
            <Link
              onClick={() => setMenuOpen(false)}
              to={"/signup"}
              className="w-full text-center py-2.5 text-decoration-none text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              Sign Up
            </Link>
            <Link
              onClick={() => setMenuOpen(false)}
              to={"/bookings"}
              className="w-full text-center py-2.5 text-decoration-none text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-200"
            >
              🗓 My Bookings
            </Link>

            {/* Language */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Lang)}
              className="w-full bg-gray-800 border text-decoration-none border-gray-700 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
            >
              <option value="ENG">🇺🇸 ENG</option>
              <option value="UZB">🇺🇿 UZB</option>
              <option value="RUS">🇷🇺 RUS</option>
            </select>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/Home" element={<Home search={search} />} />
        <Route path="/" element={<Cars search={search} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cars" element={<Cars search={search} />} />
        <Route path="/bookings" element={<Book search={search}/>}/>
      </Routes>
    </div>
  );
};

export default App;
