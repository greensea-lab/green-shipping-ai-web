import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapView from './components/MapView';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: `radial-gradient(600px 300px at 50% -100px, #e9f7ff 0%, rgba(233,247,255,0) 60%), ${colors.page}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    width: '100%',
    maxWidth: '1000px', // 더 작게!
    minWidth: '500px',
    margin: '0 auto',
    padding: '24px 0 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  title: { fontSize: '1.4rem', fontWeight: 900, color: colors.text, textAlign: 'center' },
  subtitle: { color: colors.sub, fontSize: '0.95rem', textAlign: 'center' },

  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    alignItems: 'stretch',
    justifyItems: 'stretch',
    minHeight: '340px',
    maxHeight: '480px',
  },
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    boxShadow: '0 6px 15px rgba(2,6,23,0.04)',
    padding: '18px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 12,
    height: '100%',
    minHeight: '260px',
    boxSizing: 'border-box',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  cardTitle: { fontSize: '1rem', fontWeight: 900, color: colors.text },
  cardSub: { fontSize: '0.9rem', color: colors.sub },

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 60px',
    gap: 7,
    alignItems: 'center',
    marginBottom: 7,
  },
  input: {
    width: '100%',
    padding: '0.55rem 0.8rem',
    fontSize: '0.9rem',
    borderRadius: 7,
    border: `1px solid ${colors.border}`,
    background: '#fff',
    boxSizing: 'border-box',
  },
  cta: {
    padding: '0.5rem 0.8rem',
    borderRadius: 7,
    border: 'none',
    background: colors.blue,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap' as const,
  },
  fuelButton: {
    display: 'inline-block',
    padding: '0.45rem 0.9rem',
    borderRadius: '6px',
    background: colors.blue,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: '6px',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    border: 'none',
  },
  fuelButtonSelected: {
    display: 'inline-block',
    padding: '0.45rem 0.9rem',
    borderRadius: '6px',
    background: colors.brand,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: '6px',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    border: 'none',
  },
  mapBox: {
    width: '100%',
    height: '220px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f9f9fb',
    marginTop: '8px',
  },
  empty: {
    width: '100%',
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.sub,
    background: '#f9f9fb',
    borderRadius: '8px',
    fontSize: '0.95rem',
  },
  primary: {
    padding: '0.7rem',
    borderRadius: 9,
    border: 'none',
    background: colors.brand,
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    marginTop: '12px',
    fontSize: '0.95rem',
    width: '100%',
    transition: 'background 0.2s',
  },
  primaryDisabled: {
    background: '#cbd5e1',
    color: '#fff',
    cursor: 'not-allowed',
  },
};

const CustomDateInput = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
  (props, ref) => (
    <input
      {...props}
      ref={ref}
      style={{
        ...styles.input,
        fontSize: '0.9rem',
        padding: '0.55rem 0.8rem',
      }}
      className="date-picker"
      readOnly
    />
  )
);

function Simulation(): JSX.Element {
  const navigate = useNavigate();

  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureLatLng, setDepartureLatLng] = useState<LatLng | null>(null);
  const [arrivalLatLng, setArrivalLatLng] = useState<LatLng | null>(null);

  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [cargo, setCargo] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<string>('');

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
        departureDate,
        arrivalDate,
        cargo,
        selectedFuel,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.centerWrap}>
        <div style={styles.header}>
          <div style={styles.title}>시뮬레이션</div>
          <div style={styles.subtitle}>조건 입력 → 경로 확인 → 결과</div>
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
                onChange={e => setDeparture(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                style={styles.cta}
                onClick={handleDepartureConfirm}
              >
                📍 확인
              </button>
            </div>
            <div style={styles.row}>
              <input
                type="text"
                placeholder="도착지 (예: 도쿄항)"
                value={arrival}
                onChange={e => setArrival(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                style={styles.cta}
                onClick={handleArrivalConfirm}
              >
                📍 확인
              </button>
            </div>
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.9rem' }}>출발 날짜</div>
              <DatePicker
                selected={departureDate}
                onChange={setDepartureDate}
                dateFormat="yyyy-MM-dd"
                className="date-picker"
                popperPlacement="bottom"
                customInput={<CustomDateInput />}
              />
            </div>
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.9rem' }}>도착 날짜</div>
              <DatePicker
                selected={arrivalDate}
                onChange={setArrivalDate}
                dateFormat="yyyy-MM-dd"
                className="date-picker"
                popperPlacement="bottom"
                customInput={<CustomDateInput />}
              />
            </div>
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.9rem' }}>적재량 (ex_1023):</div>
              <input
                type="text"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                placeholder="예: ex_1023"
                style={styles.input}
              />
            </div>
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.9rem' }}>연료 선택</div>
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedFuel('HFO')}
                  style={selectedFuel === 'HFO' ? styles.fuelButtonSelected : styles.fuelButton}
                >
                  HFO
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFuel('MGO/MDO')}
                  style={selectedFuel === 'MGO/MDO' ? styles.fuelButtonSelected : styles.fuelButton}
                >
                  MGO/MDO
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFuel('LNG')}
                  style={selectedFuel === 'LNG' ? styles.fuelButtonSelected : styles.fuelButton}
                >
                  LNG
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFuel('Methanol')}
                  style={selectedFuel === 'Methanol' ? styles.fuelButtonSelected : styles.fuelButton}
                >
                  Methanol
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSimulation}
              style={{
                ...styles.primary,
                ...(canSimulate ? {} : styles.primaryDisabled),
              }}
              disabled={!canSimulate}
            >
              시뮬레이션 실행 ▶
            </button>
          </div>
          {/* 우측 카드 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>🗺 경로 미리보기</div>
              <div style={styles.cardSub}>
                출발·도착지 확인 후 지도가 표시됩니다
              </div>
            </div>
            {(departureLatLng || arrivalLatLng) ? (
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