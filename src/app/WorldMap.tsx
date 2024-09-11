import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

interface GeographyData {
  country: string;
  imps: string;
}

interface WorldMapProps {
  geographyData: GeographyData[];
}

const WorldMap: React.FC<WorldMapProps> = ({ geographyData }) => {
  const getColor = (countryName: string) => {
    const country = geographyData.find(item => item.country === countryName);
    return country ? '#3b82f6' : '#e5e7eb';
  };

  return (
    <ComposableMap projection="geoMercator">
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={getColor(geo.properties.name)}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default WorldMap;