# Branchement du Cockpit, état et checklist

Mise à jour : 2026-06-15. Le cockpit n'était qu'une maquette statique. Il est
maintenant branché sur Firebase (Auth + Firestore) et un cron publie le signal
chaque semaine. Ce document liste ce qui marche, ce qui reste à activer de ton
côté, et ce qui est volontairement laissé statique.

## Ce qui est branché (code prêt)

- **Authentification** : page `/login` (email + Google, inscription incluse),
  protection de `/dashboard` (redirection vers `/login` si pas de session),
  déconnexion et profil réels dans la barre latérale.
- **Données utilisateur (Firestore)** :
  - Portefeuille : ajout / édition / suppression de supports, recherche, filtre,
    allocation calculée.
  - Réglages DCA : éditables et persistés (montant, fréquence, allocation,
    courtier, plafond du multiplicateur).
  - Versements : le bouton « Confirmer le versement » enregistre un versement,
    repris dans « Capital versé » et « Derniers versements ».
- **Signal en direct** : `SignalHero`, le bandeau de tête, les stats et
  l'historique 8 semaines lisent la collection `signals`.
- **Cron** : `.github/workflows/weekly-signal.yml` lance `scripts/publish-signal.mjs`
  chaque dimanche. Il récupère le Fear & Greed (alternative.me) et le drawdown
  MSCI World (proxy ETF iShares World `URTH`, via Yahoo Finance), calcule le
  multiplicateur lissé et écrit dans Firestore.
- **Navigation** : plus aucun lien mort. Les entrées du menu pointent vers les
  sections de la page ou vers des pages « bientôt » (méthode, Fear & Greed,
  MSCI World, premium).

## Déjà fait dans la console (le 2026-06-15)

- ✅ **Authentification activée** : Email/Password + Google.
- ✅ **Domaines autorisés** : `localhost` (dev) et **`dca.rocapp.eu`** (prod).
  Le domaine est donc tranché : c'est `dca.rocapp.eu`. Le `cockpit.rocapp.eu`
  du CLAUDE.md est obsolète.
- ✅ **Règles Firestore publiées et vérifiées en direct** : la collection
  `signals` répond 200 en lecture publique, `users` répond 403 sans session
  (réservé au propriétaire).

## À activer de ton côté (il ne reste que ça)

1. **Créer le compte de service du cron** :
   - Console → Paramètres du projet → Comptes de service → Générer une nouvelle
     clé privée. Un fichier JSON se télécharge (ne le committe jamais, il est
     déjà ignoré par git).
   - GitHub → repo `RocApp-eu/dca-cockpit` → Settings → Secrets and variables →
     Actions → New repository secret :
     - Nom : `FIREBASE_SERVICE_ACCOUNT`
     - Valeur : tout le contenu du fichier JSON.
   - Optionnel : secret `ALPHAVANTAGE_KEY` (clé gratuite alphavantage.co) comme
     repli si Yahoo Finance est indisponible un dimanche.

2. **Publier le premier signal** (sinon le cockpit affiche « en attente ») :
   - GitHub → Actions → « Publication du signal hebdomadaire » → Run workflow.
   - Vérifier dans Firestore qu'un document `signals/2026-Wxx` est apparu.

3. **Déployer le site** (domaine = `dca.rocapp.eu`, déjà autorisé côté Firebase) :
   - `cd web && npm ci && npm run build`
   - `npx wrangler deploy` (depuis la racine du repo).
   - `git push` via GitHub Desktop pour que le cron tourne (les Actions ne
     s'exécutent qu'une fois le workflow poussé sur GitHub).

## Tester en local

```
cd web && npm run dev          # http://localhost:3000
node scripts/publish-signal.mjs --dry-run            # teste fetch + calcul, sans écrire
node scripts/publish-signal.mjs --dry-run --fg=25 --dd=-0.082 --prev=1.4   # entrées manuelles
```

## Volontairement laissé statique (à brancher plus tard)

Ces blocs affichent encore un contenu de démonstration. Les brancher demande
chacun un chantier à part, pas juste du câblage :

- **Diagnostic IA** : nécessite un appel LLM (Claude). Impossible côté client
  sans exposer une clé. À faire via un petit Worker Cloudflare qui appelle
  l'API Anthropic avec le portefeuille de l'utilisateur.
- **Évolution du capital (graphe)** : il faut un historique de valorisation. On
  ne stocke aujourd'hui que les valeurs déclarées et les versements.
- **Chiffres du backtest 10 ans** (panneau « Preuve par la data ») :
  illustratifs. Vrais chiffres = moteur de backtest à écrire.
- **Liens brokers (affiliation)** : les `href` sont à « # ». Mettre tes vrais
  liens d'affiliation (Trade Republic, Bitpanda, Shares).
- **Bannière iOS et AdSense** : lien App Store réel + compte/script AdSense.
- **Import CSV du portefeuille** : bouton désactivé, fonctionnalité à venir.
- **Paiement Premium** : page `/dashboard/premium` en placeholder, Stripe à
  brancher.

## Modèle de données Firestore

- `signals/{annee-Wsemaine}` : signal hebdo (public en lecture, écrit par le cron).
- `users/{uid}` : profil + `settings` (réglages DCA).
- `users/{uid}/holdings/{id}` : lignes du portefeuille.
- `users/{uid}/deposits/{id}` : versements confirmés.
