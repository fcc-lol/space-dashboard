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

function MoonPhase({ theme, phaseName }) {
  if (!phaseName) {
    return <LoadingMessage theme={theme}>Loading Phase</LoadingMessage>;
  }

  return <PhaseName theme={theme}>{phaseName}</PhaseName>;
}

export default MoonPhase;
