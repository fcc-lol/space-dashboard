import React from "react";
import styled from "styled-components";

const Bars = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-end;
  padding: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const Bar = styled.div`
  flex: 1;
  height: 100%;
  background: ${(props) =>
    props.$isFilled ? props.theme.secondaryText : props.theme.secondary};
  border-radius: calc(0.25rem + 2px);
  transition: background 0.3s ease;
`;

function MoonProgress({ theme, illumination, age }) {
  const TOTAL_BARS = 8;

  // Determine if we're using age or illumination mode
  const useAge = age !== undefined && age !== null;
  const useIllumination = illumination !== undefined && illumination !== null;

  let filledBars = 0;
  if (useAge) {
    // Age mode: 29.53 days total
    const SYNODIC_MONTH = 29.53;
    filledBars = Math.floor((age / SYNODIC_MONTH) * TOTAL_BARS);
  } else if (useIllumination) {
    // Illumination mode: 0-100%
    filledBars = Math.floor((illumination / 100) * TOTAL_BARS);
  }
  // If neither age nor illumination is available (loading), show all empty bars

  return (
    <Bars>
      {Array.from({ length: TOTAL_BARS }, (_, i) => (
        <Bar key={i} theme={theme} $isFilled={i < filledBars} />
      ))}
    </Bars>
  );
}

export default MoonProgress;
