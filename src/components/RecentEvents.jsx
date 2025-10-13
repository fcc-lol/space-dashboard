import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: inherit;
  overflow: hidden;
  box-sizing: border-box;
  gap: 1rem;
  padding: 1.125rem 1.5rem 1.0625rem 1.5rem;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
`;

const EventTime = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  color: ${(props) => props.theme?.secondaryText || "inherit"};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EventCounter = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  color: ${(props) => props.theme?.secondaryText || "inherit"};
  flex-shrink: 0;
  white-space: nowrap;
`;

const EventNote = styled.p`
  font-size: 1rem;
  line-height: 1.75rem;
  color: inherit;
  opacity: 0.8;
  margin: 0;
  text-align: left;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(props) => props.$lineClamp || 5};
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-height: ${(props) => `${(props.$lineClamp || 5) * 1.75}rem`};
`;

const LoadingMessage = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme?.secondaryText || "inherit"};
`;

function RecentEvents({ theme }) {
  const [cmeData, setCmeData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lineClamp, setLineClamp] = useState(5);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchCMEData = () => {
      fetch("https://space-api.fcc.lol/cmes")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch CME data");
          }
          return response.json();
        })
        .then((data) => {
          // Get the 10 most recent CMEs
          setCmeData(data.slice(0, 10));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching CME data:", err);
          setLoading(false);
        });
    };

    fetchCMEData();
    const interval = setInterval(fetchCMEData, 60000 * 60); // Refresh every hour

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cmeData.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cmeData.length);
    }, 10000); // 10 seconds

    return () => clearInterval(timer);
  }, [cmeData]);

  useEffect(() => {
    const calculateLineClamp = () => {
      if (!containerRef.current || !headerRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const headerHeight = headerRef.current.clientHeight;
      const gap = 24; // 1.5rem gap
      const lineHeight = 28; // 1.75rem in pixels

      const availableHeight = containerHeight - headerHeight - gap;
      const maxLines = Math.floor(availableHeight / lineHeight);

      // Be conservative - subtract 1 to ensure no partial lines
      setLineClamp(Math.max(1, maxLines - 1));
    };

    calculateLineClamp();

    const resizeObserver = new ResizeObserver(calculateLineClamp);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York"
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short"
    });
    return `${datePart} · ${timePart}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage theme={theme}>Loading recentevents</LoadingMessage>
      </Container>
    );
  }

  if (cmeData.length === 0) {
    return (
      <Container>
        <LoadingMessage theme={theme}>
          No recent events available
        </LoadingMessage>
      </Container>
    );
  }

  const currentEvent = cmeData[currentIndex];

  return (
    <Container ref={containerRef}>
      <EventHeader ref={headerRef}>
        <EventTime theme={theme}>
          {formatDate(currentEvent.startTime)}
        </EventTime>
        <EventCounter theme={theme}>
          {currentIndex + 1} / {cmeData.length}
        </EventCounter>
      </EventHeader>
      <EventNote $lineClamp={lineClamp}>
        {currentEvent.note || "No additional notes available."}
      </EventNote>
    </Container>
  );
}

export default RecentEvents;
