import { useMemo, useState, useRef, useEffect } from "react"

function money(v) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency", currency: "CAD", minimumFractionDigits: 2,
  }).format(Number(v || 0))
}

const GAMES = [
  "Pokemon", "Magic: the Gathering", "One Piece", "Lorcana",
  "Gundam", "Pokemon Japanese", "Digimon", "Star Wars: Unlimited",
  "Weiss", "Vanguard", "Riftbound",
]

const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Figtree:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0a0a0a;
  --ink-2: #1c1c1c;
  --ink-3: #2e2e2e;
  --mid: #6b6b6b;
  --rule: #e2e2e2;
  --bg: #f5f4f1;
  --white: #ffffff;
  --accent: #ff3d2e;
  --cash: #1a7a4a;
  --credit: #1a4a7a;
  --mono: 'Syne Mono', monospace;
  --sans: 'Figtree', sans-serif;
  --display: 'Syne', sans-serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html { font-size: 16px; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* NAV */
nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(245,244,241,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--rule);
  display: flex; align-items: center;
  padding: 0 28px; height: 54px; gap: 20px;
}

.nav-logo {
  font-family: var(--display);
  font-size: 16px; font-weight: 800;
  color: var(--ink); text-decoration: none;
  letter-spacing: -0.5px; flex-shrink: 0;
}
.nav-logo span { color: var(--accent); }

.nav-sep { width: 1px; height: 20px; background: var(--rule); flex-shrink: 0; }

.game-scroll {
  display: flex; gap: 2px;
  overflow-x: auto; flex: 1;
  scrollbar-width: none;
  mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
  padding: 0 12px;
}
.game-scroll::-webkit-scrollbar { display: none; }

.game-tab {
  flex-shrink: 0; padding: 5px 13px; border-radius: 6px;
  font-family: var(--sans); font-size: 12.5px; font-weight: 500;
  color: var(--mid); background: transparent;
  border: none; cursor: pointer;
  transition: color 0.12s, background 0.12s;
  white-space: nowrap;
}
.game-tab:hover { color: var(--ink); background: rgba(0,0,0,0.04); }
.game-tab.active { color: var(--white); background: var(--ink); }

/* SEARCH */
.search-wrap {
  border-bottom: 1px solid var(--rule);
  background: var(--white);
  padding: 0 28px;
}
.search-form {
  display: flex; align-items: center; gap: 0;
}
.search-icon {
  color: #bbb; flex-shrink: 0; display: flex; align-items: center;
  padding-right: 16px;
}
.search-input {
  flex: 1; border: none; outline: none;
  font-family: var(--display);
  font-size: clamp(24px, 3.5vw, 40px);
  font-weight: 700; color: var(--ink);
  background: transparent;
  padding: 24px 0;
  letter-spacing: -1.5px;
  caret-color: var(--accent);
}
.search-input::placeholder { color: #d0cdc8; }

.search-btn {
  flex-shrink: 0; height: 42px; padding: 0 22px;
  background: var(--ink); color: var(--white);
  font-family: var(--sans); font-size: 13px; font-weight: 600;
  border: none; border-radius: 7px;
  cursor: pointer; letter-spacing: 0.01em;
  transition: background 0.12s, transform 0.08s;
  margin-left: 20px;
}
.search-btn:hover { background: #222; }
.search-btn:active { transform: scale(0.97); }
.search-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* RESULTS META */
.results-meta-bar {
  padding: 10px 28px;
  border-bottom: 1px solid var(--rule);
  display: flex; align-items: center; gap: 16px;
  min-height: 41px;
}
.results-label {
  font-family: var(--mono); font-size: 11.5px; color: var(--mid);
}
.results-label b { color: var(--ink); font-weight: 400; }

.loading-track {
  width: 160px; height: 2px;
  background: var(--rule); border-radius: 1px; overflow: hidden;
}
.loading-fill {
  height: 100%; background: var(--ink); border-radius: 1px;
  animation: sweep 0.9s ease-in-out infinite;
}
@keyframes sweep {
  0%   { width: 0%;   margin-left: 0;    }
  50%  { width: 55%;  margin-left: 22%;  }
  100% { width: 0%;   margin-left: 100%; }
}

.error-strip {
  padding: 11px 28px;
  background: #fff5f5; border-bottom: 1px solid #ffd4d0;
  font-family: var(--mono); font-size: 12px; color: #c0392b;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  border-left: 1px solid var(--rule);
}

.card-tile {
  position: relative; cursor: pointer;
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  background: var(--white);
  overflow: hidden;
  outline: none; border-top: none; border-left: none;
  text-align: left; color: inherit; font-family: inherit;
  display: flex; flex-direction: column;
  transition: background 0.15s;
}
.card-tile:hover { background: #fafaf8; }

.tile-img-wrap {
  width: 100%; aspect-ratio: 2.5/3.5;
  background: #edeae4; overflow: hidden; position: relative;
  flex-shrink: 0;
}
.tile-img {
  width: 100%; height: 100%; object-fit: cover;
  object-position: top center; display: block;
  transition: transform 0.5s var(--ease);
}
.card-tile:hover .tile-img { transform: scale(1.04); }

.tile-no-img {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 10px; color: #c0bdb8;
  letter-spacing: 0.1em;
}

.tile-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.3) 50%, transparent 100%);
  opacity: 0; transition: opacity 0.28s var(--ease);
  display: flex; flex-direction: column;
  justify-content: flex-end; padding: 14px;
}
.card-tile:hover .tile-overlay { opacity: 1; }

.overlay-lbl {
  font-family: var(--mono); font-size: 8.5px; color: rgba(255,255,255,0.45);
  text-transform: uppercase; letter-spacing: 0.13em; margin-bottom: 3px;
}
.overlay-cash {
  font-family: var(--display); font-size: 20px; font-weight: 800;
  color: #fff; letter-spacing: -0.5px; line-height: 1;
}
.overlay-credit {
  font-family: var(--mono); font-size: 10.5px; color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

.tile-body {
  padding: 11px 13px 13px;
  display: flex; flex-direction: column; gap: 4px; flex: 1;
}
.tile-name {
  font-family: var(--display); font-size: 12.5px; font-weight: 700;
  color: var(--ink); letter-spacing: -0.2px; line-height: 1.25;
}
.tile-sub {
  font-family: var(--mono); font-size: 10px; color: var(--mid);
}
.tile-foot {
  margin-top: auto; padding-top: 8px;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 10px;
  border-top: 1px solid var(--rule);
}
.tile-stores-count {
  font-family: var(--mono); font-size: 10px; color: var(--mid);
}
.tile-price-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.tile-best-cash {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--cash);
}
.tile-best-credit {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--credit);
}

/* EMPTY */
.empty-state {
  grid-column: 1 / -1;
  padding: 100px 28px; text-align: center;
}
.empty-state h2 {
  font-family: var(--display); font-size: 22px; font-weight: 700;
  color: var(--ink-3); margin-bottom: 8px; letter-spacing: -0.5px;
}
.empty-state p { font-size: 14px; color: var(--mid); }

/* =====================
   MODAL — DESKTOP
   ===================== */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(8,8,8,0.62);
  display: flex; align-items: center; justify-content: center;
  animation: bdfadein 0.2s ease;
}
@keyframes bdfadein { from { opacity: 0; } }

/* centered card, fixed size, rounded corners */
.modal {
  position: relative;
  width: min(880px, calc(100vw - 40px));
  height: min(600px, calc(100vh - 60px));
  background: var(--white);
  border-radius: 16px;
  display: flex; flex-direction: column;
  overflow: hidden;
  animation: modalpopin 0.28s var(--ease);
  box-shadow: 0 40px 120px rgba(0,0,0,0.32), 0 4px 16px rgba(0,0,0,0.1);
}
@keyframes modalpopin {
  from { transform: scale(0.94) translateY(16px); opacity: 0; }
  to   { transform: scale(1)    translateY(0);    opacity: 1; }
}

/* close button floats top-right over the image */
.modal-close-btn {
  position: absolute;
  top: 14px; right: 14px;
  z-index: 20;
  width: 30px; height: 30px;
  background: rgba(10,10,10,0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 50%;
  cursor: pointer;
  color: rgba(255,255,255,0.75);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; line-height: 1;
  transition: background 0.15s, color 0.15s;
}
.modal-close-btn:hover { background: rgba(10,10,10,0.8); color: #fff; }

.modal-layout {
  display: flex; flex: 1; overflow: hidden; min-height: 0;
}

/* ── LEFT IMAGE PANEL ── */
.modal-left {
  width: 260px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
}

/* image fills the entire left panel via absolute */
.modal-img-container {
  position: absolute;
  inset: 0;
}

.modal-card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  animation: imgreveal 0.45s var(--ease) both;
}
@keyframes imgreveal {
  from { transform: scale(1.07); opacity: 0; filter: blur(5px); }
  to   { transform: scale(1);    opacity: 1; filter: blur(0);   }
}

/* shine sweep across the image on open */
.modal-img-container::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.08) 50%, transparent 80%);
  animation: shinesweep 0.75s var(--ease) 0.1s both;
  pointer-events: none;
}
@keyframes shinesweep {
  from { transform: translateX(-140%); }
  to   { transform: translateX(200%); }
}

.modal-no-img {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 11px; color: #555;
}

/* name + chips float over gradient at the bottom of the image */
.modal-left-foot {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 2;
  padding: 56px 18px 20px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0,0,0,0.65) 35%,
    rgba(0,0,0,0.95) 100%
  );
}

.modal-card-name {
  font-family: var(--display); font-size: 14px; font-weight: 800;
  color: #fff; letter-spacing: -0.3px; line-height: 1.25;
  margin-bottom: 9px;
  animation: textrise 0.36s var(--ease) 0.1s both;
}
@keyframes textrise {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

.modal-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.chip {
  display: inline-block; padding: 3px 7px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  font-family: var(--mono); font-size: 9px;
  color: rgba(255,255,255,0.48);
  letter-spacing: 0.03em;
  animation: textrise 0.36s var(--ease) 0.18s both;
}

/* ── RIGHT PANEL ── */
.modal-right {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--rule);
}

.modal-right-head {
  padding: 18px 22px 14px;
  border-bottom: 1px solid var(--rule);
  flex-shrink: 0;
}
.modal-right-title {
  font-family: var(--display); font-size: 13px; font-weight: 700;
  color: var(--ink); letter-spacing: -0.2px;
}
.modal-right-sub {
  font-family: var(--mono); font-size: 11px; color: var(--mid); margin-top: 2px;
}

.modal-best {
  padding: 13px 22px;
  background: var(--ink);
  display: flex; gap: 28px; flex-shrink: 0;
}
.best-item { display: flex; flex-direction: column; gap: 2px; }
.best-lbl {
  font-family: var(--mono); font-size: 8.5px; color: rgba(255,255,255,0.35);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.best-val {
  font-family: var(--display); font-size: 17px; font-weight: 800;
  color: var(--white); letter-spacing: -0.5px;
}
.best-val.secondary { color: rgba(255,255,255,0.55); font-size: 15px; }

.modal-stores-scroll {
  flex: 1; overflow-y: auto; padding: 8px 0 20px;
}
.modal-stores-scroll::-webkit-scrollbar { width: 3px; }
.modal-stores-scroll::-webkit-scrollbar-thumb { background: #ddd; }

/* store rows */
.store-entry {
  padding: 13px 22px;
  border-bottom: 1px solid var(--rule);
}
.store-entry:last-child { border-bottom: none; }
.store-entry:hover { background: #fcfbfa; }

.store-entry-head {
  display: flex; align-items: center; gap: 9px; margin-bottom: 9px;
}
.rank-badge {
  width: 20px; height: 20px; border-radius: 4px;
  background: var(--bg); border: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 9.5px; color: var(--mid);
  flex-shrink: 0;
}
.rank-badge.first { background: var(--ink); border-color: var(--ink); color: #fff; }
.store-entry-name {
  font-size: 13px; font-weight: 600; color: var(--ink); flex: 1;
}
.store-entry-links { display: flex; gap: 5px; }
.entry-link {
  font-family: var(--mono); font-size: 10px; color: var(--mid);
  text-decoration: none; padding: 3px 8px;
  border: 1px solid var(--rule); border-radius: 4px;
  transition: color 0.1s, border-color 0.1s; white-space: nowrap;
}
.entry-link:hover { color: var(--ink); border-color: #aaa; }

.store-entry-prices {
  display: flex; gap: 18px; margin-bottom: 10px;
}
.price-col { display: flex; flex-direction: column; gap: 1px; }
.price-col-lbl {
  font-family: var(--mono); font-size: 8.5px; color: var(--mid);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.price-col-val {
  font-family: var(--mono); font-size: 13.5px; color: var(--ink);
}
.price-col-val.cash  { color: var(--cash); }
.price-col-val.credit { color: var(--credit); }

/* variants mini table */
.variants-table {
  background: var(--bg); border: 1px solid var(--rule);
  border-radius: 6px; overflow: hidden;
}
.vrow {
  display: grid;
  grid-template-columns: 1fr 80px 80px 80px;
  border-bottom: 1px solid var(--rule);
}
.vrow:last-child { border-bottom: none; }
.vrow.vhead { background: #ebe9e4; }
.vcell {
  padding: 6px 10px;
  font-family: var(--mono); font-size: 10px; color: var(--mid);
  border-right: 1px solid var(--rule);
  display: flex; align-items: center;
}
.vcell:last-child { border-right: none; }
.vcell.vname  { color: var(--ink); }
.vcell.vcash  { color: var(--cash); }
.vcell.vnum   { justify-content: flex-end; }
.vcell.vhead-lbl { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.07em; }

/* =====================
   MOBILE BOTTOM SHEET
   ===================== */
@media (max-width: 640px) {
  .modal-backdrop {
    align-items: flex-end;
  }

  .modal {
    width: 100%;
    margin-left: 0;
    max-height: 92dvh;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -12px 48px rgba(0,0,0,0.22);
    animation: sheetslideup 0.36s var(--ease);
  }

  @keyframes sheetslideup {
    from { transform: translateY(60px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .modal-layout {
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* drag handle */
  .modal-layout::before {
    content: '';
    display: block;
    width: 36px; height: 4px;
    background: #d0cdc8;
    border-radius: 2px;
    margin: 10px auto 0;
    flex-shrink: 0;
  }

  /* left panel becomes a full-width hero strip */
  .modal-left {
    width: 100%;
    height: 160px;
    flex-shrink: 0;
  }

  .modal-img-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .modal-left-foot {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 40px 16px 14px;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.92) 100%);
  }

  .modal-right {
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.07);
    overflow: visible;
  }

  .modal-stores-scroll {
    overflow: visible;
    padding-bottom: 40px;
  }

  .modal-close-btn {
    top: 10px; right: 10px;
  }
}

::selection { background: var(--ink); color: var(--white); }
`

export default function App() {
  const [query, setQuery] = useState("")
  const [selectedGame, setSelectedGame] = useState("Pokemon")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function runSearch(e) {
    e?.preventDefault?.()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/search?${new URLSearchParams({ q, game: selectedGame })}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Search failed")
      setData(json)
    } catch (err) {
      setError(err.message || "Search failed")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const cards = useMemo(() => {
    const list = Array.isArray(data?.cards) ? [...data.cards] : []

    return list.sort((a, b) => {
      const aCash = Math.max(...(a.stores || []).map(s => Number(s.cashPrice || 0)), 0)
      const bCash = Math.max(...(b.stores || []).map(s => Number(s.cashPrice || 0)), 0)

      const aCredit = Math.max(...(a.stores || []).map(s => Number(s.creditPrice || 0)), 0)
      const bCredit = Math.max(...(b.stores || []).map(s => Number(s.creditPrice || 0)), 0)

      if (bCash !== aCash) return bCash - aCash
      if (bCredit !== aCredit) return bCredit - aCredit
      if ((b.buylistCount || 0) !== (a.buylistCount || 0)) {
        return (b.buylistCount || 0) - (a.buylistCount || 0)
      }

      return String(a.name || "").localeCompare(String(b.name || ""))
    })
  }, [data])

  const modalStores = useMemo(() => {
    if (!selected) return []
    return [...(selected.stores || [])].sort((a, b) => {
      const d = Number(b.cashPrice || 0) - Number(a.cashPrice || 0)
      return d !== 0 ? d : Number(b.creditPrice || 0) - Number(a.creditPrice || 0)
    })
  }, [selected])

  const bestCash = useMemo(
    () => Math.max(...(selected?.stores || []).map(s => Number(s.cashPrice || 0)), 0),
    [selected]
  )

  const bestCredit = useMemo(
    () => Math.max(...(selected?.stores || []).map(s => Number(s.creditPrice || 0)), 0),
    [selected]
  )

  return (
    <>
      <style>{G}</style>

      <nav>
        <a className="nav-logo" href="/">buy<span>list</span></a>
        <div className="nav-sep" />
        <div className="game-scroll">
          {GAMES.map(g => (
            <button
              key={g}
              className={`game-tab${selectedGame === g ? " active" : ""}`}
              onClick={() => setSelectedGame(g)}
            >{g}</button>
          ))}
        </div>
      </nav>

      <div className="search-wrap">
        <form className="search-form" onSubmit={runSearch}>
          <span className="search-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7.5" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={inputRef}
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${selectedGame}…`}
            spellCheck={false}
            autoComplete="off"
          />
          <button className="search-btn" type="submit" disabled={loading}>
            {loading ? "Searching" : "Search"}
          </button>
        </form>
      </div>

      {error && <div className="error-strip">⚠ {error}</div>}

      {(data || loading) && !error && (
        <div className="results-meta-bar">
          {loading
            ? <div className="loading-track"><div className="loading-fill" /></div>
            : <span className="results-label"><b>{data?.totalCards || 0}</b> cards in {selectedGame}</span>
          }
        </div>
      )}

      <div className="grid">
        {!loading && !data && !error && (
          <div className="empty-state">
            <h2>Search to get started</h2>
            <p>Compare live cash and credit buylist prices across every major store.</p>
          </div>
        )}

        {!loading && data && cards.length === 0 && (
          <div className="empty-state">
            <h2>No results</h2>
            <p>Try a different card name, or switch the game above.</p>
          </div>
        )}

        {cards.map((card, i) => {
          const bCash = Math.max(...(card.stores || []).map(s => Number(s.cashPrice || 0)), 0)
          const bCredit = Math.max(...(card.stores || []).map(s => Number(s.creditPrice || 0)), 0)

          return (
            <button
              key={card.key || `${card.name}-${i}`}
              className="card-tile"
              onClick={() => setSelected(card)}
            >
              <div className="tile-img-wrap">
                {card.image
                  ? <img src={card.image} alt={card.name} className="tile-img" />
                  : <div className="tile-no-img">NO IMAGE</div>
                }
                <div className="tile-overlay">
                  <div className="overlay-lbl">Best cash offer</div>
                  <div className="overlay-cash">{money(bCash)}</div>
                  <div className="overlay-credit">Credit {money(bCredit)}</div>
                </div>
              </div>

              <div className="tile-body">
                <div className="tile-name">{card.name}</div>
                <div className="tile-sub">
                  {[card.setName, card.rarity].filter(Boolean).join(" · ")}
                </div>

                <div className="tile-foot">
                  <span className="tile-stores-count">
                    {card.buylistCount || 0} store{(card.buylistCount || 0) !== 1 ? "s" : ""}
                  </span>

                  <div className="tile-price-stack">
                    <span className="tile-best-cash">Cash {money(bCash)}</span>
                    <span className="tile-best-credit">Credit {money(bCredit)}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            {/* floating close button, top-right, over the image */}
            <button className="modal-close-btn" onClick={() => setSelected(null)}>×</button>

            <div className="modal-layout">

              {/* ── LEFT / IMAGE PANEL ── */}
              <div className="modal-left">
                <div className="modal-img-container">
                  {selected.image
                    ? <img
                        key={selected.image}
                        src={selected.image}
                        alt={selected.name}
                        className="modal-card-img"
                      />
                    : <div className="modal-no-img">NO IMAGE</div>
                  }
                </div>

                {/* name + chips float over the gradient at the bottom */}
                <div className="modal-left-foot">
                  <div className="modal-card-name">{selected.name}</div>
                  <div className="modal-chips">
                    {selected.productLine && <span className="chip">{selected.productLine}</span>}
                    {selected.setName      && <span className="chip">{selected.setName}</span>}
                    {selected.rarity       && <span className="chip">{selected.rarity}</span>}
                    {selected.finish       && <span className="chip">{selected.finish}</span>}
                    {selected.cardCode     && <span className="chip">{selected.cardCode}</span>}
                  </div>
                </div>
              </div>

              {/* ── RIGHT / STORES PANEL ── */}
              <div className="modal-right">
                <div className="modal-right-head">
                  <div className="modal-right-title">Buylist Offers</div>
                  <div className="modal-right-sub">
                    {selected.buylistCount || 0} store{(selected.buylistCount || 0) !== 1 ? "s" : ""} buying this card
                  </div>
                </div>

                <div className="modal-best">
                  <div className="best-item">
                    <span className="best-lbl">Best Cash</span>
                    <span className="best-val">{money(bestCash)}</span>
                  </div>
                  <div className="best-item">
                    <span className="best-lbl">Best Credit</span>
                    <span className="best-val secondary">{money(bestCredit)}</span>
                  </div>
                </div>

                <div className="modal-stores-scroll">
                  {modalStores.map((store, idx) => (
                    <div key={`${store.storeKey}-${idx}`} className="store-entry">
                      <div className="store-entry-head">
                        <div className={`rank-badge${idx === 0 ? " first" : ""}`}>{idx + 1}</div>
                        <span className="store-entry-name">{store.storeName}</span>
                        <div className="store-entry-links">
                          {store.storeBaseUrl    && <a className="entry-link" href={store.storeBaseUrl}    target="_blank" rel="noreferrer">Store ↗</a>}
                          {store.storeBuylistUrl && <a className="entry-link" href={store.storeBuylistUrl} target="_blank" rel="noreferrer">Buylist ↗</a>}
                        </div>
                      </div>

                      <div className="store-entry-prices">
                        <div className="price-col">
                          <span className="price-col-lbl">Cash</span>
                          <span className="price-col-val cash">{money(store.cashPrice)}</span>
                        </div>
                        <div className="price-col">
                          <span className="price-col-lbl">Credit</span>
                          <span className="price-col-val credit">{money(store.creditPrice)}</span>
                        </div>
                        <div className="price-col">
                          <span className="price-col-lbl">Retail</span>
                          <span className="price-col-val">{money(store.marketPrice)}</span>
                        </div>
                      </div>

                      {(store.variants || []).length > 0 && (
                        <div className="variants-table">
                          <div className="vrow vhead">
                            <div className="vcell vhead-lbl">Variant</div>
                            <div className="vcell vhead-lbl vnum">Cash</div>
                            <div className="vcell vhead-lbl vnum">Credit</div>
                            <div className="vcell vhead-lbl vnum">Retail</div>
                          </div>
                          {(store.variants || []).map((v, vi) => (
                            <div key={`${v.title}-${vi}`} className="vrow">
                              <div className="vcell vname">{v.title}</div>
                              <div className="vcell vcash vnum">{money(v.cashPrice)}</div>
                              <div className="vcell vnum">{money(v.creditPrice)}</div>
                              <div className="vcell vnum">{money(v.retailPrice)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
