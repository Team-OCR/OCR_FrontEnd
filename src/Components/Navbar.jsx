// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
// import ocr_svg from "/src/ocr_SVG.svg";
// import { AuthContext } from "../context/AuthContext";
// import { useContext } from "react";
// import { toast } from "react-toastify";
// import { ClockLoader } from "react-spinners";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("ocr-theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const theme = newTheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ocr-theme", theme);
  };

  // Common navigation links (now includes Profile on the left)
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-[#FD92E6] font-semibold"
              : "text-white font-medium hover:text-[#FD92E6] transition-colors duration-300"
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/About"
          className={({ isActive }) =>
            isActive
              ? "text-[#FD92E6] font-semibold"
              : "text-white font-medium hover:text-[#FD92E6] transition-colors duration-300"
          }
        >
          About
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/Contact"
          className={({ isActive }) =>
            isActive
              ? "text-[#FD92E6] font-semibold"
              : "text-white font-medium hover:text-[#FD92E6] transition-colors duration-300"
          }
        >
          Contact
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/OCR_Convert"
          className={({ isActive }) =>
            isActive
              ? "text-[#FD92E6] font-semibold"
              : "text-white font-medium hover:text-[#FD92E6] transition-colors duration-300"
          }
        >
          OCR
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/OCR_History"
          className={({ isActive }) =>
            isActive
              ? "text-[#FD92E6] font-semibold"
              : "text-white font-medium hover:text-[#FD92E6] transition-colors duration-300"
          }
        >
          History
        </NavLink>
      </li>

      {/* ✅ Profile moved here to the left menu */}
      <li>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "text-[#FD92E6] font-semibold"
              : "text-white font-medium hover:text-[#FD92E6] transition-colors duration-300"
          }
        >
          Profile
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-gradient-to-r from-[#5E00A6] to-[#7A3BCC] shadow-lg sticky top-0 z-50 transition-all duration-500">
      {/* Left: Logo */}
      <div className="navbar-start flex items-center gap-2">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost md:hidden text-white hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          {/* Mobile Menu Content */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-[#6B21A8]/90 rounded-box w-52 backdrop-blur-md border border-white/20"
          >
            {navLinks}
          </ul>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
        >
          <div className="text-3xl">
            {/* <img src={ocr_svg} alt="OCR"   style={{ width: "50px", height: "50px" }}  /> */}
          </div>
          <span className="text-secondary font-extrabold bg-primary/20 px-3 py-1 rounded-full backdrop-blur-sm">
            I TO T
          </span>
        </Link>
      </div>

      {/* Center: Nav links (desktop only) */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 space-x-4">{navLinks}</ul>
      </div>

      {/* Right: Theme Toggle */}
      <div className="navbar-end">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          <label className="flex items-center cursor-pointer gap-2 px-2 py-1">
            {/* Sun Icon */}
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isDark ? "text-gray-400" : "text-yellow-400"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>

            {/* Switch */}
            <input
              type="checkbox"
              className="toggle toggle-sm bg-white/20 border-white/30 toggle-secondary"
              checked={isDark}
              onChange={toggleTheme}
            />

            {/* Moon Icon */}
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isDark ? "text-blue-300" : "text-gray-400"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
