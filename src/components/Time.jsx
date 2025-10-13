import React from "react";
import BigValue from "./BigValue";
import { useNYCTime } from "../hooks/useNYCTime";

function TimeInfo({ theme }) {
  const currentTime = useNYCTime(10000); // Update every 10 seconds

  // Format current time
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? " PM" : " AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")}${ampm}`;
  };

  return (
    <BigValue
      theme={theme}
      label="New York Time"
      value={formatTime(currentTime)}
    />
  );
}

export default TimeInfo;
