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

const ImageMask = styled.div`
  position: relative;
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
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
  object-fit: cover;
  object-position: center center;
  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
  filter: ${(props) => (props.$isLoaded ? "blur(0px)" : "blur(10px)")};
  transition: opacity 0.6s ease-out, filter 0.6s ease-out;
  transform: scale(${(props) => props.$zoom});
`;

function Image({
  src,
  placeholderBackgroundColor,
  placeholderSize,
  size = "90%",
  zoom = 1
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ImageContainer>
      <LoadingPlaceholder
        $isLoading={!isLoaded}
        $backgroundColor={placeholderBackgroundColor}
        $size={placeholderSize}
      />
      <ImageMask $size={size}>
        <StyledImage
          src={src}
          onLoad={() => setIsLoaded(true)}
          $isLoaded={isLoaded}
          $zoom={zoom}
        />
      </ImageMask>
    </ImageContainer>
  );
}

export default Image;
