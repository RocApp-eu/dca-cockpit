// Publication hebdomadaire du signal DCA dans Firestore.
//
// Usage :
//   node scripts/publish-signal.mjs --dry-run [--prev=1.4]
//   node scripts/publish-signal.mjs            (écrit dans Firestore)
//
// En écriture, attend les identifiants admin dans l'une de ces variables :
//   FIREBASE_SERVICE_ACCOUNT  = contenu JSON du compte de service
//   GOOGLE_APPLICATION_CREDENTIALS = chemin vers le fichier JSON

import { fetchFearGreed7d, fetchMsciDrawdown52w } from "./fetch-inputs.mjs";
import { buildSignalDoc } from "./signal-core.mjs";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const prevArg = args.find((a) => a.startsWith("--prev="));
const prevOverride = prevArg ? Number(prevArg.split("=")[1]) : null;

function log(...a) {
  console.log("[publish-signal]", ...a);
}

async function loadHistory() {
  // Renvoie { previousMultiplier, recentMultipliers, monthMultipliers, db, admin }
  let admin;
  try {
    admin = await import("firebase-admin");
  } catch {
    throw new Error(
      "firebase-admin introuvable. Lancez `npm install` dans scripts/ ou utilisez --dry-run.",
    );
  }

  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (svcJson) {
    admin.default.initializeApp({
      credential: admin.default.credential.cert(JSON.parse(svcJson)),
    });
  } else {
    // S'appuie sur GOOGLE_APPLICATION_CREDENTIALS.
    admin.default.initializeApp({
      credential: admin.default.credential.applicationDefault(),
    });
  }

  const db = admin.default.firestore();
  const snap = await db
    .collection("signals")
    .orderBy("sortKey", "desc")
    .limit(8)
    .get();
  const docs = snap.docs.map((d) => d.data());

  const now = new Date();
  const curMonth = now.getUTCMonth() + 1;
  const curYear = now.getUTCFullYear();

  const previousMultiplier = docs.length ? Number(docs[0].multiplier) : null;
  const recentMultipliers = docs.map((d) => Number(d.multiplier));
  const monthMultipliers = docs
    .filter((d) => Number(d.year) === curYear && Number(d.month) === curMonth)
    .map((d) => Number(d.multiplier));

  return {
    previousMultiplier,
    recentMultipliers,
    monthMultipliers,
    db,
    admin: admin.default,
  };
}

function numArg(name) {
  const a = args.find((x) => x.startsWith(`${name}=`));
  return a ? Number(a.split("=")[1]) : null;
}

async function main() {
  const fgOverride = numArg("--fg");
  const ddOverride = numArg("--dd");

  let fearGreed;
  let msciDrawdown;

  if (Number.isFinite(fgOverride) && Number.isFinite(ddOverride)) {
    fearGreed = fgOverride;
    msciDrawdown = ddOverride;
    log(`Entrées fournies manuellement : FG=${fearGreed} | DD=${msciDrawdown}`);
  } else {
    log("Récupération des entrées publiques…");
    const [fg, ddInfo] = await Promise.all([
      fetchFearGreed7d(),
      fetchMsciDrawdown52w(),
    ]);
    fearGreed = fg;
    msciDrawdown = ddInfo.drawdown;
    log(
      `Fear & Greed 7j = ${fearGreed.toFixed(1)} | Drawdown World = ${(
        msciDrawdown * 100
      ).toFixed(2)} % (close ${ddInfo.lastClose}, peak ${ddInfo.peak})`,
    );
  }

  const now = new Date();

  if (DRY_RUN) {
    const doc = buildSignalDoc({
      fearGreed,
      msciDrawdown,
      previousMultiplier: Number.isFinite(prevOverride) ? prevOverride : null,
      recentMultipliers: [],
      monthMultipliers: [],
      now,
    });
    log("DRY RUN, document calculé (non écrit) :");
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  const { previousMultiplier, recentMultipliers, monthMultipliers, db, admin } =
    await loadHistory();

  const doc = buildSignalDoc({
    fearGreed,
    msciDrawdown,
    previousMultiplier,
    recentMultipliers,
    monthMultipliers,
    now,
  });

  await db
    .collection("signals")
    .doc(doc.weekId)
    .set(
      { ...doc, publishedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );

  log(`Signal ${doc.weekId} publié : ×${doc.multiplier} (trend ${doc.trend}).`);
}

main().catch((err) => {
  console.error("[publish-signal] échec :", err);
  process.exit(1);
});
