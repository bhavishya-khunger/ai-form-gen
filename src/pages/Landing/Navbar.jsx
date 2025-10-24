import React from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import './landing.css'; // Make sure to import the CSS
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 animate-[fade-in_0.8s_ease-out]">
      <div className="container mx-auto max-w-xl flex justify-between items-center px-6 py-3 border border-white/20 bg-black/30 backdrop-blur-lg rounded-full shadow-lg shadow-white/5">

        {/* Logo / Brand Name */}
        <a href="/" className="text-white homemade-apple-regular font-medium flex items-center gap-2">
          <span className="text-lg">✨</span>
          Formify
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          {/* <a href="#terms" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
            TERMS
          </a> */}
          {/* <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
            PRICING
          </a> */}
          {/* <a href="#cta" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
            Examples
          </a> */}
        </div>

        {/* CTA Button */}
        <Link to={'/login'} className="flex gap-2 items-center px-4 py-2 rounded-full text-white text-sm font-medium 
                         cursor-pointer border border-white/40 backdrop-blur-sm 
                         bg-gradient-to-bl from-indigo-900 to-black 
                         bg-[length:200%_200%] transition-all duration-500 ease-in-out 
                         hover:bg-[position:100%_0%] hover:scale-105">
          Login
          <IoIosArrowDroprightCircle size={18} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;