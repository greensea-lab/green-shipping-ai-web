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
    background: `radial-gradient(800px 400px at 50% -150px, #e9f7ff 0%, rgba(233,247,255,0) 60%), ${colors.page}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    width: '100%',
    maxWidth: '1066px', // 2/3 of 1600px
    minWidth: '666px', // 2/3 of 1000px
    margin: '0 auto',
    padding: '32px 0 32px', // 2/3 of 48px
    display: 'flex',
    flexDirection: 'column',
    gap: 25, // 2/3 of 38px
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5, // 2/3 of 8px
    marginBottom: 9, // 2/3 of 14px
  },
  title: { fontSize: '1.8rem', fontWeight: 900, color: colors.text, textAlign: 'center' }, // 2/3 of 2.7rem
  subtitle: { color: colors.sub, fontSize: '0.98rem', textAlign: 'center' }, // 2/3 of 1.47rem

  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 29, // 2/3 of 44px
    alignItems: 'stretch',
    justifyItems: 'stretch',
    minHeight: '466px', // 2/3 of 700px
    maxHeight: '622px', // 2/3 of 933px
  },
  card: {
    background: colors.card,
    border: `2px solid ${colors.border}`,
    borderRadius: 16, // 2/3 of 24px
    boxShadow: '0 7px 16px rgba(2,6,23,0.04)', // 2/3 of 10px/24px
    padding: '28px 24px', // 2/3 of 42px/37px
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 16, // 2/3 of 24px
    height: '100%',
    minHeight: '426px', // 2/3 of 640px
    boxSizing: 'border-box',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 9, // 2/3 of 13px
  },
  cardTitle: { fontSize: '1.07rem', fontWeight: 900, color: colors.text }, // 2/3 of 1.6rem
  cardSub: { fontSize: '0.89rem', color: colors.sub }, // 2/3 of 1.33rem

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px', // 2/3 of 120px
    gap: 9, // 2/3 of 13px
    alignItems: 'center',
    marginBottom: 9, // 2/3 of 13px
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.98rem', // 2/3 of 1.13rem/1.47rem
    fontSize: '0.96rem', // 2/3 of 1.44rem
    borderRadius: 8, // 2/3 of 13px
    border: `2px solid ${colors.border}`,
    background: '#fff',
    boxSizing: 'border-box',
  },
  cta: {
    padding: '0.67rem 1.07rem', // 2/3 of 1rem/1.6rem
    borderRadius: 8, // 2/3 of 13px
    border: 'none',
    background: colors.blue,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.89rem', // 2/3 of 1.33rem
    whiteSpace: 'nowrap' as const,
  },
  fuelButton: {
    display: 'inline-block',
    padding: '0.58rem 1.07rem', // 2/3 of 0.87rem/1.6rem
    borderRadius: '7px', // 2/3 of 11px
    background: colors.blue,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: '7px', // 2/3 of 11px
    fontSize: '0.89rem', // 2/3 of 1.33rem
    textAlign: 'center' as const,
    border: 'none',
  },
  fuelButtonSelected: {
    display: 'inline-block',
    padding: '0.58rem 1.07rem',
    borderRadius: '7px',
    background: colors.brand,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: '7px',
    fontSize: '0.89rem',
    textAlign: 'center' as const,
    border: 'none',
  },
  mapBox: {
    width: '100%',
    height: '311px', // 2/3 of 467px
    borderRadius: '11px', // 2/3 of 16px
    overflow: 'hidden',
    background: '#f9f9fb',
    marginTop: '11px', // 2/3 of 16px
  },
  empty: {
    width: '100%',
    height: '311px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.sub,
    background: '#f9f9fb',
    borderRadius: '11px',
    fontSize: '0.98rem', // 2/3 of 1.47rem
  },
  primary: {
    padding: '0.89rem', // 2/3 of 1.33rem
    borderRadius: 11, // 2/3 of 16px
    border: 'none',
    background: colors.brand,
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    marginTop: '14px', // 2/3 of 21px
    fontSize: '0.98rem', // 2/3 of 1.47rem
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
        fontSize: '0.96rem',
        padding: '0.75rem 0.98rem',
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

  // 필수값 체크: 출발/도착지 위치, 날짜, 적재량, 연료 선택
  const canSimulate =
    departureLatLng &&
    arrivalLatLng &&
    departure &&
    arrival &&
    departureDate &&
    arrivalDate &&
    cargo &&
    selectedFuel;

  // EI_api 연결
  const handleSimulation = async () => {
    if (!canSimulate) return alert('필수 정보를 모두 입력하고 위치를 확인하세요.');

    // 날짜를 yyyy-MM-dd 포맷으로 변환
    const formatDate = (date: Date | null) =>
      date ? date.toISOString().slice(0, 10) : '';

    // API 스키마에 맞는 payload
    const payloadToApi = {
      origin: departure,
      dest: arrival,
      teu_loaded: Number(cargo),
      fuel: selectedFuel === 'MGO/MDO' ? 'MGO' : selectedFuel, // API는 MGO만 인식
      departure_date: formatDate(departureDate),
      arrival_date: formatDate(arrivalDate),
    };

    try {
      const res = await axios.post('http://localhost:8000/api/v2/ei', payloadToApi);

      // 결과 페이지로 이동하며 응답값 전달
      navigate('/result', {
        state: {
          departure,
          arrival,
          departureDate: formatDate(departureDate),
          arrivalDate: formatDate(arrivalDate),
          cargo,
          selectedFuel,
          apiResult: res.data,
        },
      });
    } catch (err: any) {
      alert(
        '시뮬레이션 API 호출에 실패했습니다.\n' +
        (err?.response?.data?.detail || err.message)
      );
      console.error(err);
    }
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
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.89rem' }}>출발 날짜</div>
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
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.89rem' }}>도착 날짜</div>
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
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.89rem' }}>적재량 (TEU)</div>
              <input
                type="number"
                min={1}
                step={1}
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                placeholder="예: 1023"
                style={styles.input}
              />
            </div>
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 700, fontSize: '0.89rem' }}>연료 선택</div>
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