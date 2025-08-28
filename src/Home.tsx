// src/Home.tsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import DateSelector from './components/DateSelector';
import WeatherSummary from './components/WeatherSummary';
import NewsPanel from './components/NewsPanel';

type WeatherLayerKey = 'wind' | 'pressure' | 'temp' | 'precipitation' | 'waves';

function Home(): JSX.Element {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [location, setLocation] = useState('');
  const [locationLatLng, setLocationLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);

  const mapRef = useRef<L.Map | null>(null);
  const weatherLayersRef = useRef<{ [k in WeatherLayerKey]?: L.TileLayer }>({});
  const [layerStates, setLayerStates] = useState<Record<WeatherLayerKey, boolean>>({
    wind: false,
    pressure: false,
    temp: false,
    precipitation: false,
    waves: false,
  });

  // 달력 z-index 충돌 방지
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'gs-zindex-fix';
    style.innerHTML = `
      .leaflet-container { z-index: 1 !important; }
      .react-datepicker, .react-datepicker-popper, .flatpickr-calendar { z-index: 13000 !important; }
      .gs-date-wrap { position: relative; z-index: 2; }
    `;
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById('gs-zindex-fix');
      if (s) s.remove();
    };
  }, []);

  const apiKey = '993cff9405e71ae9bde4bcb10482cc8c';

  // 스타일
  const C: Record<string, React.CSSProperties> = {
    page: {
      minHeight: '100vh',
      background:
        'radial-gradient(1400px 700px at 50% -260px, #e9f7ff 0%, rgba(233,247,255,0) 60%), #f6fbff',
      padding: '16px 24px 64px',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR, Apple SD Gothic Neo, sans-serif',
    },
    container: { maxWidth: 1400, margin: '0 auto' },

    // 상단바
    topbar: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    logoMark: { height: 18, width: 18, background: '#16a34a', borderRadius: 4 },
    logo: { color: '#16a34a', fontWeight: 900, letterSpacing: 0.3, fontSize: '1.1rem' },

    // 히어로
    hero: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      background: '#ffffff',
      border: '1px solid #e5eaf1',
      borderRadius: 16,
      boxShadow: '0 8px 22px rgba(2,6,23,0.06)',
      padding: 18,
      marginBottom: 18,
    },
    heroText: { color: '#0f172a' },
    heroTitle: { fontWeight: 900, fontSize: '1.05rem', marginBottom: 4 },
    heroDesc: { color: '#64748b', fontSize: '0.95rem' },
    ctaBtn: {
      background: 'linear-gradient(90deg, #22c55e, #10b981)',
      color: '#fff',
      border: 'none',
      padding: '12px 18px',
      borderRadius: 12,
      fontWeight: 900,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      boxShadow: '0 8px 16px rgba(16,185,129,0.25)',
    },

    // 그리드
    grid: { display: 'grid', gridTemplateColumns: '3fr 1.4fr', gap: 20, marginTop: 6 },

    // 카드 공통
    card: {
      background: '#fff',
      border: '1px solid #e5eaf1',
      borderRadius: 14,
      boxShadow: '0 8px 18px rgba(2,6,23,0.05)',
      padding: 16,
    },
    sectionTitle: { fontWeight: 800, color: '#0f172a', marginBottom: 12, fontSize: '1rem' },
    labelRow: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      color: '#64748b',
      fontSize: 13,
      marginBottom: 8,
    },

    input: {
      width: '100%',
      padding: '12px',
      fontSize: '0.98rem',
      border: '1px solid #e5eaf1', // ← 여기 수정됨!
      borderRadius: 10,
      outline: 'none',
      marginBottom: 10,
    },
    primaryBtn: {
      width: '100%',
      padding: '12px',
      fontSize: '0.98rem',
      background: '#16a34a',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      cursor: 'pointer',
      fontWeight: 800,
      letterSpacing: 0.2,
      marginBottom: 12,
    },
    toggles: {
      border: '1px solid #e5eaf1',
      padding: '8px 12px',
      borderRadius: 10,
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'center',
      background: '#fff',
      marginBottom: 12,
      color: '#0f172a',
    },
    mapBox: { height: 520, borderRadius: 12, overflow: 'hidden' },
    tip: { color: '#64748b', fontSize: 12, marginTop: 8 },

    // 하단 특징
    features: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 20 },
    featureCard: {
      background: '#fff',
      border: '1px solid #e5eaf1',
      borderRadius: 14,
      padding: 16,
      color: '#0f172a',
      boxShadow: '0 8px 18px rgba(2,6,23,0.05)',
    },
    featureTitle: { fontWeight: 800, marginBottom: 6 },
    featureDesc: { color: '#64748b', fontSize: 13, lineHeight: 1.6 },
  };

  // 지도 초기화
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map('map', { zoomControl: true }).setView([36.5, 127.5], 5);
    mapRef.current = map;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
    weatherLayersRef.current.wind = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    weatherLayersRef.current.pressure = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    weatherLayersRef.current.temp = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    weatherLayersRef.current.precipitation = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    weatherLayersRef.current.waves = L.tileLayer(`https://tile.openweathermap.org/map/waves_new/{z}/{x}/{y}.png?appid=${apiKey}`);
  }, []);

  // 위치 마커 갱신
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    map.eachLayer(layer => {
      // @ts-ignore
      if (layer?.options?.pane === 'markerPane') map.removeLayer(layer);
    });
    if (locationLatLng) {
      L.marker([locationLatLng.lat, locationLatLng.lng])
        .addTo(map)
        .bindPopup('검색 위치')
        .openPopup();
      map.setView([locationLatLng.lat, locationLatLng.lng], 9);
    }
  }, [locationLatLng]);

  // 지오코딩
  const geocode = async (query: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const r = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', 'accept-language': 'ko' },
        headers: { 'User-Agent': 'GreenShippingAI/1.0 (contact@example.com)' },
      });
      if (r.data && r.data.length > 0) {
        const { lat, lon } = r.data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      }
      alert(`"${query}" 위치를 찾을 수 없습니다.`);
      return null;
    } catch (e) {
      console.error('Geocoding 오류:', e);
      alert('지오코딩에 실패했습니다.');
      return null;
    }
  };

  // 현재 날씨
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const r = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeatherData(r.data);
    } catch (e) {
      console.error('날씨 데이터 오류:', e);
      alert('날씨 정보를 불러오는 데 실패했습니다.');
    }
  };

  const handleLocationConfirm = async () => {
    if (!location.trim()) {
      alert('위치를 입력해주세요. (예: 부산항)');
      return;
    }
    const coords = await geocode(location);
    if (coords) {
      setLocationLatLng(coords);
      await fetchWeatherData(coords.lat, coords.lng);
    }
  };

  const toggleLayer = (key: WeatherLayerKey) => {
    const map = mapRef.current;
    const layer = weatherLayersRef.current[key];
    if (!map || !layer) return;
    const isActive = layerStates[key];
    if (isActive) map.removeLayer(layer);
    else layer.addTo(map);
    setLayerStates(prev => ({ ...prev, [key]: !isActive }));
  };

  return (
    <div style={C.page}>
      <div style={C.container}>
        {/* Topbar: 좌측 로고만 */}
        <div style={C.topbar}>
          <div style={C.logoMark} />
          <div style={C.logo}>GreenShipping AI</div>
        </div>

        {/* Hero: 설명 + CTA */}
        <div style={C.hero}>
          <div style={C.heroText}>
            <div style={C.heroTitle}>더 친환경적인 항로, 한눈에 비교하고 선택</div>
            <div style={C.heroDesc}>
              운항 조건 입력 없이도 관심 지역의 바람·온도·파고를 빠르게 확인하세요.
            </div>
          </div>
          <button style={C.ctaBtn} onClick={() => navigate('/simulation')}>
            🚢 시뮬레이션 시작하기
          </button>
        </div>

        {/* 본문 2열 */}
        <div style={C.grid}>
          {/* 왼쪽: 지도/필터 */}
          <div style={C.card}>
            <div style={C.sectionTitle}>🌦️ 날씨 & 항로 조건</div>
            <div style={C.labelRow}>
              <div>선택한 날짜:</div>
              <div style={{ fontWeight: 800 }}>
                {selectedDate?.toISOString().split('T')[0]}
              </div>
            </div>

            <div className="gs-date-wrap">
              <DateSelector onDateSelect={setSelectedDate} />
            </div>

            <input
              type="text"
              placeholder="위치 검색 (예: 부산항)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={C.input}
            />
            <button style={C.primaryBtn} onClick={handleLocationConfirm}>
              📍 위치 확인
            </button>

            <div style={C.toggles}>
              <label><input type="checkbox" onChange={() => toggleLayer('wind')} /> 바람</label>
              <label><input type="checkbox" onChange={() => toggleLayer('pressure')} /> 공기압</label>
              <label><input type="checkbox" onChange={() => toggleLayer('temp')} /> 온도</label>
              <label><input type="checkbox" onChange={() => toggleLayer('precipitation')} /> 강수량</label>
              <label><input type="checkbox" onChange={() => toggleLayer('waves')} /> 파고</label>
            </div>

            <div id="map" style={C.mapBox} />

            {weatherData && (
              <div style={{ marginTop: 10 }}>
                <WeatherSummary layerStates={layerStates} weatherData={weatherData} />
              </div>
            )}

            <div style={C.tip}>
              * 지도를 움직이며 주변 해역의 타일 레이어를 켰다/껐다 하며 비교해 보세요.
            </div>
          </div>

          {/* 오른쪽: 뉴스 */}
          <div style={C.card}>
            <div style={C.sectionTitle}>🗞️ 해운 · 물류 이슈</div>
            <NewsPanel />
          </div>
        </div>

        {/* 하단 특징 */}
        <div style={C.features}>
          <div style={C.featureCard}>
            <div style={C.featureTitle}>실시간 타일 레이어</div>
            <div style={C.featureDesc}>
              OpenWeather 타일로 바람/기압/온도/강수/파고를 한 번에 확인하고, 겹쳐 보며 비교합니다.
            </div>
          </div>
          <div style={C.featureCard}>
            <div style={C.featureTitle}>원클릭 시뮬레이션</div>
            <div style={C.featureDesc}>
              출발/도착지와 기본 조건만 입력하면 예상 연료·탄소를 계산해 결과를 시각화합니다.
            </div>
          </div>
          <div style={C.featureCard}>
            <div style={C.featureTitle}>뉴스 연동</div>
            <div style={C.featureDesc}>
              해운/항만 이슈를 연결해 리스크를 사전에 파악하고, 안전하고 효율적인 항로를 선택하세요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

