import React, { useEffect, useMemo, useState } from "react";

type Article = {
  title: string;
  url: string;
  source?: string;
  date?: string;
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {},
  controls: { display: "flex", gap: 8, margin: "8px 0 10px", flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: 220,
    padding: "10px 12px",
    border: "1px solid #e5eaf1",
    borderRadius: 10,
    fontSize: "0.95rem",
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #e5eaf1",
    borderRadius: 10,
    fontSize: "0.95rem",
    background: "#fff",
  },
  chk: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" },
  btn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  list: { display: "grid", gap: 10 },
  item: {
    border: "1px solid #e5eaf1",
    borderRadius: 12,
    padding: 12,
    background: "#fff",
  },
  title: { fontWeight: 800, color: "#0f172a", marginBottom: 4, lineHeight: 1.35 },
  meta: { fontSize: 12, color: "#64748b" },
  empty: {
    background: "#f9fbff",
    border: "1px dashed #e5eaf1",
    borderRadius: 12,
    color: "#64748b",
    padding: 14,
    fontSize: 13,
    lineHeight: 1.6,
  },
  hint: { fontSize: 12, color: "#94a3b8", marginBottom: 6 },
  moreWrap: { textAlign: "center", marginTop: 16 },
  moreBtn: {
    background: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 14,
    cursor: "pointer",
  },
};

// 해운/물류 기본 키워드 묶음
const MARITIME_BUNDLE =
  '(shipping OR maritime OR "sea transport" OR seaborne OR port OR "port authority" OR container OR logistics OR freight OR terminal OR vessel)';

const PAGE_SIZE = 8;
const HARD_LIMIT = 48;

function expandSynonyms(q: string): string {
  const t = q.trim();
  if (!t) return "";
  const lower = t.toLowerCase();
  if (t.includes("항만공사")) {
    return '(항만공사 OR 부산항만공사 OR 인천항만공사 OR 여수광양항만공사 OR 울산항만공사 OR "port authority")';
  }
  if (t.includes("항만")) return '(항만 OR 항만청 OR 항만물류 OR 항만정책 OR "seaport" OR port)';
  if (t.includes("물류")) return '(물류 OR 공급망 OR 물류센터 OR logistics OR "supply chain")';
  if (t.includes("해운") || lower.includes("shipping") || lower.includes("maritime"))
    return '(해운 OR 해상운송 OR 해운업 OR shipping OR maritime)';
  if (t.includes("선박") || lower.includes("vessel") || lower.includes("ship"))
    return '(선박 OR 선사 OR 선박운항 OR vessel OR ship)';
  if (t.includes("컨테이너") || lower.includes("container"))
    return '(컨테이너 OR 컨테이너선 OR container OR TEU OR terminal)';
  if (t.includes("운임") || lower.includes("freight"))
    return '(운임 OR 해상운임 OR 해운운임 OR freight OR spot rate)';
  if (t.includes("파업") || lower.includes("strike"))
    return '(파업 OR 노사분규 OR strike OR industrial action)';
  if (t.includes("항로") || lower.includes("route"))
    return '(항로 OR 항로변경 OR 항해경로 OR route)';
  if (lower.includes("연료") || lower.includes("fuel") || t.includes("벙커"))
    return "(연료 OR 벙커링 OR bunker OR fuel OR LNG OR methanol OR ammonia)";
  if (t.includes("탄소") || lower.includes("co2") || lower.includes("emission"))
    return "(탄소 OR 배출량 OR ETS OR emission OR decarbonization OR IMO)";
  if (/\s/.test(t)) return `"${t}"`;
  return t;
}

function normalizeFromGdelt(json: any): Article[] {
  const raw = json?.articles ?? json?.documents ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((a: any) => ({
    title: a.title ?? a.documenttitle ?? "(제목 없음)",
    url: a.url ?? a.docurl ?? "#",
    source: a.source ?? a.sourcename ?? a.sourcecountry ?? "",
    date: a.seendate ?? a.date ?? a.publishdate ?? "",
  }));
}

const NewsPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<"ko" | "en" | "all">("ko");
  const [preferKR, setPreferKR] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const filterClause = useMemo(() => {
    switch (lang) {
      case "ko":
        return preferKR ? "(sourcelang:Korean OR sourcecountry:KR)" : "sourcelang:Korean";
      case "en":
        return "sourcelang:English";
      default:
        return "";
    }
  }, [lang, preferKR]);

  async function safeParse(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    throw new Error(await res.text());
  }

  async function queryOnce(q: string): Promise<Article[]> {
    const url =
      "https://api.gdeltproject.org/api/v2/doc/doc?" +
      `query=${encodeURIComponent(q)}` +
      "&mode=ArtList&format=json&maxrecords=50&sort=DateDesc&timespan=7d";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`뉴스 요청 실패 (${res.status})`);
    const json = await safeParse(res);
    return normalizeFromGdelt(json);
  }

  async function fetchNews(userInput: string, initial = false) {
    setLoading(true);
    setErr(null);
    setItems([]);
    setVisibleCount(PAGE_SIZE);

    try {
      const userSyn = expandSynonyms(userInput || "");
      const clauses: string[] = [];

      if (userSyn) {
        clauses.push(filterClause ? `${userSyn} AND ${filterClause}` : userSyn);
        clauses.push(`${userSyn} AND ${MARITIME_BUNDLE}`);
      } else {
        clauses.push(filterClause ? `${MARITIME_BUNDLE} AND ${filterClause}` : MARITIME_BUNDLE);
      }

      const seen = new Set<string>();
      const agg: Article[] = [];

      for (const c of clauses) {
        try {
          const part = await queryOnce(c);
          for (const a of part) {
            if (!a.url || seen.has(a.url)) continue;
            seen.add(a.url);
            agg.push(a);
            if (agg.length >= HARD_LIMIT) break;
          }
          if (agg.length >= HARD_LIMIT) break;
        } catch {
          continue;
        }
      }

      if (!agg.length) {
        setErr(initial ? "최근 7일 내 관련 기사가 없습니다." : "검색 결과가 없습니다.");
        return;
      }

      setItems(agg);
    } catch (e: any) {
      setErr(e?.message || "뉴스 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews("", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.hint}>지난 7일 기준 · 최신순</div>

      <div style={styles.controls}>
        <input
          style={styles.input}
          type="text"
          placeholder="예: 항만, 해운, 항만공사, 컨테이너, 운임, 파업, 탄소 규제 ..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchNews(query)}
        />

        <select style={styles.select} value={lang} onChange={e => setLang(e.target.value as any)}>
          <option value="ko">한국어만</option>
          <option value="en">영어만</option>
          <option value="all">모든 언어</option>
        </select>

        <label style={styles.chk}>
          <input
            type="checkbox"
            checked={preferKR}
            onChange={e => setPreferKR(e.target.checked)}
            disabled={lang !== "ko"}
          />
          국내 매체 포함
        </label>

        <button style={styles.btn} onClick={() => fetchNews(query)}>
          {loading ? "검색중…" : "검색"}
        </button>
      </div>

      {err && <div style={styles.empty}>⚠️ {err}</div>}

      <div style={styles.list}>
        {items.slice(0, visibleCount).map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={styles.item}>
              <div style={styles.title}>{a.title}</div>
              <div style={styles.meta}>
                {a.source ? `${a.source} · ` : ""}
                {a.date || ""}
              </div>
            </div>
          </a>
        ))}
      </div>

      {!loading && items.length > visibleCount && (
        <div style={styles.moreWrap}>
          <button
            style={styles.moreBtn}
            onClick={() =>
              setVisibleCount(prev => Math.min(prev + PAGE_SIZE, items.length))
            }
          >
            더보기 ▾
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPanel;
