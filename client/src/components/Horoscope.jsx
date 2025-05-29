// src/components/HoroscopeSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const HoroscopeCard = ({ sign, data }) => (
  <div className="bg-white shadow-md p-4 rounded-md border hover:shadow-lg transition">
    <h2 className="text-xl font-semibold capitalize mb-2">{sign}</h2>
    <p className="text-sm"><strong>Date Range:</strong> {data.date_range}</p>
    <p className="text-sm"><strong>Description:</strong> {data.description}</p>
  </div>
);

const HoroscopeSection = ({ limit = 6 }) => {
  const [horoscopes, setHoroscopes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHoroscopes = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/horoscopes");
        setHoroscopes(data);
      } catch (err) {
        console.error("Error fetching horoscopes:", err);
        setError("Failed to load horoscopes");
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscopes();
  }, []);

  const signs = Object.keys(horoscopes).slice(0, limit);

  return (
    <section className="p-6 bg-gray-50 rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">🌟 Today's Horoscopes</h2>

      {loading && <p className="text-center">Loading horoscopes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {signs.map(sign => (
            <HoroscopeCard key={sign} sign={sign} data={horoscopes[sign]} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HoroscopeSection;
