import { useState, useEffect } from "react";

export function useMoonData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const response = await fetch("https://space-api.fcc.lol/moon");

        if (!response.ok) {
          throw new Error("Failed to fetch moon data");
        }

        const apiData = await response.json();

        setData(apiData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching moon data:", err);
      }
    };

    fetchMoonData();
    const interval = setInterval(fetchMoonData, 900000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
