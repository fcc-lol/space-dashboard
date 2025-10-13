import { useState, useEffect } from "react";
import { LAT, LNG } from "../constants";
import { getNYCTime } from "./useNYCTime";

export function useMoonData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        // Get NYC time
        const nycTime = getNYCTime();
        // Format: YYYY-MM-DDTHH:MM
        const year = nycTime.getFullYear();
        const month = String(nycTime.getMonth() + 1).padStart(2, "0");
        const day = String(nycTime.getDate()).padStart(2, "0");
        const hours = String(nycTime.getHours()).padStart(2, "0");
        const minutes = String(nycTime.getMinutes()).padStart(2, "0");
        const isoTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        const dateStr = `${year}-${month}-${day}`;

        // Fetch NASA moon data
        const nasaResponse = await fetch(
          `https://svs.gsfc.nasa.gov/api/dialamoon/${isoTime}`
        );

        if (!nasaResponse.ok) {
          throw new Error("Failed to fetch NASA moon data");
        }

        const nasaMoonData = await nasaResponse.json();

        // Fetch USNO moon transit/rise/set data
        const tzOffset = -5; // EST is UTC-5, EDT is UTC-4
        const tzSign = tzOffset < 0 ? -1 : 1;
        const tzAbs = Math.abs(tzOffset);

        const usnoParams = new URLSearchParams({
          date: dateStr,
          lat: LAT.toFixed(4),
          lon: LNG.toFixed(4),
          label: "",
          tz: tzAbs.toFixed(2),
          tz_sign: tzSign,
          tz_label: "false",
          dst: "false"
        });

        const usnoUrl = `https://aa.usno.navy.mil/calculated/rstt/oneday?${usnoParams.toString()}`;
        const usnoResponse = await fetch(usnoUrl);

        if (!usnoResponse.ok) {
          throw new Error("Failed to fetch USNO moon data");
        }

        const usnoHtml = await usnoResponse.text();
        const usnoData = parseUSNOHTML(usnoHtml);

        // Combine both data sources
        const combinedData = {
          ...nasaMoonData,
          usno: usnoData
        };

        setData(combinedData);
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

// Helper function to convert 24-hour time to 12-hour format
function convertTo12Hour(time24) {
  if (!time24 || time24 === "----") return time24;

  // Parse the time string (format: HH:MM or H:MM)
  const match = time24.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time24;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];

  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours = hours - 12;
  }

  return `${hours}:${minutes} ${period}`;
}

function parseUSNOHTML(html) {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const moonData = {
    rise: null,
    upperTransit: null,
    set: null,
    phase: null,
    illumination: null
  };

  // Get all text content for easier parsing
  const bodyText = doc.body.textContent;

  // Find the table with sun and moon data
  const tables = doc.querySelectorAll("table");

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const rows = table.querySelectorAll("tr");
    let inMoonSection = false;

    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      // Check both <td> and <th> elements
      const cells = row.querySelectorAll("td, th");

      // Check all cells to find section headers
      if (cells.length === 1) {
        const headerText = cells[0].textContent.trim();

        if (headerText === "Moon") {
          inMoonSection = true;
          continue;
        } else if (headerText === "Sun") {
          inMoonSection = false;
        }
      }

      // Parse moon data when we're in the Moon section
      if (inMoonSection && cells.length === 2) {
        const label = cells[0].textContent.trim();
        const value = cells[1].textContent.trim();

        if (label === "Rise" && value) {
          moonData.rise = convertTo12Hour(value);
        } else if (label === "Upper Transit" && value) {
          moonData.upperTransit = convertTo12Hour(value);
        } else if (label === "Set" && value) {
          moonData.set = convertTo12Hour(value);
        }
      }
    }
  }

  // Extract phase name (e.g., "Waning Gibbous")
  const phaseMatch = bodyText.match(
    /Phase of the moon[^:]*:\s*([^\s]+(?:\s+[^\s]+)*?)\s+with/i
  );
  if (phaseMatch) {
    moonData.phase = phaseMatch[1].trim();
  }

  // Extract illumination percentage
  const illumMatch = bodyText.match(
    /(\d+)%\s+of the Moon'?s visible disk illuminated/i
  );
  if (illumMatch) {
    moonData.illumination = parseInt(illumMatch[1]);
  }

  // Extract primary phase information
  const primaryPhaseMatch = bodyText.match(
    /Closest Primary Moon Phase:\s*([^\n]+)/i
  );
  if (primaryPhaseMatch) {
    moonData.primaryPhase = primaryPhaseMatch[1].trim();
  }

  return moonData;
}
