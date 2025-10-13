import { useState, useEffect } from "react";
import { LAT, LNG } from "../constants";

export function useWeatherData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Fetch cloud cover from open-meteo
        const meteoResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=cloud_cover`
        );

        if (!meteoResponse.ok) {
          throw new Error("Failed to fetch cloud cover data");
        }

        const meteoData = await meteoResponse.json();

        // Fetch UV data from currentuvindex.com
        const uvResponse = await fetch(
          `https://currentuvindex.com/api/v1/uvi?latitude=${LAT}&longitude=${LNG}`
        );

        if (!uvResponse.ok) {
          throw new Error("Failed to fetch UV data");
        }

        const uvData = await uvResponse.json();

        // Combine both data sources
        setData({
          cloudCover: meteoData.current?.cloud_cover,
          uv: uvData
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 900000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
