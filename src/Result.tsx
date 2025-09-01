// src/Result.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface RouteState {
  departure: string;
  arrival: string;
  speed: number;
  loadRate: number;              // 사용 안 하지만 타입은 유지
  cargo: string;                 // TEU
  departureDate: Date | string;
  arrivalDate: Date | string;
}

const COLORS = {
  ink: '#0b1220',
  text: '#0f172a',
  sub: '#64748b',
  brand: '#22c55e',
  blue: '#2563eb',
  accent: '#1163c6',
  page: '#f6fbff',
  card: '#ffffff',
  border: '#e5eaf1',
};

const dot = (bg: string): React.CSSProperties => ({
  width: 7,
  height: 7,
  borderRadius: 999,
  background: bg,
});

const S = {
  page: {
    minHeight: '100vh',
    background: `radial-gradient(800px 400px at 50% -170px, #e9f7ff 0%, rgba(233,247,255,0) 60%), ${COLORS.page}`,
    padding: '24px 14px 54px',
  } as React.CSSProperties,
  wrap: { maxWidth: 720, margin: '0 auto' } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  } as React.CSSProperties,
  h1: {
    fontWeight: 900,
    fontSize: '0.9rem',
    color: COLORS.accent,
  } as React.CSSProperties,
  crumb: { color: COLORS.sub, fontSize: '0.61rem' },

  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 13,
    boxShadow: '0 9px 20px rgba(2,6,23,0.06)',
    padding: 15,
  } as React.CSSProperties,

  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 9,
    marginTop: 9,
  } as React.CSSProperties,
  metric: {
    background: '#ffffff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: '9px 10px',
  } as React.CSSProperties,
  metricLabel: { color: COLORS.sub, fontSize: 8.5 } as React.CSSProperties,
  metricValue: {
    color: COLORS.text,
    fontWeight: 900,
    fontSize: 13,
    marginTop: 4,
  } as React.CSSProperties,

  hr: {
    height: 1,
    background: COLORS.border,
    border: 0,
    margin: '12px 0',
  } as React.CSSProperties,

  infoBanner: {
    background: '#e7f3ff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: '8px 9px',
    marginTop: 5,
    color: COLORS.text,
    fontSize: '0.9rem',
  } as React.CSSProperties,

  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: '12px 0 5px',
  } as React.CSSProperties,
  sectionTitle: {
    fontWeight: 900,
    color: COLORS.text,
    fontSize: '0.7rem',
  } as React.CSSProperties,
  sectionDesc: {
    color: COLORS.sub,
    fontSize: '0.61rem',
  } as React.CSSProperties,

  legendRow: {
    display: 'flex',
    gap: 5,
    flexWrap: 'wrap',
    marginBottom: 5,
  } as React.CSSProperties,
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 7px',
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: '#fff',
    fontSize: '0.58rem',
    color: COLORS.text,
  } as React.CSSProperties,

  embedShell: {
    borderRadius: 10,
    border: `1px dashed ${COLORS.border}`,
    background: 'linear-gradient(180deg, #fbfdff 0%, #f7fbff 60%)',
    overflow: 'hidden',
  } as React.CSSProperties,
  embedTopBar: {
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    borderBottom: `1px solid ${COLORS.border}`,
    background: '#ffffff',
  } as React.CSSProperties,
  embedTopLabel: {
    fontWeight: 800,
    color: COLORS.sub,
    fontSize: '0.6rem',
  } as React.CSSProperties,
  embedTopStatus: {
    height: 4,
    width: 80,
    background: '#eef2f7',
    borderRadius: 999,
    overflow: 'hidden',
  } as React.CSSProperties,
  embedTopFill: {
    height: '100%',
    width: '55%',
    background: COLORS.brand,
  } as React.CSSProperties,
  embedBody: {
    height: 240,
    display: 'grid',
    placeItems: 'center',
    color: COLORS.sub,
    textAlign: 'center',
    padding: '0 10px',
  } as React.CSSProperties,

  graphTitle: {
    fontWeight: 900,
    color: COLORS.text,
    margin: '12px 0 7px',
    fontSize: '1rem',
  } as React.CSSProperties,

  btnRow: { textAlign: 'center', marginTop: 14 } as React.CSSProperties,
  btn: {
    background: COLORS.brand,
    color: '#fff',
    border: 'none',
    padding: '8px 10px',
    borderRadius: 7,
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '0.9rem',
  } as React.CSSProperties,
};

function formatDate(date: Date | string | undefined): string {
  if (!date) return '-';
  try {
    if (typeof date === 'string') {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch {
    return '-';
  }
}

function Result(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as RouteState | null;

  // 고정 값
  const CO2_FIXED = 0.101;         // kg/km
  const SPEED_FIXED = 12;          // kn
  const co2Text = CO2_FIXED.toFixed(3);

  const chartData = {
    labels: ['속도 10', '속도 11', '속도 12', '속도 13', '속도 14'],
    datasets: [
      {
        label: '예상 탄소 배출량 (kg)',
        data: [
          CO2_FIXED * 0.1,
          CO2_FIXED * 0.3,
          CO2_FIXED * 0.6,
          CO2_FIXED * 0.85,
          CO2_FIXED,
        ],
        backgroundColor: '#2979ff',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.header}>
          <div>
            <div style={S.h1}>시뮬레이션 결과</div>
            <div style={S.crumb}>조건 입력 → 경로/권고 확인 → 결과</div>
          </div>
        </div>

        <div style={S.card}>
          {/* 메트릭 카드: 적재율/풍속·파고 제거, 적재량만 표시 */}
          {data && (
            <div style={S.metrics}>
              <div style={S.metric}>
                <div style={S.metricLabel}>예상 탄소배출 강도</div>
                <div style={S.metricValue}>{co2Text} kg/km</div>
              </div>
              <div style={S.metric}>
                <div style={S.metricLabel}>평균 속도</div>
                <div style={S.metricValue}>{SPEED_FIXED} kn</div>
              </div>
              <div style={S.metric}>
                <div style={S.metricLabel}>적재량</div>
                <div style={S.metricValue}>
                  {data.cargo ? `${data.cargo} TEU` : '-'}
                </div>
              </div>
              <div style={S.metric}>
                <div style={S.metricLabel}>출발/도착 날짜</div>
                <div style={S.metricValue}>
                  {formatDate(data.departureDate)} / {formatDate(data.arrivalDate)}
                </div>
              </div>
            </div>
          )}

          {/* 요약 */}
          {data ? (
            <div style={{ marginTop: 8, color: COLORS.text, lineHeight: 1.5, fontSize: '0.9rem' }}>
              <div><b>출발지:</b> {data.departure}</div>
              <div><b>도착지:</b> {data.arrival}</div>
            </div>
          ) : (
            <p style={{ color: 'red', marginTop: 8, fontSize: '0.9rem' }}>
              ⚠️ 시뮬레이션 데이터를 찾을 수 없습니다.
            </p>
          )}

          <hr style={S.hr} />

          {/* 하단 배너: 총 배출량 고정 */}
          {data && (
            <div style={S.infoBanner}>
              🌿 <b>예상 총 탄소배출량:</b>{' '}
              <span style={{ color: COLORS.accent }}>1767.077 kg/CO2</span>
              <div style={{ color: COLORS.sub, marginTop: 2, fontSize: '0.8rem' }}>
                ※ 단순 예측 기준으로, 실제 배출량은 항로/기상/운항 조건에 따라 달라질 수 있습니다.
              </div>
            </div>
          )}

          {/* 추천 항로 섹션 + 이미지 임베드 */}
          <div style={S.sectionHead}>
            <div style={S.sectionTitle}>🧭 추천 항로</div>
            <div style={S.sectionDesc}>
              아래 영역은 <b>외부 서버</b>에서 제공하는 지도를 임베드하는 자리입니다.
            </div>
          </div>

          <div style={S.legendRow}>
            <span style={S.chip}><span style={dot(COLORS.brand)} /> 추천 경로</span>
            <span style={S.chip}><span style={dot(COLORS.blue)} /> 대체 경로</span>
            <span style={S.chip}><span style={dot('#f59e0b')} /> 기상 주의</span>
          </div>

          <div style={S.embedShell}>
            <div style={S.embedTopBar}>
              <div style={S.embedTopLabel}>GreenShipping 경로</div>
              <div style={S.embedTopStatus}><div style={S.embedTopFill} /></div>
            </div>
            {/* public/photo.png를 자연스럽게 채움 */}
            <div id="recommended-route-embed" style={{ ...S.embedBody, display: 'block', padding: 0 }}>
              <img
                src="/photo.png"
                alt="GreenShipping 경로 미리보기"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* 그래프 */}
          <div style={S.graphTitle}>📈 예상 배출량 그래프</div>
          <Bar
            data={chartData}
            options={{
              plugins: { legend: { display: false } },
              responsive: true,
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: '#eef2f7' } },
              },
            }}
          />

          {/* 버튼 */}
          <div style={S.btnRow}>
            <button
              style={S.btn}
              onClick={() => data && navigate('/report', { state: data })}
            >
              📄 ESG 보고서 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
