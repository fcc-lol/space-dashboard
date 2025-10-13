import { useState, useEffect } from "react";

/**
 * Custom hook to get current time in NYC timezone
 * @param {number} updateInterval - Interval in milliseconds to update the time (default: 10000ms = 10s)
 * @returns {Date} Current time in NYC timezone
 */
export function useNYCTime(updateInterval = 10000) {
  const [currentTime, setCurrentTime] = useState(() => getNYCTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getNYCTime());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  return currentTime;
}

/**
 * Helper function to get current time in NYC timezone
 * @returns {Date} Current time in NYC timezone
 */
export function getNYCTime() {
  const now = new Date();
  // Get the time string in NYC timezone
  const nycTimeString = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  // Parse the NYC time string back into a Date object
  return new Date(nycTimeString);
}
