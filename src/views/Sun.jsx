import React, { useEffect } from "react";
import styled from "styled-components";
import DaylightGraph from "../components/DaylightGraph";
import Image from "../components/Image";
import TimeInfo from "../components/Time";
import SunTimesTable from "../components/SunTimesTable";
import RecentEvents from "../components/RecentEvents";
import BigValue from "../components/BigValue";
import Card from "../components/Card";
import { useWeatherData } from "../hooks/useWeatherData";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto 1fr;
  width: 100%;
  height: 100vh;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  padding: 1.5rem;
  gap: 1.5rem;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

const GridSpan = styled(Card)`
  grid-column: 2 / 4;

  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

const ImageCard = styled(Card)`
  @media (max-width: 768px) {
    order: -1;
  }
`;

function Sun({ theme }) {
  const { data, loading } = useWeatherData();

  useEffect(() => {
    document.title = "Sun Dashboard";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href =
        "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌞</text></svg>";
    }
    document.documentElement.style.setProperty("--selection-bg", theme.primary);
    document.documentElement.style.setProperty(
      "--selection-text",
      theme.background
    );
  }, [theme]);

  return (
    <Grid theme={theme}>
      <Card theme={theme} type="compact" padding="0">
        <TimeInfo theme={theme} />
      </Card>
      <Card theme={theme} type="compact" padding="0">
        <BigValue
          theme={theme}
          label="UV Index"
          value={loading || !data ? 0 : data.uv.now.uvi.toFixed(2)}
          loading={loading || !data}
        />
      </Card>
      <Card theme={theme} type="compact" padding="0">
        <BigValue
          theme={theme}
          label="Cloud Cover"
          value={loading || !data ? 0 : `${data.cloudCover}%`}
          loading={loading || !data}
        />
      </Card>
      <ImageCard theme={theme} type="compact" padding="0">
        <Image
          src="https://space-api.fcc.lol/sun/image?wavelength=304"
          placeholderBackgroundColor={theme.secondary}
          placeholderSize="75%"
          aspectRatio="auto"
        />
      </ImageCard>
      <GridSpan theme={theme} type="compact">
        <DaylightGraph theme={theme} />
      </GridSpan>
      <Card theme={theme} padding="0" $justifyContent="flex-start">
        <SunTimesTable theme={theme} />
      </Card>
      <GridSpan theme={theme} padding="0">
        <RecentEvents theme={theme} />
      </GridSpan>
    </Grid>
  );
}

export default Sun;
