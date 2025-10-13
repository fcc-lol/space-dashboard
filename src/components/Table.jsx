import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  color: inherit;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.0625rem 1.5rem;
  border-bottom: 2px solid ${(props) => props.theme.secondary};

  &:first-child {
    padding-top: 1.125rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  color: ${(props) => props.theme?.secondaryText || "inherit"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Value = styled.div`
  font-size: 1rem;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-transform: uppercase;
  text-overflow: ellipsis;
  flex-shrink: 0;
  margin-left: 1rem;
  color: ${(props) => props.theme?.secondaryText || "inherit"};
`;

function Table({ theme, rows }) {
  return (
    <Container>
      {rows.map((row, index) => (
        <Row key={index} theme={theme}>
          <Label theme={theme}>{row.label}</Label>
          <Value theme={theme}>{row.value}</Value>
        </Row>
      ))}
    </Container>
  );
}

export default Table;
