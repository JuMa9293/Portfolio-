import { useState, useEffect, useCallback, useMemo } from “react”;

const INITIAL_PEA_PME = [
{ id: 1, name: “NEURONES”, ticker: “NRO”, cours: 35.10, pru: 35.21, qty: 9, sector: “Technologie”, consensus: “Achat Fort”, target: 52.00, analystCount: 1 },
{ id: 2, name: “ENTECH”, ticker: “ENTE”, cours: 9.78, pru: 7.86, qty: 25, sector: “Énergie Renouvelable”, consensus: “N/A”, target: null, analystCount: 0 },
{ id: 3, name: “ABEO”, ticker: “ABEO”, cours: 8.70, pru: 8.74, qty: 22, sector: “Loisirs”, consensus: “N/A”, target: null, analystCount: 0 },
{ id: 4, name: “TF1”, ticker: “TFI”, cours: 7.13, pru: 7.14, qty: 21, sector: “Médias”, consensus: “Neutre”, target: 9.50, analystCount: 5 },
{ id: 5, name: “RISING STONE”, ticker: “ALRS”, cours: 48.80, pru: 58.30, qty: 3, sector: “Immobilier”, consensus: “N/A”, target: null, analystCount: 0 },
{ id: 6, name: “SEMCO TECHNOLOGIES”, ticker: “ALSEM”, cours: 32.40, pru: 15.00, qty: 4, sector: “Semi-conducteurs”, consensus: “N/A”, target: null, analystCount: 0 },
];

const INITIAL_PEA = [
{ id: 7, name: “ISHARES MSCI WORLD”, ticker: “WPEA”, cours: 6.19, pru: 5.97, qty: 696, sector: “ETF Monde”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 8, name: “PUBLICIS GROUPE”, ticker: “PUB”, cours: 76.36, pru: 78.47, qty: 29, sector: “Communication”, consensus: “Achat”, target: 108.00, analystCount: 14 },
{ id: 9, name: “AMUNDI MSCI EMERGING”, ticker: “PAEEM”, cours: 30.47, pru: 30.07, qty: 52, sector: “ETF Émergents”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 10, name: “ACCOR”, ticker: “AC”, cours: 43.96, pru: 37.30, qty: 30, sector: “Hôtellerie”, consensus: “Achat”, target: 55.00, analystCount: 18 },
{ id: 11, name: “BNP PARIBAS”, ticker: “BNP”, cours: 87.26, pru: 74.31, qty: 15, sector: “Banque”, consensus: “Achat”, target: 100.66, analystCount: 19 },
{ id: 12, name: “EIFFAGE”, ticker: “FGR”, cours: 133.85, pru: 114.09, qty: 8, sector: “Construction”, consensus: “Achat”, target: 144.80, analystCount: 17 },
{ id: 13, name: “AMUNDI RUSSELL 2000”, ticker: “RS2K”, cours: 332.33, pru: 308.55, qty: 3, sector: “ETF US Small”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 14, name: “SEB”, ticker: “SK”, cours: 47.40, pru: 66.80, qty: 18, sector: “Consommation”, consensus: “Achat”, target: 75.36, analystCount: 8 },
{ id: 15, name: “AMUNDI HEALTHCARE”, ticker: “HLT”, cours: 152.43, pru: 159.08, qty: 5, sector: “ETF Santé”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 16, name: “ISHARES STOXX BANKS”, ticker: “BNKE”, cours: 16.02, pru: 14.75, qty: 42, sector: “ETF Banques”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 17, name: “CAPGEMINI”, ticker: “CAP”, cours: 110.05, pru: 105.34, qty: 6, sector: “Technologie”, consensus: “Achat Fort”, target: 155.00, analystCount: 16 },
{ id: 18, name: “AMUNDI LATAM”, ticker: “ALAT”, cours: 26.74, pru: 25.08, qty: 24, sector: “ETF LatAm”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 19, name: “TOTALENERGIES”, ticker: “TTE”, cours: 67.44, pru: 52.64, qty: 9, sector: “Énergie”, consensus: “Achat”, target: 69.20, analystCount: 22 },
{ id: 20, name: “SPIE”, ticker: “SPIE”, cours: 48.06, pru: 43.61, qty: 12, sector: “Services Industriels”, consensus: “Achat”, target: 54.50, analystCount: 11 },
{ id: 21, name: “BNP EASY S&P 500”, ticker: “ESE”, cours: 29.65, pru: 25.54, qty: 19, sector: “ETF US Large”, consensus: “ETF”, target: null, analystCount: 0 },
{ id: 22, name: “WENDEL”, ticker: “MF”, cours: 83.65, pru: 80.33, qty: 5, sector: “Holding”, consensus: “Achat”, target: 118.50, analystCount: 6 },
{ id: 23, name: “FDJ UNITED”, ticker: “FDJ”, cours: 25.62, pru: 28.13, qty: 15, sector: “Jeux”, consensus: “Neutre”, target: 29.37, analystCount: 11 },
{ id: 24, name: “MERSEN”, ticker: “MRN”, cours: 25.45, pru: 22.63, qty: 14, sector: “Matériaux”, consensus: “Achat”, target: 27.72, analystCount: 7 },
{ id: 25, name: “ARKEMA”, ticker: “AKE”, cours: 54.30, pru: 69.61, qty: 5, sector: “Chimie”, consensus: “Achat”, target: 74.25, analystCount: 16 },
{ id: 26, name: “RENAULT”, ticker: “RNO”, cours: 28.55, pru: 37.10, qty: 7, sector: “Automobile”, consensus: “Achat”, target: 45.74, analystCount: 19 },
];

const fmt = (n) => n?.toLocaleString(“fr-FR”, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + “ €”;
const fmtPct = (n) => (n >= 0 ? “+” : “”) + n?.toFixed(2) + “%”;
const fmtNum = (n) => n?.toLocaleString(“fr-FR”, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TABS = [“Vue d’ensemble”, “Mes Positions”, “Goldman Sachs”, “Morgan Stanley”, “Bridgewater”, “BlackRock”, “Citadel”, “JPMorgan”, “Briefing”];

// GS Analysis data
const gsAnalysis = {
“PUBLICIS GROUPE”: { moat: 8, management: 7, valorisation: “Sous-évalué”, peRatio: 13.0, peFwd: 11.2, evEbitda: 8.5, fcfYield: “7.2%”, debtEquity: 0.45, verdict: “Achat”, conviction: “Élevée”, bull: 130, bear: 65, summary: “Leader mondial de la communication digitale. Transformation réussie vers le data-driven marketing. Publicis Sapient offre un relais de croissance structurel via le conseil en transformation digitale. Marges en expansion continue.” },
“BNP PARIBAS”: { moat: 7, management: 7, valorisation: “Sous-évalué”, peRatio: 7.5, peFwd: 6.8, evEbitda: null, fcfYield: “N/A”, debtEquity: null, verdict: “Achat”, conviction: “Élevée”, bull: 110, bear: 72, summary: “1ère banque de la zone euro par les actifs. Diversification géographique et métier exemplaire. Programme de rachat d’actions massif. Rendement du dividende attractif >5%. CET1 solide à 13.2%.” },
“ACCOR”: { moat: 7, management: 8, valorisation: “Fair Value”, peRatio: 22.5, peFwd: 18.0, evEbitda: 12.3, fcfYield: “4.8%”, debtEquity: 0.85, verdict: “Achat”, conviction: “Moyenne”, bull: 66, bear: 35, summary: “Transformation en asset-light réussie. Portefeuille de marques premium (Fairmont, Raffles, Sofitel) en forte croissance. Pipeline de +1200 hôtels. Exposition aux marchés émergents porteurs. Risque cyclique lié au tourisme.” },
“EIFFAGE”: { moat: 6, management: 7, valorisation: “Sous-évalué”, peRatio: 12.2, peFwd: 10.5, evEbitda: 6.8, fcfYield: “6.5%”, debtEquity: 1.2, verdict: “Achat”, conviction: “Élevée”, bull: 172, bear: 105, summary: “Modèle intégré BTP + concessions autoroutières (APRR). Cash-flow récurrent des concessions sécurise le dividende. Carnet de commandes record. Bénéficiaire des plans d’infrastructure européens et de la transition énergétique.” },
“CAPGEMINI”: { moat: 7, management: 7, valorisation: “Sous-évalué”, peRatio: 15.8, peFwd: 13.5, evEbitda: 10.2, fcfYield: “5.5%”, debtEquity: 0.55, verdict: “Achat”, conviction: “Élevée”, bull: 208, bear: 90, summary: “N°1 européen du conseil IT et transformation digitale. Positionnement fort sur l’IA générative et le cloud. Cycle de dépenses IT structurellement haussier. Compression temporaire des multiples = opportunité.” },
“TOTALENERGIES”: { moat: 8, management: 8, valorisation: “Fair Value”, peRatio: 8.5, peFwd: 7.8, evEbitda: 4.2, fcfYield: “9.1%”, debtEquity: 0.35, verdict: “Conservation”, conviction: “Moyenne”, bull: 80, bear: 50, summary: “Major pétrolière la mieux positionnée sur la transition énergétique. Pipeline renouvelable massif (100GW d’ici 2030). Dividende croissant et rachat d’actions agressif. Risque : volatilité des prix du pétrole.” },
“ARKEMA”: { moat: 6, management: 6, valorisation: “Sous-évalué”, peRatio: 18.5, peFwd: 12.0, evEbitda: 7.5, fcfYield: “5.0%”, debtEquity: 0.65, verdict: “Achat”, conviction: “Moyenne”, bull: 95, bear: 42, summary: “Spécialiste des matériaux de spécialité (adhésifs, polymères avancés). Transformation du portefeuille vers les hautes marges. Exposition aux mégatendances (EV, 5G, construction durable). Cyclicité inhérente au secteur chimique.” },
“RENAULT”: { moat: 5, management: 7, valorisation: “Très Sous-évalué”, peRatio: 4.2, peFwd: 3.8, evEbitda: 2.5, fcfYield: “12%”, debtEquity: 0.90, verdict: “Achat”, conviction: “Moyenne”, bull: 64, bear: 22, summary: “Restructuration Renaulution en cours avec résultats probants sur les marges. Lancement réussi de Scenic E-Tech et R5 électrique. Participation Nissan réduite, focus sur la rentabilité. Risque EV chinois et tarifs douaniers.” },
“SEB”: { moat: 7, management: 7, valorisation: “Sous-évalué”, peRatio: 14.0, peFwd: 11.5, evEbitda: 8.0, fcfYield: “6.0%”, debtEquity: 0.70, verdict: “Achat”, conviction: “Élevée”, bull: 102, bear: 55, summary: “Leader mondial du petit électroménager (Tefal, Moulinex, Rowenta, Krups). Portefeuille de marques iconiques. Exposition Chine via Supor. Innovation produit constante (Cookeo, airfryer). Pression temporaire des devises émergentes.” },
“WENDEL”: { moat: 6, management: 8, valorisation: “Sous-évalué (décote holding ~35%)”, peRatio: null, peFwd: null, evEbitda: null, fcfYield: “N/A”, debtEquity: 0.40, verdict: “Achat”, conviction: “Moyenne”, bull: 135, bear: 70, summary: “Holding d’investissement avec track record solide. Transformation vers le modèle asset management (IK Partners). Décote NAV significative ~35%. Pipeline de cessions potentiel créateur de valeur.” },
“FDJ UNITED”: { moat: 8, management: 6, valorisation: “Fair Value”, peRatio: 16.0, peFwd: 14.5, evEbitda: 9.5, fcfYield: “5.5%”, debtEquity: 0.55, verdict: “Conservation”, conviction: “Faible”, bull: 41, bear: 20, summary: “Monopole sur les jeux de loterie en France + acquisition Kindred (paris sportifs). Intégration Kindred = risque d’exécution. Régulation stricte mais protectrice. Cash-flow prévisible mais croissance organique limitée.” },
“SPIE”: { moat: 6, management: 8, valorisation: “Fair Value”, peRatio: 18.0, peFwd: 15.5, evEbitda: 10.5, fcfYield: “5.0%”, debtEquity: 0.80, verdict: “Conservation”, conviction: “Moyenne”, bull: 60, bear: 38, summary: “Leader européen des services multi-techniques (énergie, communication). Bénéficiaire structurel de la transition énergétique et du renouvellement des infrastructures. Croissance externe disciplinée. Valorisation tendue après +80% en 2025.” },
“MERSEN”: { moat: 6, management: 7, valorisation: “Sous-évalué”, peRatio: 12.0, peFwd: 10.0, evEbitda: 6.5, fcfYield: “7.0%”, debtEquity: 0.50, verdict: “Achat”, conviction: “Moyenne”, bull: 33, bear: 18, summary: “Spécialiste mondial du graphite et des solutions électriques. Exposition aux marchés de croissance : véhicules électriques, semi-conducteurs, énergies renouvelables. Taille modeste mais niche attractive.” },
“NEURONES”: { moat: 5, management: 7, valorisation: “Fair Value”, peRatio: 16.0, peFwd: 14.0, evEbitda: 9.0, fcfYield: “5.5%”, debtEquity: 0.10, verdict: “Achat”, conviction: “Moyenne”, bull: 52, bear: 28, summary: “ESN française spécialisée en infrastructure IT et cloud. Croissance organique régulière. Bilan très sain (quasi zéro dette). Taille modeste limitant la couverture analystes. Secteur porteur (cloud, cybersécurité, IA).” },
};

function App() {
const [activeTab, setActiveTab] = useState(0);
const [peaPme, setPeaPme] = useState(INITIAL_PEA_PME);
const [pea, setPea] = useState(INITIAL_PEA);
const [editingId, setEditingId] = useState(null);
const [editValues, setEditValues] = useState({});
const [selectedStock, setSelectedStock] = useState(null);
const [darkMode, setDarkMode] = useState(false);

const allPositions = useMemo(() => […peaPme, …pea], [peaPme, pea]);
const stocks = useMemo(() => allPositions.filter(p => p.consensus !== “ETF”), [allPositions]);
const etfs = useMemo(() => allPositions.filter(p => p.consensus === “ETF”), [allPositions]);

const totalValue = useMemo(() => allPositions.reduce((s, p) => s + p.cours * p.qty, 0), [allPositions]);
const totalCost = useMemo(() => allPositions.reduce((s, p) => s + p.pru * p.qty, 0), [allPositions]);
const totalPnl = totalValue - totalCost;
const totalPnlPct = (totalPnl / totalCost) * 100;

const peaValue = useMemo(() => pea.reduce((s, p) => s + p.cours * p.qty, 0), [pea]);
const peaPmeValue = useMemo(() => peaPme.reduce((s, p) => s + p.cours * p.qty, 0), [peaPme]);

const sectorAlloc = useMemo(() => {
const map = {};
allPositions.forEach(p => {
const val = p.cours * p.qty;
map[p.sector] = (map[p.sector] || 0) + val;
});
return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, val]) => ({ name, val, pct: (val / totalValue) * 100 }));
}, [allPositions, totalValue]);

const startEdit = (p) => { setEditingId(p.id); setEditValues({ pru: p.pru, qty: p.qty, cours: p.cours }); };
const saveEdit = (id) => {
const update = (list) => list.map(p => p.id === id ? { …p, pru: parseFloat(editValues.pru), qty: parseInt(editValues.qty), cours: parseFloat(editValues.cours) } : p);
setPeaPme(update); setPea(update); setEditingId(null);
};

const bg = darkMode ? “#0a0a0f” : “#f8f9fb”;
const card = darkMode ? “#16172a” : “#ffffff”;
const text = darkMode ? “#e8e8f0” : “#1a1a2e”;
const textSec = darkMode ? “#8888a8” : “#6b7280”;
const border = darkMode ? “#2a2b45” : “#e5e7eb”;
const accent = “#2563eb”;
const green = “#10b981”;
const red = “#ef4444”;

const cardStyle = { background: card, borderRadius: 16, padding: “20px”, border: `1px solid ${border}`, marginBottom: 12 };
const pillStyle = (active) => ({
padding: “8px 16px”, borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: “pointer”, whiteSpace: “nowrap”,
background: active ? accent : “transparent”, color: active ? “#fff” : textSec, border: active ? “none” : `1px solid ${border}`,
transition: “all 0.2s”
});

const MiniBar = ({ pct, color }) => (
<div style={{ width: “100%”, height: 6, background: border, borderRadius: 3, overflow: “hidden” }}>
<div style={{ width: `${Math.min(Math.abs(pct), 100)}%`, height: “100%”, background: color, borderRadius: 3, transition: “width 0.5s” }} />
</div>
);

const PnlBadge = ({ value }) => (
<span style={{ color: value >= 0 ? green : red, fontWeight: 700, fontSize: 13 }}>
{value >= 0 ? “▲” : “▼”} {fmt(Math.abs(value))}
</span>
);

const ConsensusBadge = ({ consensus }) => {
const colors = { “Achat Fort”: { bg: “#059669”, fg: “#fff” }, “Achat”: { bg: “#10b981”, fg: “#fff” }, “Neutre”: { bg: “#f59e0b”, fg: “#000” }, “Conservation”: { bg: “#6b7280”, fg: “#fff” }, “Vente”: { bg: “#ef4444”, fg: “#fff” }, “N/A”: { bg: border, fg: textSec }, “ETF”: { bg: accent, fg: “#fff” } };
const c = colors[consensus] || colors[“N/A”];
return <span style={{ background: c.bg, color: c.fg, padding: “3px 10px”, borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{consensus}</span>;
};

// TAB: VUE D’ENSEMBLE
const Overview = () => (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, ${accent}, #7c3aed)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Valeur Totale du Portefeuille</div>
<div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{fmt(totalValue)}</div>
<div style={{ display: “flex”, gap: 20, marginTop: 12 }}>
<div><span style={{ opacity: 0.7, fontSize: 12 }}>P&L Total</span><br /><span style={{ fontSize: 18, fontWeight: 700 }}>{totalPnl >= 0 ? “+” : “”}{fmt(totalPnl)}</span></div>
<div><span style={{ opacity: 0.7, fontSize: 12 }}>Performance</span><br /><span style={{ fontSize: 18, fontWeight: 700 }}>{fmtPct(totalPnlPct)}</span></div>
</div>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 12 }}>
<div style={cardStyle}>
<div style={{ fontSize: 11, color: textSec, fontWeight: 600, textTransform: “uppercase”, letterSpacing: 1 }}>PEA</div>
<div style={{ fontSize: 22, fontWeight: 700, color: text, marginTop: 4 }}>{fmt(peaValue)}</div>
<div style={{ fontSize: 12, color: green, fontWeight: 600 }}>{fmtPct(((peaValue - pea.reduce((s, p) => s + p.pru * p.qty, 0)) / pea.reduce((s, p) => s + p.pru * p.qty, 0)) * 100)}</div>
</div>
<div style={cardStyle}>
<div style={{ fontSize: 11, color: textSec, fontWeight: 600, textTransform: “uppercase”, letterSpacing: 1 }}>PEA-PME</div>
<div style={{ fontSize: 22, fontWeight: 700, color: text, marginTop: 4 }}>{fmt(peaPmeValue)}</div>
<div style={{ fontSize: 12, color: (peaPmeValue - peaPme.reduce((s,p)=>s+p.pru*p.qty,0)) >= 0 ? green : red, fontWeight: 600 }}>{fmtPct(((peaPmeValue - peaPme.reduce((s,p)=>s+p.pru*p.qty,0)) / peaPme.reduce((s,p)=>s+p.pru*p.qty,0)) * 100)}</div>
</div>
</div>

```
  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Top Performers</div>
    {[...allPositions].sort((a, b) => (b.cours - b.pru) * b.qty - (a.cours - a.pru) * a.qty).slice(0, 5).map(p => {
      const pnl = (p.cours - p.pru) * p.qty;
      const pnlPct = ((p.cours - p.pru) / p.pru) * 100;
      return (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${border}` }}>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.name}</div><div style={{ fontSize: 11, color: textSec }}>{fmt(p.cours * p.qty)}</div></div>
          <div style={{ textAlign: "right" }}><PnlBadge value={pnl} /><div style={{ fontSize: 11, color: pnlPct >= 0 ? green : red }}>{fmtPct(pnlPct)}</div></div>
        </div>
      );
    })}
  </div>

  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Allocation Sectorielle</div>
    {sectorAlloc.slice(0, 10).map(s => (
      <div key={s.name} style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: text, marginBottom: 3 }}>
          <span style={{ fontWeight: 500 }}>{s.name}</span><span style={{ color: textSec }}>{s.pct.toFixed(1)}% · {fmt(s.val)}</span>
        </div>
        <MiniBar pct={s.pct} color={accent} />
      </div>
    ))}
  </div>

  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Consensus Analystes — Objectifs 12M</div>
    {stocks.filter(p => p.target).sort((a, b) => ((b.target - b.cours) / b.cours) - ((a.target - a.cours) / a.cours)).map(p => {
      const upside = ((p.target - p.cours) / p.cours) * 100;
      return (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${border}` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.name}</div>
            <div style={{ fontSize: 11, color: textSec }}>{p.analystCount} analystes · <ConsensusBadge consensus={p.consensus} /></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: upside >= 0 ? green : red }}>{fmtPct(upside)}</div>
            <div style={{ fontSize: 11, color: textSec }}>Obj: {fmt(p.target)}</div>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);

// TAB: MES POSITIONS
const Positions = () => (
<div>
<div style={{ fontSize: 11, color: textSec, fontWeight: 600, textTransform: “uppercase”, letterSpacing: 1, marginBottom: 8 }}>PEA-PME · {fmt(peaPmeValue)}</div>
{peaPme.map(p => <PositionRow key={p.id} p={p} setter={setPeaPme} />)}
<div style={{ fontSize: 11, color: textSec, fontWeight: 600, textTransform: “uppercase”, letterSpacing: 1, marginBottom: 8, marginTop: 20 }}>PEA · {fmt(peaValue)}</div>
{pea.map(p => <PositionRow key={p.id} p={p} setter={setPea} />)}
</div>
);

const PositionRow = ({ p, setter }) => {
const pnl = (p.cours - p.pru) * p.qty;
const pnlPct = ((p.cours - p.pru) / p.pru) * 100;
const isEditing = editingId === p.id;
return (
<div style={{ …cardStyle, padding: 14 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<span style={{ fontSize: 14, fontWeight: 700, color: text }}>{p.name}</span>
<ConsensusBadge consensus={p.consensus} />
</div>
{isEditing ? (
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr 1fr”, gap: 8, marginTop: 8 }}>
{[“cours”, “pru”, “qty”].map(field => (
<div key={field}>
<div style={{ fontSize: 10, color: textSec, marginBottom: 2 }}>{field === “cours” ? “Cours” : field === “pru” ? “PRU” : “Qté”}</div>
<input value={editValues[field]} onChange={e => setEditValues({ …editValues, [field]: e.target.value })}
style={{ width: “100%”, padding: “6px 8px”, borderRadius: 8, border: `1px solid ${accent}`, background: bg, color: text, fontSize: 13, outline: “none” }} />
</div>
))}
</div>
) : (
<div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>
Cours: {fmt(p.cours)} · PRU: {fmt(p.pru)} · Qté: {p.qty}
{p.target && <span> · Obj 12M: <span style={{ color: accent, fontWeight: 600 }}>{fmt(p.target)}</span></span>}
</div>
)}
</div>
<div style={{ textAlign: “right”, minWidth: 100 }}>
<div style={{ fontSize: 15, fontWeight: 700, color: text }}>{fmt(p.cours * p.qty)}</div>
<PnlBadge value={pnl} />
<div style={{ fontSize: 11, color: pnlPct >= 0 ? green : red }}>{fmtPct(pnlPct)}</div>
</div>
</div>
<div style={{ display: “flex”, gap: 8, marginTop: 8, justifyContent: “flex-end” }}>
{isEditing ? (
<>
<button onClick={() => saveEdit(p.id)} style={{ padding: “5px 14px”, borderRadius: 8, background: green, color: “#fff”, border: “none”, fontSize: 11, fontWeight: 600, cursor: “pointer” }}>Sauvegarder</button>
<button onClick={() => setEditingId(null)} style={{ padding: “5px 14px”, borderRadius: 8, background: “transparent”, color: textSec, border: `1px solid ${border}`, fontSize: 11, cursor: “pointer” }}>Annuler</button>
</>
) : (
<button onClick={() => startEdit(p)} style={{ padding: “5px 14px”, borderRadius: 8, background: “transparent”, color: accent, border: `1px solid ${accent}`, fontSize: 11, fontWeight: 600, cursor: “pointer” }}>Modifier</button>
)}
</div>
</div>
);
};

// TAB: GOLDMAN SACHS
const GoldmanSachs = () => {
const [gsStock, setGsStock] = useState(null);
const analysed = stocks.filter(p => gsAnalysis[p.name]);
return (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #1a1a2e, #16213e)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>Goldman Sachs</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Analyse Fondamentale</div>
<div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Recherche approfondie style banque d’investissement</div>
</div>
{!gsStock ? (
<div>
<div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 12 }}>Sélectionner une position :</div>
{analysed.map(p => {
const a = gsAnalysis[p.name];
return (
<div key={p.id} onClick={() => setGsStock(p)} style={{ …cardStyle, cursor: “pointer”, transition: “transform 0.15s” }}
onMouseEnter={e => e.currentTarget.style.transform = “scale(1.01)”} onMouseLeave={e => e.currentTarget.style.transform = “scale(1)”}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div>
<div style={{ fontSize: 14, fontWeight: 700, color: text }}>{p.name}</div>
<div style={{ fontSize: 12, color: textSec }}>{p.sector}</div>
</div>
<div style={{ display: “flex”, gap: 8, alignItems: “center” }}>
<span style={{ padding: “4px 12px”, borderRadius: 8, fontSize: 12, fontWeight: 700, background: a.verdict === “Achat” ? green : a.verdict === “Conservation” ? “#f59e0b” : red, color: “#fff” }}>{a.verdict}</span>
<span style={{ fontSize: 18, color: textSec }}>→</span>
</div>
</div>
</div>
);
})}
</div>
) : (
<GSDetail p={gsStock} a={gsAnalysis[gsStock.name]} onBack={() => setGsStock(null)} />
)}
</div>
);
};

const GSDetail = ({ p, a, onBack }) => (
<div>
<button onClick={onBack} style={{ background: “none”, border: “none”, color: accent, fontSize: 13, fontWeight: 600, cursor: “pointer”, marginBottom: 12 }}>← Retour</button>
<div style={cardStyle}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div><div style={{ fontSize: 20, fontWeight: 800, color: text }}>{p.name}</div><div style={{ fontSize: 12, color: textSec }}>{p.ticker} · {p.sector}</div></div>
<span style={{ padding: “6px 16px”, borderRadius: 10, fontSize: 14, fontWeight: 700, background: a.verdict === “Achat” ? green : a.verdict === “Conservation” ? “#f59e0b” : red, color: “#fff” }}>{a.verdict}</span>
</div>
<div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>Conviction : {a.conviction} · {p.analystCount} analystes</div>
</div>

```
  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 8 }}>Résumé</div>
    <div style={{ fontSize: 13, color: textSec, lineHeight: 1.6 }}>{a.summary}</div>
  </div>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {[{ label: "P/E", val: a.peRatio }, { label: "P/E Fwd", val: a.peFwd }, { label: "EV/EBITDA", val: a.evEbitda || "N/A" }, { label: "FCF Yield", val: a.fcfYield },
      { label: "Moat", val: `${a.moat}/10` }, { label: "Management", val: `${a.management}/10` }, { label: "Dette/FP", val: a.debtEquity ?? "N/A" }, { label: "Valorisation", val: a.valorisation }
    ].map((m, i) => (
      <div key={i} style={cardStyle}>
        <div style={{ fontSize: 10, color: textSec, textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: text, marginTop: 2 }}>{m.val}</div>
      </div>
    ))}
  </div>

  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Scénarios 12 Mois</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: red, fontWeight: 600 }}>BEAR</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: red }}>{fmt(a.bear)}</div>
        <div style={{ fontSize: 11, color: textSec }}>{fmtPct(((a.bear - p.cours) / p.cours) * 100)}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: accent, fontWeight: 600 }}>ACTUEL</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: text }}>{fmt(p.cours)}</div>
        <div style={{ fontSize: 11, color: textSec }}>Obj: {p.target ? fmt(p.target) : "N/A"}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: green, fontWeight: 600 }}>BULL</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: green }}>{fmt(a.bull)}</div>
        <div style={{ fontSize: 11, color: textSec }}>{fmtPct(((a.bull - p.cours) / p.cours) * 100)}</div>
      </div>
    </div>
    <div style={{ marginTop: 12, height: 8, background: border, borderRadius: 4, position: "relative" }}>
      {(() => {
        const range = a.bull - a.bear;
        const currentPos = ((p.cours - a.bear) / range) * 100;
        const targetPos = p.target ? ((p.target - a.bear) / range) * 100 : null;
        return (<>
          <div style={{ position: "absolute", left: `${Math.max(0, Math.min(currentPos, 100))}%`, top: -3, width: 14, height: 14, borderRadius: 7, background: accent, border: "2px solid #fff", transform: "translateX(-50%)" }} />
          {targetPos && <div style={{ position: "absolute", left: `${Math.max(0, Math.min(targetPos, 100))}%`, top: -1, width: 10, height: 10, borderRadius: 5, background: green, border: "2px solid #fff", transform: "translateX(-50%)" }} />}
        </>);
      })()}
    </div>
  </div>
</div>
```

);

// TAB: MORGAN STANLEY
const MorganStanley = () => {
const techData = {
“PUBLICIS GROUPE”: { trend: “Haussier”, support: [72, 68], resistance: [82, 90], rsi: 48, macd: “Neutre”, bb: “Milieu”, volume: “Moyen”, signal: “Accumuler” },
“BNP PARIBAS”: { trend: “Haussier Fort”, support: [82, 78], resistance: [92, 100], rsi: 62, macd: “Haussier”, bb: “Haut”, volume: “Fort”, signal: “Achat” },
“ACCOR”: { trend: “Haussier”, support: [40, 37], resistance: [46, 50], rsi: 55, macd: “Haussier”, bb: “Milieu-Haut”, volume: “Moyen”, signal: “Achat” },
“EIFFAGE”: { trend: “Haussier Fort”, support: [125, 118], resistance: [140, 150], rsi: 64, macd: “Haussier”, bb: “Haut”, volume: “Fort”, signal: “Achat” },
“CAPGEMINI”: { trend: “Baissier”, support: [100, 95], resistance: [115, 125], rsi: 38, macd: “Baissier”, bb: “Bas”, volume: “Faible”, signal: “Attendre” },
“TOTALENERGIES”: { trend: “Haussier”, support: [62, 58], resistance: [70, 75], rsi: 58, macd: “Haussier”, bb: “Milieu-Haut”, volume: “Fort”, signal: “Conservation” },
“SEB”: { trend: “Baissier Fort”, support: [42, 38], resistance: [52, 58], rsi: 32, macd: “Baissier”, bb: “Bas”, volume: “Faible”, signal: “Attendre” },
“ARKEMA”: { trend: “Baissier”, support: [50, 45], resistance: [58, 65], rsi: 35, macd: “Baissier”, bb: “Bas”, volume: “Faible”, signal: “Attendre” },
“RENAULT”: { trend: “Baissier Fort”, support: [26, 22], resistance: [32, 38], rsi: 28, macd: “Baissier”, bb: “Sous bande inf.”, volume: “Faible”, signal: “Éviter” },
};
return (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #1e3a5f, #0d2137)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>Morgan Stanley</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Analyse Technique</div>
</div>
{Object.entries(techData).map(([name, d]) => {
const p = allPositions.find(x => x.name === name);
if (!p) return null;
const trendColor = d.trend.includes(“Haussier”) ? green : red;
return (
<div key={name} style={cardStyle}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 10 }}>
<div><div style={{ fontSize: 14, fontWeight: 700, color: text }}>{name}</div><div style={{ fontSize: 12, color: textSec }}>{fmt(p.cours)}</div></div>
<span style={{ padding: “4px 12px”, borderRadius: 8, fontSize: 12, fontWeight: 700, background: d.signal === “Achat” ? green : d.signal === “Attendre” ? “#f59e0b” : d.signal === “Éviter” ? red : accent, color: “#fff” }}>{d.signal}</span>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr 1fr”, gap: 8, fontSize: 11 }}>
<div><span style={{ color: textSec }}>Tendance</span><br/><span style={{ color: trendColor, fontWeight: 600 }}>{d.trend}</span></div>
<div><span style={{ color: textSec }}>RSI</span><br/><span style={{ color: d.rsi < 30 ? red : d.rsi > 70 ? red : green, fontWeight: 600 }}>{d.rsi}</span></div>
<div><span style={{ color: textSec }}>MACD</span><br/><span style={{ color: d.macd === “Haussier” ? green : d.macd === “Baissier” ? red : textSec, fontWeight: 600 }}>{d.macd}</span></div>
<div><span style={{ color: textSec }}>Supports</span><br/><span style={{ fontWeight: 600, color: text }}>{d.support.join(” / “)}</span></div>
<div><span style={{ color: textSec }}>Résistances</span><br/><span style={{ fontWeight: 600, color: text }}>{d.resistance.join(” / “)}</span></div>
<div><span style={{ color: textSec }}>Volume</span><br/><span style={{ fontWeight: 600, color: text }}>{d.volume}</span></div>
</div>
</div>
);
})}
</div>
);
};

// TAB: BRIDGEWATER
const Bridgewater = () => {
const riskData = [
{ name: “RENAULT”, beta: 1.35, maxDD: “-65%”, volatility: “Très Élevée”, riskScore: 9, recession: “-50%”, earningsMove: “±8%” },
{ name: “ARKEMA”, beta: 1.25, maxDD: “-55%”, volatility: “Élevée”, riskScore: 8, recession: “-45%”, earningsMove: “±6%” },
{ name: “SEB”, beta: 0.95, maxDD: “-45%”, volatility: “Élevée”, riskScore: 7, recession: “-35%”, earningsMove: “±5%” },
{ name: “CAPGEMINI”, beta: 1.20, maxDD: “-50%”, volatility: “Élevée”, riskScore: 7, recession: “-40%”, earningsMove: “±7%” },
{ name: “ACCOR”, beta: 1.15, maxDD: “-60%”, volatility: “Élevée”, riskScore: 7, recession: “-45%”, earningsMove: “±5%” },
{ name: “BNP PARIBAS”, beta: 1.30, maxDD: “-55%”, volatility: “Élevée”, riskScore: 7, recession: “-40%”, earningsMove: “±6%” },
{ name: “PUBLICIS GROUPE”, beta: 0.65, maxDD: “-35%”, volatility: “Modérée”, riskScore: 5, recession: “-25%”, earningsMove: “±4%” },
{ name: “EIFFAGE”, beta: 0.85, maxDD: “-40%”, volatility: “Modérée”, riskScore: 5, recession: “-30%”, earningsMove: “±4%” },
{ name: “TOTALENERGIES”, beta: 0.90, maxDD: “-45%”, volatility: “Modérée”, riskScore: 6, recession: “-35%”, earningsMove: “±5%” },
];
const portfolioBeta = 0.92;
const concentrationRisk = sectorAlloc[0];
return (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #7c2d12, #451a03)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>Bridgewater Associates</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Évaluation des Risques</div>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr 1fr”, gap: 12 }}>
<div style={cardStyle}><div style={{ fontSize: 10, color: textSec, textTransform: “uppercase” }}>Beta Portefeuille</div><div style={{ fontSize: 22, fontWeight: 700, color: text }}>{portfolioBeta}</div></div>
<div style={cardStyle}><div style={{ fontSize: 10, color: textSec, textTransform: “uppercase” }}>Risque Concentration</div><div style={{ fontSize: 14, fontWeight: 700, color: text }}>{concentrationRisk?.name}</div><div style={{ fontSize: 11, color: textSec }}>{concentrationRisk?.pct.toFixed(1)}%</div></div>
<div style={cardStyle}><div style={{ fontSize: 10, color: textSec, textTransform: “uppercase” }}>Stress Test -2008</div><div style={{ fontSize: 22, fontWeight: 700, color: red }}>-38%</div></div>
</div>
<div style={cardStyle}>
<div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Matrice de Risque par Position</div>
{riskData.map(r => (
<div key={r.name} style={{ padding: “10px 0”, borderBottom: `1px solid ${border}` }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 6 }}>
<span style={{ fontSize: 13, fontWeight: 600, color: text }}>{r.name}</span>
<span style={{ fontSize: 12, fontWeight: 700, color: r.riskScore >= 8 ? red : r.riskScore >= 6 ? “#f59e0b” : green }}>{r.riskScore}/10</span>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(4, 1fr)”, gap: 8, fontSize: 11 }}>
<div><span style={{ color: textSec }}>Beta</span><br/><span style={{ fontWeight: 600, color: text }}>{r.beta}</span></div>
<div><span style={{ color: textSec }}>Max DD</span><br/><span style={{ fontWeight: 600, color: red }}>{r.maxDD}</span></div>
<div><span style={{ color: textSec }}>Récession</span><br/><span style={{ fontWeight: 600, color: red }}>{r.recession}</span></div>
<div><span style={{ color: textSec }}>Earnings</span><br/><span style={{ fontWeight: 600, color: text }}>{r.earningsMove}</span></div>
</div>
</div>
))}
</div>
</div>
);
};

// TAB: BLACKROCK
const BlackRock = () => {
const divData = [
{ name: “TOTALENERGIES”, yield: 5.2, growth5y: 8.5, payout: 42, safety: 9, years: 5 },
{ name: “BNP PARIBAS”, yield: 5.8, growth5y: 12.0, payout: 50, safety: 8, years: 3 },
{ name: “PUBLICIS GROUPE”, yield: 4.1, growth5y: 10.0, payout: 45, safety: 8, years: 8 },
{ name: “EIFFAGE”, yield: 3.3, growth5y: 6.5, payout: 35, safety: 7, years: 5 },
{ name: “CAPGEMINI”, yield: 3.3, growth5y: 8.0, payout: 36, safety: 7, years: 7 },
{ name: “SPIE”, yield: 3.8, growth5y: 9.0, payout: 55, safety: 7, years: 4 },
{ name: “RENAULT”, yield: 6.5, growth5y: null, payout: 25, safety: 5, years: 1 },
];
return (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #000000, #1a1a2e)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>BlackRock</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Analyse Dividendes</div>
</div>
{divData.map(d => (
<div key={d.name} style={cardStyle}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 8 }}>
<span style={{ fontSize: 14, fontWeight: 700, color: text }}>{d.name}</span>
<span style={{ fontSize: 18, fontWeight: 800, color: green }}>{d.yield}%</span>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(4, 1fr)”, gap: 8, fontSize: 11 }}>
<div><span style={{ color: textSec }}>Croiss. 5A</span><br/><span style={{ fontWeight: 600, color: text }}>{d.growth5y ? `${d.growth5y}%` : “N/A”}</span></div>
<div><span style={{ color: textSec }}>Payout</span><br/><span style={{ fontWeight: 600, color: d.payout > 60 ? “#f59e0b” : green }}>{d.payout}%</span></div>
<div><span style={{ color: textSec }}>Sécurité</span><br/><span style={{ fontWeight: 600, color: d.safety >= 7 ? green : “#f59e0b” }}>{d.safety}/10</span></div>
<div><span style={{ color: textSec }}>Années ↑</span><br/><span style={{ fontWeight: 600, color: text }}>{d.years}</span></div>
</div>
</div>
))}
</div>
);
};

// TAB: CITADEL
const Citadel = () => {
const sectors = [
{ name: “Technologie”, weight: “Surpondérer”, phase: “Mid-Cycle”, perf6m: “+12%”, color: green },
{ name: “Banques/Finance”, weight: “Surpondérer”, phase: “Early-Mid”, perf6m: “+18%”, color: green },
{ name: “Énergie”, weight: “Neutre”, phase: “Late-Cycle”, perf6m: “+5%”, color: “#f59e0b” },
{ name: “Construction/Infra”, weight: “Surpondérer”, phase: “Mid-Cycle”, perf6m: “+15%”, color: green },
{ name: “Consommation Disc.”, weight: “Sous-pondérer”, phase: “Late-Cycle”, perf6m: “-8%”, color: red },
{ name: “Hôtellerie/Tourisme”, weight: “Neutre”, phase: “Mid-Late”, perf6m: “+7%”, color: “#f59e0b” },
{ name: “Chimie/Matériaux”, weight: “Sous-pondérer”, phase: “Late-Cycle”, perf6m: “-12%”, color: red },
{ name: “Automobile”, weight: “Sous-pondérer”, phase: “Late-Cycle”, perf6m: “-15%”, color: red },
{ name: “Services Industriels”, weight: “Surpondérer”, phase: “Mid-Cycle”, perf6m: “+10%”, color: green },
{ name: “Santé”, weight: “Surpondérer”, phase: “Défensif”, perf6m: “+3%”, color: green },
];
return (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #065f46, #022c22)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>Citadel</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Rotation Sectorielle</div>
<div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Phase actuelle : Mid-to-Late Cycle · BCE : taux directeur 2.65%</div>
</div>
<div style={cardStyle}>
<div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Matrice Sectorielle</div>
{sectors.map(s => (
<div key={s.name} style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, padding: “10px 0”, borderBottom: `1px solid ${border}` }}>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 13, fontWeight: 600, color: text }}>{s.name}</div>
<div style={{ fontSize: 11, color: textSec }}>{s.phase}</div>
</div>
<span style={{ fontSize: 12, color: s.color, fontWeight: 600, marginRight: 12 }}>{s.perf6m}</span>
<span style={{ padding: “4px 10px”, borderRadius: 8, fontSize: 11, fontWeight: 700, background: s.weight === “Surpondérer” ? green : s.weight === “Sous-pondérer” ? red : “#f59e0b”, color: “#fff” }}>{s.weight}</span>
</div>
))}
</div>
<div style={cardStyle}>
<div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 8 }}>Impact sur Votre Portefeuille</div>
<div style={{ fontSize: 13, color: textSec, lineHeight: 1.6 }}>
Votre portefeuille est bien positionné sur les secteurs mid-cycle (Technologie, Finance, Infrastructure) qui surperforment en phase actuelle.
Les positions en Chimie (Arkema) et Automobile (Renault) subissent la pression late-cycle et les incertitudes tarifaires.
Recommandation : réduire l’exposition cyclique tardive et renforcer les ETF défensifs (Healthcare) et la technologie.
</div>
</div>
</div>
);
};

// TAB: JPMORGAN
const JPMorgan = () => {
const earningsData = [
{ name: “PUBLICIS GROUPE”, nextDate: “17 Avr 2026”, surprise: “+3.2%”, history: “5/6 battus”, implied: “±4.5%”, position: “Conserver avant” },
{ name: “CAPGEMINI”, nextDate: “30 Avr 2026”, surprise: “+12.4%”, history: “4/6 battus”, implied: “±6.0%”, position: “Accumuler avant” },
{ name: “BNP PARIBAS”, nextDate: “Mai 2026”, surprise: “+2.1%”, history: “5/6 battus”, implied: “±5.0%”, position: “Conserver avant” },
{ name: “TOTALENERGIES”, nextDate: “Avr 2026”, surprise: “-1.5%”, history: “3/6 battus”, implied: “±4.0%”, position: “Conserver” },
{ name: “EIFFAGE”, nextDate: “Mai 2026”, surprise: “+4.0%”, history: “5/6 battus”, implied: “±3.5%”, position: “Achat avant” },
{ name: “RENAULT”, nextDate: “Avr 2026”, surprise: “+8.5%”, history: “4/6 battus”, implied: “±7.0%”, position: “Spéculatif” },
];
return (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #1e3a5f, #0c2340)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>JPMorgan Chase</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Earnings Analyzer</div>
</div>
{earningsData.map(e => (
<div key={e.name} style={cardStyle}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 8 }}>
<div><div style={{ fontSize: 14, fontWeight: 700, color: text }}>{e.name}</div><div style={{ fontSize: 11, color: textSec }}>Prochains résultats : {e.nextDate}</div></div>
<span style={{ padding: “4px 12px”, borderRadius: 8, fontSize: 11, fontWeight: 700, background: e.position.includes(“Achat”) || e.position.includes(“Accumuler”) ? green : “#f59e0b”, color: “#fff” }}>{e.position}</span>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(3, 1fr)”, gap: 8, fontSize: 11 }}>
<div><span style={{ color: textSec }}>Dernière Surprise</span><br/><span style={{ fontWeight: 600, color: e.surprise.startsWith(”+”) ? green : red }}>{e.surprise}</span></div>
<div><span style={{ color: textSec }}>Historique</span><br/><span style={{ fontWeight: 600, color: text }}>{e.history}</span></div>
<div><span style={{ color: textSec }}>Move implicite</span><br/><span style={{ fontWeight: 600, color: text }}>{e.implied}</span></div>
</div>
</div>
))}
</div>
);
};

// TAB: BRIEFING HEBDO
const WeeklyBriefing = () => (
<div>
<div style={{ …cardStyle, background: `linear-gradient(135deg, #4c1d95, #1e1b4b)`, border: “none”, color: “#fff” }}>
<div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2, textTransform: “uppercase” }}>Briefing Hebdomadaire</div>
<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Semaine du 3 Mars 2026</div>
<div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Données basées sur la dernière mise à jour</div>
</div>

```
  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 8 }}>🗓 3 Événements Macro Clés</div>
    {[
      { event: "BCE — Décision taux directeur", date: "Jeudi", impact: "La BCE devrait maintenir les taux à 2.65%. Tout signal dovish soutiendrait les actions européennes." },
      { event: "Emploi US — NFP", date: "Vendredi", impact: "Consensus à +180K. Un chiffre faible relancerait les anticipations de baisse Fed, positif pour les marchés." },
      { event: "Tarifs US-UE — Évolutions", date: "En cours", impact: "Les menaces tarifaires de Trump sur l'UE pèsent sur l'automobile (Renault) et la chimie (Arkema)." }
    ].map((e, i) => (
      <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{e.event}</span>
          <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{e.date}</span>
        </div>
        <div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>{e.impact}</div>
      </div>
    ))}
  </div>

  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 8 }}>📊 Résultats Importants</div>
    {[
      { name: "Publicis Groupe", date: "17 Avr", est: "BPA est. 1.95€ · CA est. 3.5Mds€" },
      { name: "Capgemini", date: "30 Avr", est: "BPA est. 6.10€ · CA est. 5.6Mds€" },
    ].map((e, i) => (
      <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between" }}>
        <div><span style={{ fontSize: 13, fontWeight: 600, color: text }}>{e.name}</span><br/><span style={{ fontSize: 11, color: textSec }}>{e.est}</span></div>
        <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{e.date}</span>
      </div>
    ))}
  </div>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <div style={{ ...cardStyle, borderLeft: `4px solid ${green}` }}>
      <div style={{ fontSize: 11, color: green, fontWeight: 700, textTransform: "uppercase" }}>Idée Long</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: text, marginTop: 4 }}>CAPGEMINI</div>
      <div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>Entrée: 108€ · Stop: 95€ · Obj: 140€</div>
      <div style={{ fontSize: 11, color: textSec, marginTop: 4 }}>RSI survendu, décote sectorielle massive, catalyste résultats fin avril. R/R: 2.5:1</div>
    </div>
    <div style={{ ...cardStyle, borderLeft: `4px solid ${red}` }}>
      <div style={{ fontSize: 11, color: red, fontWeight: 700, textTransform: "uppercase" }}>Idée Short / Couverture</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: text, marginTop: 4 }}>RENAULT</div>
      <div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>Alléger autour de 30€ · Risque tarifs US</div>
      <div style={{ fontSize: 11, color: textSec, marginTop: 4 }}>Exposition tarifs, concurrence EV chinoise, momentum très négatif</div>
    </div>
  </div>

  <div style={{ ...cardStyle, borderLeft: `4px solid #f59e0b` }}>
    <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase" }}>⚠️ Risque de la Semaine</div>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginTop: 4 }}>Escalade tarifaire US-UE</div>
    <div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>
      L'administration Trump envisage de nouvelles taxes sur les importations européennes. Impact direct sur Renault, Arkema, et SEB.
      Couverture recommandée via ETF inverse ou allègement des positions cycliques exposées au commerce transatlantique.
    </div>
  </div>

  <div style={cardStyle}>
    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 8 }}>🔄 Mise à Jour Automatique</div>
    <div style={{ fontSize: 12, color: textSec, lineHeight: 1.6 }}>
      Pour automatiser les mises à jour chaque lundi à 9h sans API, vous pouvez utiliser GitHub Actions avec un workflow CRON.
      Demandez à Claude de générer un nouveau code d'analyse chaque semaine, puis copiez-collez le code mis à jour dans votre repository GitHub.
      Le fichier sera automatiquement déployé via GitHub Pages.
    </div>
    <div style={{ marginTop: 12, padding: 12, background: bg, borderRadius: 8, fontSize: 11, fontFamily: "monospace", color: textSec }}>
      # .github/workflows/update.yml<br/>
      name: Weekly Update<br/>
      on:<br/>
      &nbsp;&nbsp;schedule:<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;- cron: '0 7 * * 1' # Lundi 9h CET<br/>
      &nbsp;&nbsp;workflow_dispatch:<br/>
      jobs:<br/>
      &nbsp;&nbsp;deploy:<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;runs-on: ubuntu-latest<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;steps:<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- uses: actions/checkout@v4<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- run: echo "Remplacer index.jsx"<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- uses: peaceiris/actions-gh-pages@v3
    </div>
  </div>
</div>
```

);

const tabs = [Overview, Positions, GoldmanSachs, MorganStanley, Bridgewater, BlackRock, Citadel, JPMorgan, WeeklyBriefing];
const TabContent = tabs[activeTab];

return (
<div style={{ background: bg, minHeight: “100vh”, fontFamily: “‘SF Pro Display’, -apple-system, BlinkMacSystemFont, ‘Segoe UI’, sans-serif”, color: text, maxWidth: 480, margin: “0 auto”, position: “relative” }}>
{/* Header */}
<div style={{ padding: “16px 20px 0”, display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Portfolio <span style={{ color: accent }}>Pro</span></div>
<button onClick={() => setDarkMode(!darkMode)} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: “6px 12px”, fontSize: 14, cursor: “pointer”, color: text }}>
{darkMode ? “☀️” : “🌙”}
</button>
</div>

```
  {/* Tab Navigation */}
  <div style={{ padding: "12px 20px", overflowX: "auto", display: "flex", gap: 6, scrollbarWidth: "none" }}>
    {TABS.map((t, i) => (
      <button key={t} onClick={() => setActiveTab(i)} style={pillStyle(activeTab === i)}>{t}</button>
    ))}
  </div>

  {/* Content */}
  <div style={{ padding: "0 16px 100px" }}>
    <TabContent />
  </div>

  {/* Bottom Nav */}
  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: card, borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-around", padding: "10px 0 24px", zIndex: 10 }}>
    {[{ icon: "📊", label: "Vue", tab: 0 }, { icon: "📋", label: "Positions", tab: 1 }, { icon: "🏦", label: "Analyses", tab: 2 }, { icon: "📰", label: "Briefing", tab: 8 }].map(n => (
      <button key={n.label} onClick={() => setActiveTab(n.tab)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", color: activeTab === n.tab ? accent : textSec, fontSize: 10, fontWeight: 600 }}>
        <span style={{ fontSize: 20 }}>{n.icon}</span>{n.label}
      </button>
    ))}
  </div>
</div>
```

);
}

export default App;
