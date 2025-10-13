import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  color: #fff;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.0625rem 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);

  &:first-child {
    padding-top: 1.125rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
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
  margin-left: 1rem;
`;

function Table({ rows }) {
  return (
    <Container>
      {rows.map((row, index) => (
        <Row key={index}>
          <Label>{row.label}</Label>
          <Value>{row.value}</Value>
        </Row>
      ))}
    </Container>
  );
}

export default Table;
