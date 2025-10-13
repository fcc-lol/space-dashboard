import React from "react";
import styled from "styled-components";
import DaylightGraph from "../components/DaylightGraph";
import Image from "../components/Image";
import TimeInfo from "../components/Time";
import SunTimesTable from "../components/SunTimesTable";
import RecentEvents from "../components/RecentEvents";
import BigValue from "../components/BigValue";
import { useWeatherData } from "../hooks/useWeatherData";

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
`;

function Sun({ theme }) {
  const { data, loading } = useWeatherData();

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
      <Card theme={theme} type="compact" padding="0">
        <Image
          src="https://space-api.fcc.lol/sun/image?wavelength=304"
          placeholderBackgroundColor={theme.secondary}
          placeholderSize="75%"
          aspectRatio="auto"
        />
      </Card>
      <Card theme={theme} type="compact" style={{ gridColumn: "2 / 4" }}>
        <DaylightGraph theme={theme} />
      </Card>
      <Card theme={theme} padding="0" $justifyContent="flex-start">
        <SunTimesTable theme={theme} />
      </Card>
      <Card theme={theme} style={{ gridColumn: "2 / 4" }} padding="0">
        <RecentEvents theme={theme} />
      </Card>
    </Grid>
  );
}

export default Sun;
