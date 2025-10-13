import React from "react";
import styled from "styled-components";

const Bars = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-end;
`;

const Bar = styled.div`
  flex: 1;
  height: 100%;
  background: ${(props) =>
    props.$isFilled ? props.theme.secondaryText : props.theme.secondary};
  border-radius: 0.25rem;
  transition: background 0.3s ease;
`;

function MoonProgress({ theme, illumination, age }) {
  const TOTAL_BARS = 8;

  // Determine if we're using age or illumination mode
  const useAge = age !== undefined && age !== null;
  const useIllumination = illumination !== undefined && illumination !== null;

  if (!useAge && !useIllumination) {
    return;
  }

  let filledBars;
  if (useAge) {
    // Age mode: 29.53 days total
    const SYNODIC_MONTH = 29.53;
    filledBars = Math.floor((age / SYNODIC_MONTH) * TOTAL_BARS);
  } else {
    // Illumination mode: 0-100%
    filledBars = Math.floor((illumination / 100) * TOTAL_BARS);
  }

  return (
    <Bars>
      {Array.from({ length: TOTAL_BARS }, (_, i) => (
        <Bar key={i} theme={theme} $isFilled={i < filledBars} />
      ))}
    </Bars>
  );
}

export default MoonProgress;
