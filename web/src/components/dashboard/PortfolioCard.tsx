type PfType = "etf" | "action" | "crypto";

type Holding = {
  type: PfType;
  typeLabel: string;
  name: string;
  code: string;
  isin: string;
  quantity: string;
  value: string;
  allocationPct: number;
};

const HOLDINGS: Holding[] = [
  {
    type: "etf",
    typeLabel: "ETF",
    name: "iShares Core MSCI World",
    code: "SWDA · iShares · Capitalisant",
    isin: "IE00B4L5Y983",
    quantity: "42,3210",
    value: "4 128 €",
    allocationPct: 48.8,
  },
  {
    type: "etf",
    typeLabel: "ETF",
    name: "Amundi MSCI World",
    code: "CW8 · Amundi · Capitalisant",
    isin: "LU1681043599",
    quantity: "8,1400",
    value: "1 685 €",
    allocationPct: 19.9,
  },
  {
    type: "etf",
    typeLabel: "ETF",
    name: "Amundi MSCI Emerging Markets",
    code: "AEEM · Amundi · Capitalisant",
    isin: "LU1681045370",
    quantity: "18,0000",
    value: "724 €",
    allocationPct: 8.6,
  },
  {
    type: "action",
    typeLabel: "Action",
    name: "LVMH Moët Hennessy",
    code: "MC · Euronext Paris",
    isin: "FR0000121014",
    quantity: "1,5000",
    value: "968 €",
    allocationPct: 11.4,
  },
  {
    type: "crypto",
    typeLabel: "Crypto",
    name: "Bitcoin",
    code: "BTC · portefeuille principal",
    isin: "—",
    quantity: "0,0124",
    value: "782 €",
    allocationPct: 9.3,
  },
  {
    type: "crypto",
    typeLabel: "Crypto",
    name: "Ethereum",
    code: "ETH · portefeuille principal",
    isin: "—",
    quantity: "0,1820",
    value: "168 €",
    allocationPct: 2.0,
  },
];

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

export function PortfolioCard() {
  return (
    <div className="portfolio-card">
      <div className="portfolio-head">
        <div>
          <h3>
            Vos lignes, <em>une par une</em>.
          </h3>
          <p>
            Déclarez vos ETF, actions et cryptomonnaies. Recherche par nom, ticker ou code ISIN. Les
            données de cotation sont mises à jour quotidiennement.
          </p>
        </div>
        <div className="portfolio-actions">
          <button type="button" className="btn-ghost">
            Importer CSV
          </button>
          <button type="button" className="btn-add">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ajouter un support
          </button>
        </div>
      </div>

      <div className="portfolio-search">
        <div className="input">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          Rechercher un support, nom, ticker ou ISIN
          <span className="ex">ex. IE00B4L5Y983 · BTC · AAPL</span>
        </div>
        <select defaultValue="all" aria-label="Filtrer par type">
          <option value="all">Tous les types</option>
          <option value="etf">ETF</option>
          <option value="action">Actions</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      <table className="portfolio-table">
        <thead>
          <tr>
            <th style={{ width: 90 }}>Type</th>
            <th>Support</th>
            <th>Identifiant</th>
            <th className="num">Quantité</th>
            <th className="num">Valeur</th>
            <th className="num" style={{ width: 160 }}>
              Allocation
            </th>
            <th style={{ width: 40 }} />
          </tr>
        </thead>
        <tbody>
          {HOLDINGS.map((h) => (
            <tr key={h.name}>
              <td>
                <span className={`pf-type ${h.type}`}>{h.typeLabel}</span>
              </td>
              <td>
                <div className="pf-asset">
                  <span className="name">{h.name}</span>
                  <span className="code">{h.code}</span>
                </div>
              </td>
              <td className="pf-isin">{h.isin}</td>
              <td className="num">{h.quantity}</td>
              <td className="num">{h.value}</td>
              <td className="num">
                <span className="pf-bar">
                  <span style={{ width: `${h.allocationPct}%` }} />
                </span>
                <span className="pf-pct">
                  {h.allocationPct.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} %
                </span>
              </td>
              <td>
                <button type="button" className="pf-action-btn" title="Modifier">
                  <EditIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="portfolio-foot">
        <span>6 LIGNES DÉCLARÉES · DERNIÈRE MAJ, 22.04.2026</span>
        <div className="totals">
          <span>
            <span className="k">Valeur totale</span>
            <span className="v">8 455 €</span>
          </span>
          <span>
            <span className="k">Versé cumulé</span>
            <span className="v">8 450 €</span>
          </span>
        </div>
      </div>
    </div>
  );
}
