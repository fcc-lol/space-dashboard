import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(props) => props.$justifyContent || "center"};
  width: 100%;
  padding: ${(props) => props.padding || "1.5rem"};
  border-radius: 1rem;
  border: 2px solid ${(props) => props.theme.secondary};
  box-sizing: border-box;
  overflow: auto;
  outline: none;

  ${(props) => {
    if (props.type === "square") {
      return `
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
      `;
    } else if (props.type === "compact") {
      return `
        flex-shrink: 0;
      `;
    } else {
      return `
        height: 100%;
      `;
    }
  }}
`;

export default Card;
