import React from "react";
import styled from "styled-components";

const PhaseName = styled.div`
  font-size: 3rem;
  font-weight: 500;
  text-align: center;
  color: inherit;
  text-transform: uppercase;
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

function MoonPhase({ illumination, age }) {
  if (!illumination || !age) {
    return;
  }

  const phase = getMoonPhaseName(illumination, age);

  return <PhaseName>{phase.name}</PhaseName>;
}

export default MoonPhase;
