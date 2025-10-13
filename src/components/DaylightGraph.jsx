import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SunCalc from "suncalc";
import { LAT, LNG } from "../constants";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const GraphSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const TimeLabel = styled.div`
  position: absolute;
  bottom: -4px;
  font-size: 12px;
  color: #fff;
  opacity: 0.5;
  transform: translateX(-50%);
  pointer-events: none;
  white-space: nowrap;

  &.first {
    transform: translateX(0);
  }

  &.last {
    transform: translateX(-100%);
  }
`;

function DaylightGraph() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [labelHeight, setLabelHeight] = useState(20);
  const labelRef = React.useRef(null);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!labelRef.current || !containerRef.current) return;

    const updateLabelHeight = () => {
      if (labelRef.current && containerRef.current) {
        const labelPixelHeight = labelRef.current.offsetHeight;
        const containerPixelHeight = containerRef.current.offsetHeight;

        // Convert pixel height to SVG viewBox units
        // SVG height is 300 in viewBox, so we need to scale accordingly
        const svgViewBoxHeight = 300;
        const labelInSvgUnits =
          (labelPixelHeight / containerPixelHeight) * svgViewBoxHeight;
        setLabelHeight(labelInSvgUnits + 8); // Add some padding
      }
    };

    // Initial measurement
    updateLabelHeight();

    // Watch for size changes on both label and container
    const resizeObserver = new ResizeObserver(updateLabelHeight);
    resizeObserver.observe(labelRef.current);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate sun times
  const sunTimes = SunCalc.getTimes(currentTime, LAT, LNG);
  const sunrise = sunTimes.sunrise;
  const sunset = sunTimes.sunset;

  // Calculate sun position curve
  const width = 600;
  const height = 256;
  const labelSpace = labelHeight;
  const topPadding = 56;
  const padding = 0;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - labelSpace - 2 * padding - topPadding;

  // Time to x position (0-24 hours)
  const timeToX = (date) => {
    const hours = date.getHours() + date.getMinutes() / 60;
    return padding + (hours / 24) * graphWidth;
  };

  // Generate curve path
  const generatePath = () => {
    const startOfDay = new Date(currentTime);
    startOfDay.setHours(0, 0, 0, 0);

    // Get sunrise and sunset hours
    const sunriseHour = sunrise.getHours() + sunrise.getMinutes() / 60;
    const sunsetHour = sunset.getHours() + sunset.getMinutes() / 60;

    // Extend the curve 5 hours before sunrise and 5 hours after sunset to show below horizon
    const startHour = Math.max(0, sunriseHour - 5);
    const endHour = Math.min(24, sunsetHour + 5);

    // First pass: collect all altitudes to find min/max
    const altitudes = [];
    for (let hour = startHour; hour <= endHour; hour += 0.25) {
      const time = new Date(startOfDay);
      time.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      const position = SunCalc.getPosition(time, LAT, LNG);
      altitudes.push(position.altitude);
    }

    const minAlt = Math.min(...altitudes);
    const maxAlt = Math.max(...altitudes);

    // Second pass: generate points with normalized y positions
    const points = [];
    let i = 0;
    for (let hour = startHour; hour <= endHour; hour += 0.25) {
      const time = new Date(startOfDay);
      time.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      const x = timeToX(time);
      const altitude = altitudes[i++];
      const normalizedAltitude = (altitude - minAlt) / (maxAlt - minAlt);
      const y =
        height - labelSpace - padding - normalizedAltitude * graphHeight;
      points.push({ x, y, time, altitude });
    }

    // Create smooth SVG path using cubic Bezier curves with Catmull-Rom splines
    let path = `M ${points[0].x} ${points[0].y}`;

    const tension = 0.3; // Controls the smoothness (0 = straight, 1 = very curved)

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      // Calculate control points for cubic Bezier
      const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
      const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
      const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
      const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return { path, points, minAlt, maxAlt };
  };

  const { path, minAlt, maxAlt } = generatePath();

  // Calculate y position based on sun altitude using the dynamic range
  const sunPositionY = (date) => {
    const position = SunCalc.getPosition(date, LAT, LNG);
    const altitude = position.altitude;
    const normalizedAltitude = (altitude - minAlt) / (maxAlt - minAlt);
    return height - labelSpace - padding - normalizedAltitude * graphHeight;
  };

  const currentX = timeToX(currentTime);
  const currentY = sunPositionY(currentTime);

  // Calculate horizon line position
  const horizonY = sunPositionY(sunrise);

  // Generate markers every 3 hours
  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <Container ref={containerRef}>
      <GraphSvg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sunPathGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="25%" stopColor="#787878" />
            <stop offset="50%" stopColor="#0d0d0d" />
            <stop offset="75%" stopColor="#0d0d0d" />
            <stop offset="100%" stopColor="#0d0d0d" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Hourly markers */}
        {hours.map((hour) => {
          const time = new Date(currentTime);
          time.setHours(hour, 0, 0, 0);
          // For hour 24, manually set x to the end of the graph
          let x = hour === 24 ? padding + graphWidth : timeToX(time);

          // Adjust first and last line position
          const isFirst = hour === 0;
          const isLast = hour === 24;
          const lineX = isFirst ? x + 3 : isLast ? x - 3 : x;

          return (
            <line
              key={hour}
              x1={lineX}
              y1={2}
              x2={lineX}
              y2={height - labelSpace}
              stroke="#0d0d0d"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          );
        })}
        {/* Horizon line */}
        <line
          x1={3}
          y1={horizonY}
          x2={width - 3}
          y2={horizonY}
          stroke="#0d0d0d"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        {/* Sun path */}
        <path
          d={path}
          fill="none"
          stroke="url(#sunPathGradient)"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeWidth="3"
        />
        {/* Current sun position */}
        <circle cx={currentX} cy={currentY} r="8" fill="#fff" />
      </GraphSvg>
      {/* Time labels as HTML */}
      {hours.map((hour, index) => {
        const time = new Date(currentTime);
        time.setHours(hour, 0, 0, 0);
        let x = hour === 24 ? padding + graphWidth : timeToX(time);

        // Convert to 12-hour format
        const hour12 =
          hour === 0 || hour === 24 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 || hour === 24 ? "AM" : "PM";
        const label = `${hour12}${period}`;

        const isFirst = hour === 0;
        const isLast = hour === 24;
        const leftPercent = (x / width) * 100;

        return (
          <TimeLabel
            key={hour}
            ref={index === 0 ? labelRef : null}
            className={isFirst ? "first" : isLast ? "last" : ""}
            style={{ left: `${leftPercent}%` }}
          >
            {label}
          </TimeLabel>
        );
      })}
    </Container>
  );
}

export default DaylightGraph;
