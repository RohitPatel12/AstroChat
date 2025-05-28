// src/pages/LandingPage.jsx

import React from "react";
import { Link , Navigate} from "react-router-dom";
import LoginPage from "./LoginPage";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-black">AstroApp</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-gray-700 text-sm">
          <a href="#" className="hover:text-black font-medium">Free Kundli</a>
          <a href="#" className="hover:text-black font-medium">Matching</a>
          <a href="#" className="hover:text-black font-medium">Horoscope</a>
          <a href="#" className="hover:text-black font-medium">Blog</a>
        </nav>
        <button className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-500 transition">
          <Link to={'/login'}> Login </Link>
        </button>
        <button>
            register 
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h2 className="text-md md:text-lg font-medium text-gray-600">200+ Celebs Recommend</h2>
        <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6">Chat With Astrologer</h1>
        <button className="bg-black text-white px-8 py-3 text-lg rounded-full hover:scale-105 transform transition duration-200">
          Chat Now
        </button>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">
        {[
          { icon: "💬", label: "Chat with Astrologer" },
          { icon: "📞", label: "Talk to Astrologer" },
          { icon: "🛍️", label: "Shop Astromall" },
          { icon: "🛐", label: "Book a Pooja" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <p className="font-medium text-center text-gray-800">{item.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
