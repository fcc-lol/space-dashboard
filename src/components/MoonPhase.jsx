import React from "react";
import styled from "styled-components";

const PhaseName = styled.div`
  font-size: 3rem;
  font-weight: 500;
  text-align: center;
  color: ${(props) => props.theme?.text || "inherit"};
  text-transform: uppercase;
`;

const LoadingMessage = styled.div`
  font-size: 3rem;
  font-weight: 300;
  text-transform: uppercase;
  opacity: 0.1;
  color: ${(props) => props.theme?.text || "inherit"};
`;

function getMoonPhaseName(illum, age) {
  const synodicMonth = 29.53;
  const halfMonth = synodicMonth / 2;

  // Determine if waxing or waning
  const waxing = age < halfMonth;

  let name = "";

  // Very rough but practical ranges
  if (illum <= 1) {
    name = "New Moon";
  } else if (illum < 25) {
    name = waxing ? "Waxing Crescent" : "Waning Crescent";
  } else if (illum < 50) {
    // Age helps us decide between crescent and quarter
    if (waxing && age < 7.4) {
      name = "Waxing Crescent";
    } else if (!waxing && age > 22.1) {
      name = "Waning Crescent";
    } else {
      name = waxing ? "First Quarter" : "Last Quarter";
    }
  } else if (illum < 99) {
    name = waxing ? "Waxing Gibbous" : "Waning Gibbous";
  } else {
    name = "Full Moon";
  }

  return { name };
}

function MoonPhase({ theme, illumination, age }) {
  if (!illumination || !age) {
    return <LoadingMessage theme={theme}>Loading Phase</LoadingMessage>;
  }

  const phase = getMoonPhaseName(illumination, age);

  return <PhaseName theme={theme}>{phase.name}</PhaseName>;
}

export default MoonPhase;
