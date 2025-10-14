import React, { useEffect } from "react";
import styled from "styled-components";
import MoonPhase from "../components/MoonPhase";
import MoonProgress from "../components/MoonProgress";
import Image from "../components/Image";
import Table from "../components/Table";
import BigValue from "../components/BigValue";
import { useMoonData } from "../hooks/useMoonData";

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

const Container = styled.div`
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

function Moon({ theme }) {
  const { data: moonData, loading: moonLoading } = useMoonData();

  useEffect(() => {
    document.title = "Moon Dashboard";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href =
        "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌚</text></svg>";
    }
    document.documentElement.style.setProperty("--selection-bg", theme.primary);
    document.documentElement.style.setProperty(
      "--selection-text",
      theme.background
    );
  }, [theme]);

  return (
    <Container theme={theme}>
      <Card theme={theme} type="compact" padding="0">
        <BigValue
          theme={theme}
          label="Rise"
          value={moonData?.times?.rise || "00:00"}
          loading={moonLoading || !moonData}
        />
      </Card>
      <Card theme={theme} type="compact" padding="0">
        <BigValue
          theme={theme}
          label="Highest over NYC"
          value={moonData?.times?.upperTransit || "00:00"}
          loading={moonLoading || !moonData}
        />
      </Card>
      <Card theme={theme} type="compact" padding="0">
        <BigValue
          theme={theme}
          label="Set"
          value={moonData?.times?.set || "00:00"}
          loading={moonLoading || !moonData}
        />
      </Card>
      <Card theme={theme} type="compact" padding="0">
        <Image
          src={moonLoading || !moonData ? "" : moonData.images.standard.url}
          placeholderBackgroundColor={theme.secondary}
          placeholderSize="75%"
          aspectRatio="auto"
          size="80%"
        />
      </Card>
      <div
        style={{
          gridColumn: "2 / 4",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <Card
          theme={theme}
          type="compact"
          style={{ flex: 1, gridColumn: "2 / 4" }}
          padding="0"
        >
          <MoonPhase theme={theme} phaseName={moonData?.phase?.name} />
        </Card>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1.5rem",
            flex: 1
          }}
        >
          <Card theme={theme} padding="0">
            <BigValue
              theme={theme}
              label="Illuminated"
              value={
                moonLoading || !moonData
                  ? "0%"
                  : `${moonData.phase.illumination.toFixed(0)}%`
              }
              loading={moonLoading || !moonData}
            />
          </Card>
          <Card theme={theme} padding="0">
            <BigValue
              theme={theme}
              label="Age"
              value={
                moonLoading || !moonData
                  ? "0 days"
                  : `${moonData.phase.age.toFixed(0)} days`
              }
              loading={moonLoading || !moonData}
            />
          </Card>
        </div>
      </div>
      <Card theme={theme} padding="0" $justifyContent="flex-start">
        <Table
          theme={theme}
          loading={moonLoading || !moonData}
          rows={
            moonLoading || !moonData
              ? [
                  {
                    label: "Diameter",
                    value: "0000.0′"
                  },
                  {
                    label: "Distance",
                    value: "000,000 mi"
                  },
                  {
                    label: "Position Angle",
                    value: "0.00°"
                  },
                  {
                    label: "Obscuration",
                    value: "0.0%"
                  }
                ]
              : [
                  {
                    label: "Diameter",
                    value: `${(moonData.position.diameter / 60).toFixed(1)}′`
                  },
                  {
                    label: "Distance",
                    value: `${Math.round(
                      moonData.position.distance / 1.60934
                    ).toLocaleString()} mi`
                  },
                  {
                    label: "Position Angle",
                    value: `${moonData.position.posangle.toFixed(2)}°`
                  },
                  {
                    label: "Obscuration",
                    value: `${moonData.obscuration.toFixed(1)}%`
                  }
                ]
          }
        />
      </Card>
      <div
        style={{
          gridColumn: "2 / 4",
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          flex: 1
        }}
      >
        <Card
          theme={theme}
          type="compact"
          padding="0.75rem"
          style={{ flex: 1 }}
        >
          <MoonProgress
            theme={theme}
            illumination={moonData?.phase?.illumination}
          />
        </Card>
        <Card
          theme={theme}
          type="compact"
          padding="0.75rem"
          style={{ flex: 1 }}
        >
          <MoonProgress theme={theme} age={moonData?.phase?.age} />
        </Card>
      </div>
    </Container>
  );
}

export default Moon;
