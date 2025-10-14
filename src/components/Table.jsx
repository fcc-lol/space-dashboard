import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const Row = styled.div`
  width: calc(100% - 3rem);
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.03125rem 1.5rem;
  border-bottom: 2px solid ${(props) => props.theme.secondary};

  &:first-child {
    padding-top: 1.125rem;
  }

  &:last-child {
    border-bottom: 2px solid transparent;
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
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-transform: uppercase;
  text-overflow: ellipsis;
  flex-shrink: 0;
  letter-spacing: 0.05em;
  margin-left: 1rem;
  color: ${(props) => props.theme?.text || "inherit"};
  opacity: ${(props) => (props.$loading ? 0.1 : 1)};
`;

function Table({ theme, rows, loading }) {
  return (
    <Container>
      {rows.map((row, index) => (
        <Row key={index} theme={theme}>
          <Label theme={theme}>{row.label}</Label>
          <Value theme={theme} $loading={loading}>
            {row.value}
          </Value>
        </Row>
      ))}
    </Container>
  );
}

export default Table;
