import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">

          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-purple-700 dark:text-pink-400">
              <span className="text-3xl">📝</span>
              <span>OCRApp</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your simple OCR solution for fast text scanning.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
            <Link
              to="/"
              className="hover:text-purple-600 dark:hover:text-pink-400 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-purple-600 dark:hover:text-pink-400 transition-colors duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-purple-600 dark:hover:text-pink-400 transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <i className="fab fa-facebook-f"></i> {/* FontAwesome needed */}
                FB
              </a>
              <a
                href="#"
                className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
              >
                TW
              </a>
              <a
                href="#"
                className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300"
              >
                IG
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        {/* Copyright */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {year} OCRApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
