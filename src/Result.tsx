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
  loadRate: number;
  windSpeed: number;
  waveHeight: number;
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

// ✅ 칩 점 스타일 유틸 (함수는 스타일 객체 밖에서)
const dot = (bg: string): React.CSSProperties => ({
  width: 10,
  height: 10,
  borderRadius: 999,
  background: bg,
});

const S = {
  page: {
    minHeight: '100vh',
    background: `radial-gradient(1200px 600px at 50% -260px, #e9f7ff 0%, rgba(233,247,255,0) 60%), ${COLORS.page}`,
    padding: '36px 20px 80px',
  } as React.CSSProperties,
  wrap: { maxWidth: 1080, margin: '0 auto' } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  } as React.CSSProperties,
  h1: { fontWeight: 900, fontSize: '1.35rem', color: COLORS.accent } as React.CSSProperties,
  crumb: { color: COLORS.sub, fontSize: '0.92rem' } as React.CSSProperties,

  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 20,
    boxShadow: '0 14px 30px rgba(2,6,23,0.06)',
    padding: 22,
  } as React.CSSProperties,

  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
    marginTop: 14,
  } as React.CSSProperties,
  metric: {
    background: '#ffffff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: '14px 16px',
  } as React.CSSProperties,
  metricLabel: { color: COLORS.sub, fontSize: 13 } as React.CSSProperties,
  metricValue: { color: COLORS.text, fontWeight: 900, fontSize: 20, marginTop: 6 } as React.CSSProperties,

  hr: { height: 1, background: COLORS.border, border: 0, margin: '18px 0' } as React.CSSProperties,

  infoBanner: {
    background: '#e7f3ff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '12px 14px',
    marginTop: 8,
    color: COLORS.text,
  } as React.CSSProperties,

  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: '18px 0 8px',
  } as React.CSSProperties,
  sectionTitle: { fontWeight: 900, color: COLORS.text, fontSize: '1.05rem' } as React.CSSProperties,
  sectionDesc: { color: COLORS.sub, fontSize: '0.92rem' } as React.CSSProperties,

  legendRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 } as React.CSSProperties,
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: '#fff',
    fontSize: '0.88rem',
    color: COLORS.text,
  } as React.CSSProperties,

  embedShell: {
    borderRadius: 16,
    border: `1px dashed ${COLORS.border}`,
    background: 'linear-gradient(180deg, #fbfdff 0%, #f7fbff 60%)',
    overflow: 'hidden',
  } as React.CSSProperties,
  embedTopBar: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    borderBottom: `1px solid ${COLORS.border}`,
    background: '#ffffff',
  } as React.CSSProperties,
  embedTopLabel: { fontWeight: 800, color: COLORS.sub, fontSize: '0.9rem' } as React.CSSProperties,
  embedTopStatus: {
    height: 6,
    width: 120,
    background: '#eef2f7',
    borderRadius: 999,
    overflow: 'hidden',
  } as React.CSSProperties,
  embedTopFill: { height: '100%', width: '55%', background: COLORS.brand } as React.CSSProperties,
  embedBody: {
    height: 360,
    display: 'grid',
    placeItems: 'center',
    color: COLORS.sub,
    textAlign: 'center',
    padding: '0 16px',
  } as React.CSSProperties,

  guide: {
    marginTop: 10,
    padding: 12,
    background: '#fff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    fontSize: 12.5,
    color: COLORS.sub,
  } as React.CSSProperties,

  graphTitle: { fontWeight: 900, color: COLORS.text, margin: '18px 0 10px' } as React.CSSProperties,

  btnRow: { textAlign: 'center', marginTop: 22 } as React.CSSProperties,
  btn: {
    background: COLORS.brand,
    color: '#fff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: 10,
    fontWeight: 900,
    cursor: 'pointer',
  } as React.CSSProperties,
};

function Result(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as RouteState | null;

  const estimateCO2 = ({
                         speed, loadRate, windSpeed,
                       }: Pick<RouteState, 'speed' | 'loadRate' | 'windSpeed'>): string => {
    const base = 2.7;
    const val = base * (1 + speed / 100) * (loadRate / 100) * (1 + windSpeed / 20);
    return val.toFixed(2);
  };

  const co2 = data ? estimateCO2(data) : null;

  const chartData = {
    labels: ['출발지', '1/4 거리', '절반', '3/4 거리', '도착지'],
    datasets: [
      {
        label: '예상 탄소 배출량 (kg)',
        data: data
          ? [Number(co2) * 0.1, Number(co2) * 0.3, Number(co2) * 0.6, Number(co2) * 0.85, Number(co2)]
          : [],
        backgroundColor: '#2979ff',
        borderRadius: 6,
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
          {/* 메트릭 카드 */}
          {data && (
            <div style={S.metrics}>
              <div style={S.metric}>
                <div style={S.metricLabel}>예상 탄소 배출량</div>
                <div style={S.metricValue}>{co2} kg/km</div>
              </div>
              <div style={S.metric}>
                <div style={S.metricLabel}>속도</div>
                <div style={S.metricValue}>{data.speed} kn</div>
              </div>
              <div style={S.metric}>
                <div style={S.metricLabel}>적재율</div>
                <div style={S.metricValue}>{data.loadRate}%</div>
              </div>
              <div style={S.metric}>
                <div style={S.metricLabel}>풍속 / 파고</div>
                <div style={S.metricValue}>
                  {data.windSpeed} m/s / {data.waveHeight} m
                </div>
              </div>
            </div>
          )}

          {/* 요약 */}
          {data ? (
            <div style={{ marginTop: 12, color: COLORS.text, lineHeight: 1.8 }}>
              <div><b>출발지:</b> {data.departure}</div>
              <div><b>도착지:</b> {data.arrival}</div>
            </div>
          ) : (
            <p style={{ color: 'red', marginTop: 12 }}>⚠️ 시뮬레이션 데이터를 찾을 수 없습니다.</p>
          )}

          <hr style={S.hr} />

          {/* 배너 */}
          {data && (
            <div style={S.infoBanner}>
              🌿 <b>예상 배출량:</b> <span style={{ color: COLORS.accent }}>{co2} kg/km</span>
              <div style={{ color: COLORS.sub, marginTop: 4 }}>
                ※ 단순 예측 기준으로, 실제 배출량은 항로/기상/운항 조건에 따라 달라질 수 있습니다.
              </div>
            </div>
          )}

          {/* 추천 항로 (외부 임베드 전용 칸) */}
          <div style={S.sectionHead}>
            <div style={S.sectionTitle}>🧭 추천 항로</div>
            <div style={S.sectionDesc}>
              아래 영역은 <b>외부 서버</b>에서 제공하는 지도를 임베드하는 자리입니다.
            </div>
          </div>

          {/* 간단 범례 */}
          <div style={S.legendRow}>
            <span style={S.chip}><span style={dot(COLORS.brand)} /> 추천 경로</span>
            <span style={S.chip}><span style={dot(COLORS.blue)} /> 대체 경로</span>
            <span style={S.chip}><span style={dot('#f59e0b')} /> 기상 주의</span>
          </div>

          {/* 임베드 셸 */}
          <div style={S.embedShell}>
            <div style={S.embedTopBar}>
              <div style={S.embedTopLabel}>GreenShipping 경로</div>
              <div style={S.embedTopStatus}><div style={S.embedTopFill} /></div>
            </div>

            {/* ⬇️ 외부 서버가 이 컨테이너에 지도 삽입 */}
            <div id="recommended-route-embed" style={S.embedBody}>
              <div>
                <div style={{ fontWeight: 800, color: COLORS.text }}>
                  여기로 외부 지도가 주입될 예정입니다
                </div>
                <div style={{ color: COLORS.sub, marginTop: 6 }}>
                  컨테이너 ID: <b>#recommended-route-embed</b>
                </div>
              </div>
            </div>
          </div>

          {/* 가이드 (원하면 삭제 가능) */}
          <div style={S.guide}>
            <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.text }}>임베드 가이드</div>
            <div>외부 페이지에서 다음과 같은 방식으로 주입 가능합니다.</div>
            <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
{`// 방법 1) iframe
<iframe src="https://your-map-server.example.com/route?from=${data?.departure}&to=${data?.arrival}"
        width="100%" height="360" style="border:0;border-radius:12px"></iframe>

// 방법 2) 스크립트 마운트
<script src="https://your-map-server.example.com/embed.js"></script>
<script>
  window.GreenMap.mount('#recommended-route-embed', {
    from: '${data?.departure}', to: '${data?.arrival}'
  });
</script>`}
            </pre>
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
