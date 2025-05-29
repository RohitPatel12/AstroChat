// controllers/horoscopeController.js
import axios from "axios";

const zodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

export const getHoroscope = async (req, res) => {
  const { sign } = req.query;

  // If a specific sign is provided
  if (sign) {
    try {
      const response = await axios.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`);
      return res.json({ [sign]: response.data });
    } catch (error) {
      console.error("Error fetching horoscope:", error.message);
      return res.status(500).json({ error: "Failed to fetch horoscope" });
    }
  }

  // If no sign provided, fetch all signs
  try {
    const requests = zodiacSigns.map(sign =>
      axios.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`)
    );
    const responses = await Promise.all(requests);
    const allHoroscopes = {};
    zodiacSigns.forEach((sign, index) => {
      allHoroscopes[sign] = responses[index].data;
    });
    res.json(allHoroscopes);
  } catch (error) {
    console.error("Error fetching all horoscopes:", error.message);
    res.status(500).json({ error: "Failed to fetch all horoscopes" });
  }
};
