import React, { useState, useEffect } from "react";
import SunCalc from "suncalc";
import { LAT, LNG } from "../constants";
import Table from "./Table";

function SunTimesTable() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Calculate sun times
  const sunTimes = SunCalc.getTimes(currentTime, LAT, LNG);
  const sunrise = sunTimes.sunrise;
  const sunset = sunTimes.sunset;
  const solarNoon = sunTimes.solarNoon;

  // Calculate daylight remaining
  const now = currentTime.getTime();
  const sunsetTime = sunset.getTime();
  const sunriseTime = sunrise.getTime();
  const daylightRemaining = Math.max(0, sunsetTime - now);
  const hours = Math.floor(daylightRemaining / (1000 * 60 * 60));
  const minutes = Math.floor(
    (daylightRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Determine if it's currently daytime
  const isDaytime = now >= sunriseTime && now <= sunsetTime;

  // Format daylight remaining
  const formatDaylightRemaining = () => {
    if (isDaytime) {
      if (daylightRemaining > 0) {
        if (hours > 0) {
          return `${hours} hr ${minutes} min`;
        } else {
          return `${minutes} min`;
        }
      } else {
        return "Sun has set";
      }
    } else {
      return "None";
    }
  };

  // Format time
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const rows = [
    { label: "Sunrise", value: formatTime(sunrise) },
    { label: "Solar Noon", value: formatTime(solarNoon) },
    { label: "Sunset", value: formatTime(sunset) },
    { label: "Daylight Remaining", value: formatDaylightRemaining() }
  ];

  return <Table rows={rows} />;
}

export default SunTimesTable;
