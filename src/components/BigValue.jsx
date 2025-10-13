import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
  padding: 1rem 0 0.875rem 0;
`;

const Label = styled.div`
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme?.secondaryText || "inherit"};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Value = styled.div`
  font-size: 3rem;
  text-transform: uppercase;
  font-weight: ${(props) => (props.$loading ? 300 : 500)};
  color: inherit;
  opacity: ${(props) => (props.$loading ? 0.1 : 1)};
  transition: opacity 0.3s ease;
  text-align: center;
`;

function BigValue({ theme, label, value, loading }) {
  return (
    <Container>
      <Value $loading={loading}>{value}</Value>
      {label && <Label theme={theme}>{label}</Label>}
    </Container>
  );
}

export default BigValue;
