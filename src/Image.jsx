import React, { useState } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1;
  user-select: none;
  position: relative;
`;

const LoadingPlaceholder = styled.div`
  position: absolute;
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  border-radius: 50%;
  background-color: ${(props) => props.$backgroundColor};
  display: ${(props) => (props.$isLoading ? "block" : "none")};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

function Image({ src, placeholderBackgroundColor, placeholderSize }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ImageContainer>
      <LoadingPlaceholder
        $isLoading={!isLoaded}
        $backgroundColor={placeholderBackgroundColor}
        $size={placeholderSize}
      />
      <StyledImage
        src={src}
        onLoad={() => setIsLoaded(true)}
        $isLoaded={isLoaded}
      />
    </ImageContainer>
  );
}

export default Image;
