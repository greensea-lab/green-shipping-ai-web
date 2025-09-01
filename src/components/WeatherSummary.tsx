// src/components/WeatherSummary.tsx
import React from 'react';

interface Props {
  layerStates: Record<string, boolean>;
  weatherData: any;
}

const WeatherSummary: React.FC<Props> = ({ layerStates, weatherData }) => {
  return (
    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ffffffcc', borderRadius: '8px' }}>
      <h4>📊 선택 항목 요약</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {layerStates.wind && weatherData.wind && (
          <li>💨 바람: {weatherData.wind.speed} m/s, 방향: {weatherData.wind.deg}°</li>
        )}
        {layerStates.pressure && weatherData.main && (
          <li>🔽 공기압: {weatherData.main.pressure} hPa</li>
        )}
        {layerStates.temp && weatherData.main && (
          <li>🌡 온도: {weatherData.main.temp}°C</li>
        )}
        {layerStates.precipitation && weatherData.rain && (
          <li>🌧 강수량: {weatherData.rain['1h'] ?? weatherData.rain['3h']} mm</li>
        )}
        {layerStates.waves && weatherData.waves && (
          <li>🌊 파고: {weatherData.waves.height} m</li>
        )}
      </ul>
    </div>
  );
};

export default WeatherSummary;
