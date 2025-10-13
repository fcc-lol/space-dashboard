import React, { useState } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  user-select: none;
  position: relative;
  aspect-ratio: 1;
`;

const LoadingPlaceholder = styled.div`
  position: absolute;
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  border-radius: 50%;
  background-color: ${(props) => props.$backgroundColor};
  display: ${(props) => (props.$isLoading ? "block" : "none")};
  filter: blur(12px);
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center center;
  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
  filter: ${(props) => (props.$isLoaded ? "blur(0px)" : "blur(10px)")};
  transition: opacity 0.6s ease-out, filter 0.6s ease-out;
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
