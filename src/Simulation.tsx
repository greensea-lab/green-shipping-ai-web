// src/Simulation.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapView from './components/MapView';

type LatLng = { lat: number; lng: number };
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const colors = {
  brand: '#22c55e',
  blue: '#0ea5e9',
  text: '#0f172a',
  sub: '#64748b',
  card: '#ffffff',
  page: '#f6fbff',
  border: '#e5eaf1',
  ink: '#0b1220',
};

const styles = {
  page: {
    minHeight: '100vh',
    background:
      `radial-gradient(1200px 600px at 50% -220px, #e9f7ff 0%, rgba(233,247,255,0) 60%), ${colors.page}`,
  },
  centerWrap: {
    maxWidth: 1240,
    margin: '0 auto',
    padding: '44px 20px 80px',
    minHeight: 'calc(100vh - 0px)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 22,
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: '1.15rem', fontWeight: 900, color: colors.text },
  subtitle: { color: colors.sub, fontSize: '0.95rem' },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: 32,
    alignItems: 'start',
  },
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 18,
    boxShadow: '0 12px 26px rgba(2,6,23,0.06)',
    padding: 22,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { fontSize: '1.05rem', fontWeight: 900, color: colors.text },
  cardSub: { fontSize: '0.92rem', color: colors.sub },

  row: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 12 },
  input: {
    width: '100%',
    padding: '0.95rem 1rem',
    fontSize: '0.95rem',
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: '#fff',
  },
  cta: {
    padding: '0.95rem 1.1rem',
    borderRadius: 12,
    border: 'none',
    background: colors.blue,
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  sliderWrap: { marginTop: 4 },
  primary: {
    width: '100%',
    padding: '1.05rem 1.2rem',
    borderRadius: 14,
    border: 'none',
    background: `linear-gradient(135deg, ${colors.brand}, ${colors.blue})`,
    color: '#fff',
    fontWeight: 900,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 14px 28px rgba(16,185,129,0.28)',
    marginTop: 10,
  } as React.CSSProperties,
  primaryDisabled: { opacity: 0.5, cursor: 'not-allowed' },

  mapBox: { height: 520, borderRadius: 14, overflow: 'hidden' as const },
  empty: {
    height: 520,
    borderRadius: 14,
    border: `1px dashed ${colors.border}`,
    background: '#fafcff',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center' as const,
    color: colors.sub,
    padding: '0 20px',
  },
};

function Simulation(): JSX.Element {
  const navigate = useNavigate();

  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureLatLng, setDepartureLatLng] = useState<LatLng | null>(null);
  const [arrivalLatLng, setArrivalLatLng] = useState<LatLng | null>(null);

  const [speed, setSpeed] = useState<number | ''>('');
  const [payload, setPayload] = useState<number>(50);
  const [wind, setWind] = useState<number | ''>('');
  const [wave, setWave] = useState<number | ''>('');

  const geocode = async (query: string): Promise<LatLng | null> => {
    try {
      const { data } = await axios.get(NOMINATIM_URL, {
        params: { q: query, format: 'json', 'accept-language': 'ko' },
      });
      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: Number(lat), lng: Number(lon) };
      }
      alert(`"${query}" 위치를 찾을 수 없습니다.`);
      return null;
    } catch {
      alert('지오코딩에 실패했습니다.');
      return null;
    }
  };

  const handleDepartureConfirm = async () => {
    if (!departure.trim()) return alert('출발지를 입력하세요.');
    const coords = await geocode(departure);
    if (coords) setDepartureLatLng(coords);
  };
  const handleArrivalConfirm = async () => {
    if (!arrival.trim()) return alert('도착지를 입력하세요.');
    const coords = await geocode(arrival);
    if (coords) setArrivalLatLng(coords);
  };

  const canSimulate = Boolean(departureLatLng && arrivalLatLng);

  const handleSimulation = () => {
    if (!canSimulate) return alert('출발지와 도착지 위치를 먼저 확인하세요.');
    navigate('/result', {
      state: {
        departure,
        arrival,
        speed: Number(speed || 0),
        loadRate: payload,
        windSpeed: Number(wind || 0),
        waveHeight: Number(wave || 0),
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.centerWrap}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>시뮬레이션</div>
            <div style={styles.subtitle}>조건 입력 → 경로 확인 → 결과</div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* 좌측 카드 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>🚢 운항 조건 입력</div>
              <div style={styles.cardSub}>필수 항목을 입력하세요</div>
            </div>

            <div style={styles.row}>
              <input
                type="text"
                placeholder="출발지 (예: 부산항)"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                style={styles.input}
              />
              <button type="button" style={styles.cta} onClick={handleDepartureConfirm}>
                📍 확인
              </button>
            </div>

            <div style={styles.row}>
              <input
                type="text"
                placeholder="도착지 (예: 도쿄항)"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                style={styles.input}
              />
              <button type="button" style={styles.cta} onClick={handleArrivalConfirm}>
                📍 확인
              </button>
            </div>

            <div style={styles.twoCol}>
              <div>
                <div>속도 (kn)</div>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="예: 14"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value === '' ? '' : Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              <div>
                <div>적재율 (%)</div>
                <div style={styles.sliderWrap}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={payload}
                    onChange={(e) => setPayload(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ textAlign: 'right', color: colors.sub, fontWeight: 800 }}>
                    {payload}%
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.twoCol}>
              <div>
                <div>풍속 (m/s)</div>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="예: 8"
                  value={wind}
                  onChange={(e) => setWind(e.target.value === '' ? '' : Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              <div>
                <div>파고 (m)</div>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="예: 1.5"
                  value={wave}
                  onChange={(e) => setWave(e.target.value === '' ? '' : Number(e.target.value))}
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulation}
              style={{ ...styles.primary, ...(canSimulate ? {} : styles.primaryDisabled) }}
              disabled={!canSimulate}
            >
              시뮬레이션 실행 ▶
            </button>
          </div>

          {/* 우측 카드 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>🗺 경로 미리보기</div>
              <div style={styles.cardSub}>출발·도착지 확인 후 지도가 표시됩니다</div>
            </div>

            {departureLatLng || arrivalLatLng ? (
              <div style={styles.mapBox}>
                <MapView
                  departure={departureLatLng}
                  arrival={arrivalLatLng}
                  departureLabel={departure}
                  arrivalLabel={arrival}
                />
              </div>
            ) : (
              <div style={styles.empty}>지도가 여기에 표시됩니다</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Simulation;
