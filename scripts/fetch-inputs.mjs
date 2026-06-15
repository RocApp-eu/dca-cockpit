// Récupération des deux entrées publiques du signal.
// Aucune clé d'API requise. Node 20+ (fetch global).

/**
 * Indice Fear & Greed crypto, moyenne des 7 derniers jours.
 * Source : alternative.me (gratuit, sans clé).
 * @returns {Promise<number>} 0 à 100
 */
export async function fetchFearGreed7d() {
  const res = await fetch("https://api.alternative.me/fng/?limit=7&format=json", {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Fear & Greed: HTTP ${res.status}`);
  }
  const json = await res.json();
  const points = Array.isArray(json?.data) ? json.data : [];
  const values = points
    .map((p) => Number(p.value))
    .filter((v) => Number.isFinite(v));
  if (values.length === 0) {
    throw new Error("Fear & Greed: aucune donnée exploitable");
  }
  const avg = values.reduce((a, v) => a + v, 0) / values.length;
  return avg;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function drawdownFromCloses(closes, label) {
  const clean = closes.filter((v) => Number.isFinite(v) && v > 0);
  if (clean.length < 30) {
    throw new Error(`${label}: historique trop court (${clean.length})`);
  }
  const lastClose = clean[clean.length - 1];
  const peak = Math.max(...clean);
  const drawdown = peak > 0 ? lastClose / peak - 1 : 0;
  return { drawdown: Math.min(0, drawdown), lastClose, peak };
}

async function fromYahoo(symbol) {
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  const delays = [0, 1500, 4000];
  let lastErr;
  for (const delay of delays) {
    if (delay) await sleep(delay);
    for (const host of hosts) {
      try {
        const url = `https://${host}/v8/finance/chart/${symbol}?range=1y&interval=1d`;
        const res = await fetch(url, {
          headers: { "user-agent": BROWSER_UA, accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Yahoo ${symbol} (${host}): HTTP ${res.status}`);
        const json = await res.json();
        const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
        return drawdownFromCloses(closes, `Yahoo ${symbol}`);
      } catch (err) {
        lastErr = err;
      }
    }
  }
  throw lastErr ?? new Error("Yahoo Finance: échec inconnu");
}

async function fromNasdaq(symbol) {
  // api.nasdaq.com exige un User-Agent de navigateur, sinon il bloque.
  const now = new Date();
  const to = now.toISOString().slice(0, 10);
  const from = new Date(now.getTime() - 372 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  const url = `https://api.nasdaq.com/api/quote/${symbol}/chart?assetclass=etf&fromdate=${from}&todate=${to}`;
  const res = await fetch(url, {
    headers: { "user-agent": BROWSER_UA, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Nasdaq ${symbol}: HTTP ${res.status}`);
  const json = await res.json();
  const chart = json?.data?.chart;
  if (!Array.isArray(chart)) {
    throw new Error(`Nasdaq ${symbol}: ${json?.status?.rCode || "pas de chart"}`);
  }
  const closes = chart.map((p) => Number(p?.y ?? p?.z?.close));
  return drawdownFromCloses(closes, `Nasdaq ${symbol}`);
}

async function fromAlphaVantage(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Alpha Vantage ${symbol}: HTTP ${res.status}`);
  const json = await res.json();
  const series = json?.["Time Series (Daily)"];
  if (!series) {
    throw new Error(
      `Alpha Vantage ${symbol}: ${json?.Note || json?.Information || "pas de série"}`,
    );
  }
  const closes = Object.keys(series)
    .sort() // dates croissantes
    .slice(-260)
    .map((d) => Number(series[d]["4. close"]));
  return drawdownFromCloses(closes, `Alpha Vantage ${symbol}`);
}

/**
 * Drawdown MSCI World sur 52 semaines, via l'ETF iShares MSCI World (URTH)
 * comme proxy de l'indice.
 * Source principale : API chart Yahoo Finance (gratuite, sans clé).
 * Repli : Alpha Vantage si la variable ALPHAVANTAGE_KEY est présente
 * (clé gratuite, 25 requêtes/jour, largement suffisant pour un run hebdo).
 * @returns {Promise<{ drawdown: number, lastClose: number, peak: number }>}
 *          drawdown négatif, ex: -0.082 pour -8,2 %.
 */
export async function fetchMsciDrawdown52w(symbol = process.env.MSCI_SYMBOL || "URTH") {
  const errors = [];
  // Sources testées dans l'ordre. Nasdaq est sans clé et passe depuis les IP
  // datacenter (GitHub Actions), contrairement à Yahoo qui renvoie 429.
  const sources = [
    () => fromNasdaq(symbol),
    () => fromYahoo(symbol),
  ];
  if (process.env.ALPHAVANTAGE_KEY) {
    sources.push(() => fromAlphaVantage(symbol, process.env.ALPHAVANTAGE_KEY));
  }
  for (const src of sources) {
    try {
      return await src();
    } catch (err) {
      errors.push(err.message);
    }
  }
  throw new Error(`Toutes les sources de drawdown ont échoué: ${errors.join(" | ")}`);
}
